from __future__ import annotations

import datetime
import io
from typing import Any

from django.utils.timezone import make_aware

from employee_cards.models import Counterparty, CounterpartyAliases

from invoice_analysis.models import Invoice
from invoice_analysis.utils import send_notification_about_new_counterparty

import pandas as pd


class InvoiceSaver:
    __df: pd.DataFrame

    __columns_for_rename: dict[str, str] = {
        "Сумма.1": "Общая_Сумма",
        "Номенклатура.Единица": "Номенклатура_Единица",
    }

    def __init__(self, files: list[io.BytesIO]) -> None:
        self.__read(files)
        self.__fix()

    @staticmethod
    def __counterparty_to_general_format(name: str) -> str:
        return (
            name.replace('"', "")
            .replace("«", "")
            .replace("»", "")
            .replace("ООО", "")
            .replace("ИП", "")
            .replace("СЗ", "")
            .replace(" ", "")
            .lower()
        )

    @staticmethod
    def __fix_row(row: pd.Series[Any]) -> None:
        row["Номенклатура"] = f'{row["Номенклатура"] } {row["Количество"]}'
        row["Количество"] = row["Номенклатура_Единица"]
        row["Номенклатура_Единица"] = row["Цена"]
        row["Цена"] = row["Общая_Сумма"]
        row["Общая_Сумма"] = row["% НДС"]
        row["% НДС"] = row["НДС"]
        row["НДС"] = row["Всего"]
        row["Всего"] = row["Доп информация"]

    def __read(self, files: list[io.BytesIO]) -> None:
        df_list = [
            pd.read_csv(file, delimiter="\t", on_bad_lines="skip")
            for file in files
        ]

        df_list[1] = df_list[1][
            ~df_list[1]["Номер входящего документа"].isin(
                df_list[0]["Номер входящего документа"]
            )
        ]

        df: pd.DataFrame = pd.concat(df_list, sort=False)
        df = df.rename(columns=self.__columns_for_rename)

        self.__df = df

    @staticmethod
    def __to_float(value: str | int | float) -> int | float:
        if pd.isna(value):
            return 1

        if not isinstance(value, float | int):
            return float(value.replace(",", ".").replace("\xa0", ""))
        return value

    @staticmethod
    def __to_datetime(value: str) -> datetime.datetime:
        date_time = None
        if " " not in value:
            date_time = datetime.datetime.strptime(value, "%d.%m.%Y")
        else:
            date_time = datetime.datetime.strptime(value, "%d.%m.%Y %H:%M:%S")

        return make_aware(date_time)

    @staticmethod
    def __nan_to_none(value: Any) -> Any:
        if pd.isna(value):
            return None
        return value

    def __fix(self) -> None:
        for index, row in self.__df.iterrows():
            if "%" in str(row["НДС"]):
                self.__fix_row(row)

            if not isinstance(index, int):
                return

            self.__df.loc[index, "Доп информация"] = self.__nan_to_none(
                row["Доп информация"],
            )
            self.__df.loc[index, "Комментарий"] = self.__nan_to_none(
                row["Комментарий"]
            )
            self.__df.loc[index, "ПП создано"] = self.__nan_to_none(
                row["ПП создано"]
            )

            if row["% НДС"] in ["Без НДС", "0%"] or pd.isna(row["% НДС"]):
                self.__df.loc[index, "% НДС"] = None
                self.__df.loc[index, "НДС"] = None
            else:
                self.__df.loc[index, "% НДС"] = int(
                    row["% НДС"].replace("%", "")
                )
                self.__df.loc[index, "НДС"] = self.__to_float(row["НДС"])

            self.__df.loc[index, "Цена"] = self.__to_float(row["Цена"])
            self.__df.loc[index, "Всего"] = self.__to_float(row["Всего"])
            self.__df.loc[index, "Количество"] = self.__to_float(
                row["Количество"]
            )
            self.__df.loc[index, "Общая_Сумма"] = self.__to_float(
                row["Общая_Сумма"]
            )
            self.__df.loc[index, "Сумма"] = self.__to_float(row["Сумма"])

            self.__df.loc[index, "Дата"] = self.__to_datetime(row["Дата"])
            self.__df.loc[
                index, "Дата входящего документа"
            ] = self.__to_datetime(row["Дата входящего документа"]).date()

    @staticmethod
    def __get_counterparty_or_create_by_inn(
        inn: str,
        title: str,
    ) -> Counterparty:
        counterparty_query = Counterparty.objects.filter(
            inn=inn,
        )
        if counterparty_query.exists():
            return counterparty_query.first()  # type: ignore
        else:
            return Counterparty.objects.create(
                title=title,
                inn=inn,
            )

    @classmethod
    def __get_counterparty_and_alias_by_name(
        cls, name: str
    ) -> tuple[Counterparty | None, str | None]:
        counterparty = None
        alias = None

        counterparties = Counterparty.objects.all()
        for counterparty in counterparties:
            if cls.__counterparty_to_general_format(
                counterparty.title
            ) == cls.__counterparty_to_general_format(name):
                counterparty = counterparty
                break
        else:
            aliases = CounterpartyAliases.objects.filter(alias=name)
            if aliases.exists():
                counterparty = aliases[0].counterparty
            else:
                alias = name

        return counterparty, alias

    def save(self) -> None:
        for index, row in self.__df.iterrows():
            current_counterparty = None
            alias = None

            if pd.isna(row["ИННКонтрагента"]):
                (
                    current_counterparty,
                    alias,
                ) = self.__get_counterparty_and_alias_by_name(
                    row["Контрагент"],
                )
            else:
                inn = str(int(row["ИННКонтрагента"]))

                counterparty_query = Counterparty.objects.filter(
                    inn=inn,
                )
                if counterparty_query.exists():
                    current_counterparty = counterparty_query.first()
                else:
                    title = row["Контрагент"]

                    current_counterparty = (
                        self.__get_counterparty_or_create_by_inn(
                            inn,
                            title,
                        )
                    )
                    send_notification_about_new_counterparty(
                        current_counterparty.title,
                        current_counterparty.inn,
                        current_counterparty.get_update_url(),
                    )

            query = Invoice.objects.filter(
                date=row["Дата"],
                number=row["Номер"],
                counterparty=current_counterparty,
                pp_created=row["ПП создано"],
                payment_status=self.__nan_to_none(row["Статус оплаты"]),
                payment=row["Оплата"],
                entrance=row["Поступление"],
                date_of_the_incoming_document=row["Дата входящего документа"],
                incoming_document_number=row["Номер входящего документа"],
                comment=row["Комментарий"],
                nomenclature=row["Номенклатура"],
                amount=row["Количество"],
                unit=row["Номенклатура_Единица"],
                vat_percent=row["% НДС"],
            )

            if not query.exists():
                Invoice.objects.create(
                    date=row["Дата"],
                    number=row["Номер"],
                    counterparty=current_counterparty,
                    sum=row["Сумма"],
                    pp_created=row["ПП создано"],
                    payment_status=self.__nan_to_none(row["Статус оплаты"]),
                    payment=row["Оплата"],
                    entrance=row["Поступление"],
                    date_of_the_incoming_document=row[
                        "Дата входящего документа"
                    ],
                    incoming_document_number=row["Номер входящего документа"],
                    comment=row["Комментарий"],
                    nomenclature=row["Номенклатура"],
                    amount=row["Количество"],
                    unit=row["Номенклатура_Единица"],
                    price=row["Цена"],
                    second_sum=row["Общая_Сумма"],
                    vat_percent=row["% НДС"],
                    vat=row["НДС"],
                    total=row["Всего"],
                    info=self.__nan_to_none(row["Доп информация"]),
                    alias=alias,
                )
            else:
                Invoice.objects.filter(pk=query[0].pk).update(
                    info=self.__nan_to_none(row["Доп информация"])
                )
