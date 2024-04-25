import datetime
import statistics
from datetime import date
from typing import Any, Sequence

from django_stubs_ext import QuerySetAny

from employee_cards.models import (
    Counterparty,
    CounterpartyInvoice,
    PriceChangeLog,
)

from invoice_analysis.models import Invoice

from .counterparty_detail_service import CounterpartyDetailService


class CounterpartiesDBService:
    current_year = date.today().year

    @staticmethod
    def update_price_change_table(
        invoices: QuerySetAny[Invoice, Invoice],
        counterparty: Counterparty,
    ) -> None:
        nomenclature_names = []
        nomenclature_amounts: dict[str, Any] = {}
        nomenclature_min_price: dict[str, Any] = {}
        nomenclature_max_price: dict[str, Any] = {}

        for invoice in invoices:
            nomenclature = f"{invoice.nomenclature}"

            if invoice.amount <= 1:
                current_price = float(invoice.total)
            else:
                current_price = float(invoice.total) / invoice.amount

            if nomenclature not in nomenclature_names:
                nomenclature_names.append(nomenclature)
                nomenclature_amounts[nomenclature] = round(invoice.amount)
                nomenclature_min_price[nomenclature] = current_price
                nomenclature_max_price[nomenclature] = current_price
            else:
                nomenclature_amounts[nomenclature] = (
                    nomenclature_amounts[nomenclature] + invoice.amount
                )
                if nomenclature_max_price[nomenclature] < current_price:
                    nomenclature_max_price[nomenclature] = current_price
                if nomenclature_min_price[nomenclature] > current_price:
                    nomenclature_min_price[nomenclature] = current_price

        for nomenclature in nomenclature_names:
            min_price = nomenclature_min_price[nomenclature]
            max_price = nomenclature_max_price[nomenclature]
            amount = round(nomenclature_amounts[nomenclature])

            logs = PriceChangeLog.objects.filter(
                nomenclature=nomenclature,
                counterparty=counterparty,
            )
            if not logs.exists():
                PriceChangeLog.objects.create(
                    min_price=min_price,
                    max_price=max_price,
                    amount=amount,
                    nomenclature=nomenclature,
                    counterparty=counterparty,
                )
            else:
                for log in logs:
                    log.min_price = min_price
                    log.max_price = max_price
                    log.amount = amount
                    log.save()

    @staticmethod
    def string_to_date(string: str) -> date:
        return datetime.datetime.strptime(string[0:10], "%d.%m.%Y").date()

    @staticmethod
    def filter_invoices_for_counterparty(
        invoices: list[dict[str, Any]], inn: str
    ) -> list[dict[str, Any]]:
        return list(filter(lambda x: inn in x["ИНН"], invoices))

    @classmethod
    def filter_invoices_for_current_year(
        cls, invoices: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:
        return list(
            filter(
                lambda x: cls.current_year == x["Дата"].year,
                invoices,
            )
        )

    @classmethod
    def get_stdev_and_load_by_month(
        cls, invoices_in_current_year: list[dict[str, Any]]
    ) -> Sequence[float]:
        month_counter: dict[str, int] = {}

        for invoice in invoices_in_current_year:
            invoice["Дата"] = (
                invoice["Дата"].strftime("%d.%m.%Y").replace(" ", "")
            )
            month_counter[invoice["Дата"][3:5]] = (
                month_counter.get(invoice["Дата"][3:5], 0) + 1
            )

            if isinstance(invoice["Всего"], str):
                invoice["Всего"] = float(invoice["Всего"].replace("\xa0", ""))

        data = [
            float(invoice["Всего"]) for invoice in invoices_in_current_year
        ]

        load_by_month = 0.0
        if month_counter.values():
            load_by_month = len(month_counter.keys()) / 12
        stdev = 0.0
        if len(data) >= 2:
            stdev = statistics.stdev(data)

        return stdev, load_by_month

    @classmethod
    def update_counterparty_invoices(
        cls,
        counterparty: Counterparty,
        current_counterparty_invoices: list[dict[str, Any]],
    ) -> None:
        counterparty.invoices.all().delete()
        CounterpartyInvoice.objects.bulk_create(
            [
                CounterpartyInvoice(
                    counterparty=counterparty,
                    date=invoice["Дата"]
                    if isinstance(invoice["Дата"], datetime.date)
                    else cls.string_to_date(invoice["Дата"]),
                    nomenclature=invoice["Номенклатура"],
                    total=invoice["Всего"],
                )
                for invoice in current_counterparty_invoices
            ]
        )

    @classmethod
    def update_counterparties_in_db(cls) -> None:
        invoices: list[
            dict[str, Any]
        ] | None = CounterpartyDetailService.get_all_invoices()
        if invoices is None:
            return

        counterparties = Counterparty.objects.all()
        for counterparty in counterparties:
            inn = counterparty.inn
            current_counterparty_invoices = (
                cls.filter_invoices_for_counterparty(invoices, inn)
            )
            current_counterparty_clear_invoices = Invoice.objects.filter(
                counterparty=counterparty
            )

            if len(current_counterparty_invoices) == 0:
                continue

            counterparty_total = sum(
                [
                    invoice.get("Всего", 0)
                    for invoice in current_counterparty_invoices
                ]
            )

            invoices_in_current_year = cls.filter_invoices_for_current_year(
                current_counterparty_invoices
            )
            stdev, load_by_month = cls.get_stdev_and_load_by_month(
                invoices_in_current_year
            )

            cls.update_counterparty_invoices(
                counterparty,
                current_counterparty_invoices,
            )
            cls.update_price_change_table(
                current_counterparty_clear_invoices,
                counterparty,
            )

            counterparty.standard_deviation = stdev
            counterparty.load_by_month = load_by_month
            counterparty.total = counterparty_total
            counterparty.save()
