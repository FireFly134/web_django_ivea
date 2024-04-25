import re
from typing import Any

from invoice_analysis.models import Invoice

from overhead_costs.models import BankState, MonthTotal


class OverheadCostsCompiler:
    __invoices_list: list[dict[Any, Any]]
    __doc_nums: set[Any]

    __regex: re.Pattern[str] = re.compile(r"\d{1,}")

    __trigger_words: list[str] = [
        "комиссия",
        "единый налоговый платеж",
        "заработная плата",
        "возврат",
        "заработной",
        "взносы",
        "алиментов",
        "членские взносы",
        "абонентская",
    ]

    __table_columns: list[str] = [
        "Дата",
        "Контрагент",
        "Номенклатура",
        "Кол",
        "Ед.изм.",
        "Цена",
        "Сумма",
        "НДС",
        "Всего",
    ]

    def processing_invoices(self) -> None:
        invoices_list: list[dict[Any, Any]] = []
        doc_nums: set[Any] = set()

        invoices = Invoice.objects.all().exclude(info="Удален")

        for invoice in invoices:
            doc_nums.add(invoice.incoming_document_number)

            if not invoice.comment:
                continue

            if re.findall(self.__regex, invoice.comment):
                continue

            doc_num = invoice.incoming_document_number

            invoices_list.append(
                {
                    "Дата": invoice.date,
                    "Контрагент": invoice.counterparty,
                    "Номенклатура": invoice.nomenclature,
                    "Количество": invoice.amount,
                    "Номенклатура_Единица": invoice.unit,
                    "Цена": invoice.price,
                    "Сумма": invoice.second_sum,
                    "НДС": invoice.vat,
                    "Всего": invoice.total,
                    "Номер_входящего_документа": doc_num,
                }
            )

        self.__first_invoices_list: list[dict[Any, Any]] = invoices_list
        self.__doc_nums: set[Any] = doc_nums

    def processing_bank_state(self) -> None:
        csv_list: list[Any] = []

        banskstate_list = BankState.objects.exclude(debiting_sum=None)

        for row in banskstate_list:
            continue_flag: bool = False
            continue_flag_2: bool = False

            for word in self.__trigger_words:
                if "возврат" in row.appointment.lower():
                    continue
                if word.lower() in str(row.appointment).lower():
                    self.__add_row_to_csv_list(csv_list, row)
                    continue_flag = True
                    break

            if continue_flag:
                continue

            if "оплата" in row.appointment.lower():
                for num in self.__doc_nums:
                    if len(num.split()) > 1:
                        if num in row.appointment:
                            continue_flag_2 = True
                            break

                    for element in row.appointment.split():
                        if len(element) == len(num) and element == num:
                            continue_flag_2 = True
                            break
                        if (
                            len(element) == len(num) + 1
                            and element == f"№{num}"
                        ):
                            continue_flag_2 = True
                            break
            else:
                continue_flag_2 = True

            if continue_flag_2:
                continue

            self.__add_row_to_csv_list(csv_list, row)

        self.__second_invoices_list: list[Any] = csv_list

    @staticmethod
    def __add_row_to_csv_list(csv_list: list[Any], row: BankState) -> None:
        final_dict: dict[Any, Any] = {
            **row.to_dict(),
            **{
                "Количество": 1,
                "Номенклатура_Единица": "шт",
                "НДС": "",
                "Сумма": "",
                "Номер_входящего_документа": "",
            },
        }
        final_dict = {**final_dict, **{"Цена": final_dict["Всего"]}}

        csv_list.append(final_dict)

    def data_processing(self) -> None:
        self.processing_invoices()
        self.processing_bank_state()
        self.concat_invoices()

    def concat_invoices(self) -> None:
        all_invoices = []
        all_invoices.extend(self.__first_invoices_list)
        all_invoices.extend(self.__second_invoices_list)
        all_invoices = sorted(
            all_invoices, key=lambda x: x["Всего"], reverse=True
        )

        self.__invoices_list = all_invoices

    @property
    def year_dict(self) -> list[Any]:
        years_dict: dict[Any, Any] = dict()
        for invoice in self.__invoices_list:
            date_string = invoice["Дата"].strftime("%d.%m.%Y")
            month, year = date_string[3:5], date_string[6:10]

            if not years_dict.get(year):
                years_dict[year] = dict()
            if not years_dict[year].get(month):
                years_dict[year][month] = list()

            years_dict[year][month].append(invoice)

        # Sort dict & total sum for month
        years_dict = dict(sorted(years_dict.items(), key=lambda x: x[0]))
        all_totals: list[str] = list()
        for year in years_dict.keys():
            years_dict[year] = dict(
                sorted(years_dict[year].items(), key=lambda x: x[0])
            )
            for month in years_dict[year].keys():
                total: float = 0
                for invoice in years_dict[year][month]:
                    total += float(invoice["Всего"])

                years_dict[year][month].insert(
                    0, f"{round(total, 2):,}".replace(",", "\u00A0")
                )
                all_totals.append(f"{year}_{month}={round(total, 2)}")

        for month_total in all_totals:
            splitted_res = month_total.split("_")
            year = int(splitted_res[0])
            splitted_res = splitted_res[1].split("=")
            month, total = int(splitted_res[0]), float(splitted_res[1])

            if MonthTotal.objects.filter(year=year, month=month).exists():
                MonthTotal.objects.filter(year=year, month=month).delete()
            MonthTotal.objects.create(year=year, month=month, total=total)

        return list(years_dict.keys())

    @property
    def invoices(self) -> list[dict[Any, Any]]:
        return self.__invoices_list

    @property
    def headers(self) -> list[str]:
        return self.__table_columns
