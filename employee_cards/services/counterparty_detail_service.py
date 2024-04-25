from typing import Any

from employee_cards.models import Counterparty

from invoice_analysis.services import InvoiceCompiler

import pandas as pd


class CounterpartyDetailService:
    @staticmethod
    def title_to_general_format(title: str) -> str:
        return (
            title.replace('"', "")
            .replace("«", "")
            .replace("»", "")
            .replace("ООО", "")
            .replace("ИП", "")
            .replace(" ", "")
            .lower()
        )

    @classmethod
    def try_parse_to_float(
        cls, parsing_string: Any, placeholder: int | float = 0
    ) -> Any:
        if pd.isna(parsing_string):
            return placeholder

        future_float = parsing_string
        if not isinstance(parsing_string, float | int):
            try:
                future_float = float(cls.to_convertable_float(parsing_string))
            except ValueError:
                future_float = placeholder

        return future_float

    @staticmethod
    def to_convertable_float(string: str) -> str:
        return string.replace("\xa0", "").replace(",", ".")

    @classmethod
    def get_context_by_name(cls, title: str) -> list[dict[str, Any]] | None:
        title = cls.title_to_general_format(title)

        invoices: list[dict[str, Any]] | None = cls.get_all_invoices()

        if not invoices:
            return None

        return list(filter(lambda x: x["Контрагент"] == title, invoices))

    @classmethod
    def get_all_invoices(cls) -> list[dict[str, Any]] | None:
        compiler = InvoiceCompiler()
        compiler.data_processing()

        invoices: list[dict[str, Any]] = compiler.invoices

        for invoice in invoices:
            title = ""

            if isinstance(invoice["Контрагент"], Counterparty):
                title = invoice["Контрагент"].title
            elif isinstance(invoice["Контрагент"], str):
                title = invoice["Контрагент"]
            elif invoice["Алиас"]:
                title = invoice["Алиас"]

            invoice["Контрагент"] = cls.title_to_general_format(title)

            if not invoice["НДС"]:
                invoice["НДС"] = 0

            invoice["Всего"] = float(invoice["Всего"])
            invoice["НДС"] = float(invoice["НДС"])
            invoice["Цена"] = float(invoice["Цена"])

        return invoices
