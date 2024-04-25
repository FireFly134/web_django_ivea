import re
from decimal import Decimal
from typing import Any

from db_utils import engine

from invoice_analysis.models import ContractInvoice, Invoice

import pandas as pd


class ContractInvoiceSaver:
    __regex: re.Pattern[str] = re.compile(r"\d+")

    def __init__(self, invoice: Invoice) -> None:
        self.__invoice = invoice

    def __read_contract_df(self) -> None:
        df_1: pd.DataFrame = pd.read_sql(
            "SELECT doc_name, document_id, sum_stage \
                FROM doc_date ORDER BY id ASC;",
            engine,
        )
        df_2: pd.DataFrame = pd.read_sql(
            "SELECT id, short_name, doc_open FROM documents ORDER BY id DESC;",
            engine,
        )
        df: pd.DataFrame = df_1.merge(
            df_2, left_on="doc_name", right_on="short_name", how="right"
        )
        df = df[df["doc_open"]]

        self.__contract_df: pd.DataFrame = df

    def __create_contract_totals(self) -> None:
        self.__contract_totals: dict[Any, Any] = (
            self.__contract_df.groupby("id")["sum_stage"].sum().to_dict()
        )

    def __get_contract_totals(
        self, matches: list[Any] | None = None
    ) -> dict[Any, Any]:
        if not matches:
            return self.__contract_totals

        return {
            int(val): self.__contract_totals.get(int(val), 0)
            for val in matches
        }

    @staticmethod
    def __get_total(
        value: float | int | Decimal, objects_count: int, sign_after_dot: int
    ) -> float:
        value = float(value)
        return round(
            value / objects_count,
            sign_after_dot,
        )

    def save(self) -> None:
        self.__read_contract_df()
        self.__create_contract_totals()

        if self.__invoice.comment is None:
            return

        matches: list[Any] = re.findall(self.__regex, self.__invoice.comment)

        if not matches:
            return

        matches = list(set(matches))

        totals_contract: dict[Any, Any] = self.__get_contract_totals(
            matches=matches
        )

        counts = len(matches)

        for obj in matches:
            current_contracts_sum: float = sum(totals_contract.values())

            contract_invoice = ContractInvoice()

            if min(totals_contract.values()) == 0:
                contract_invoice.total = self.__get_total(
                    self.__invoice.total, counts, 2
                )
                contract_invoice.second_sum = self.__get_total(
                    self.__invoice.second_sum, counts, 2
                )
                contract_invoice.amount = self.__get_total(
                    self.__invoice.amount, counts, 2
                )
                if self.__invoice.vat:
                    contract_invoice.vat = self.__get_total(
                        self.__invoice.vat, counts, 2
                    )
                else:
                    contract_invoice.vat = None
            else:
                percent = totals_contract[int(obj)] / current_contracts_sum
                contract_invoice.total = round(
                    self.__invoice.total * percent, 2
                )
                contract_invoice.vat = round(
                    (contract_invoice.total * 20) / 120, 2
                )
                contract_invoice.second_sum = round(
                    contract_invoice.total - contract_invoice.vat, 2
                )
                contract_invoice.amount = round(
                    self.__invoice.amount * percent, 2
                )

            contract_invoice.contract_id = int(obj)
            contract_invoice.invoice = self.__invoice
            contract_invoice.save()
