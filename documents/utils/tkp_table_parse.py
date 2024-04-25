import io
from typing import Any

from documents.models import TKP

from global_utils import DownloadManager

import pandas as pd


def read_xlsx(
    file: io.BytesIO,
    skip: int = 6,
) -> pd.DataFrame:
    df = pd.read_excel(file, skiprows=skip)

    df = df.rename(
        columns={
            "Unnamed: 0": "Номер",
            "Unnamed: 1": "Код",
            "Unnamed: 2": "Наименование затрат",
            "Unnamed: 3": "Комментарий подрядчика",
            "Unnamed: 4": "Ед. изм.",
            "Unnamed: 5": "Коэф.расхода",
            "Unnamed: 6": "Кол-во",
            "Unnamed: 9": "Цена",
            "Unnamed: 12": "Стоимость",
        }
    )

    return df


def get_tkp_list(file: io.BytesIO) -> list[dict[str, Any]]:
    df = read_xlsx(file)

    tkp_list: list[dict[str, Any]] = list()

    parent_costs_name = ""
    for index, row in df.iterrows():
        if pd.isna(row["Наименование затрат"]):
            parent_costs_name = "Объект ИДП без распределения на секции"
            continue

        tkp_list.append(
            {
                "parent_costs_name": parent_costs_name,
                "Номер": row["Номер"],
                "Код": None if pd.isna(row["Код"]) else row["Код"],
                "Наименование затрат": row["Наименование затрат"],
                "Комментарий подрядчика": None
                if pd.isna(row["Комментарий подрядчика"])
                else row["Комментарий подрядчика"],
                "Ед. изм.": None
                if pd.isna(row["Ед. изм."])
                else row["Ед. изм."],
                "Коэф.расхода": None
                if pd.isna(row["Коэф.расхода"])
                else row["Коэф.расхода"],
                "Кол-во": None if pd.isna(row["Кол-во"]) else row["Кол-во"],
                "Цена_материалы": None
                if pd.isna(row["Материалы/\nоборудование"])
                else row["Материалы/\nоборудование"],
                "Цена_СМР": None
                if pd.isna(row["СМР, ПНР"])
                else row["СМР, ПНР"],
                "Цена": None if pd.isna(row["Цена"]) else row["Цена"],
                "Стоимость_материалы": None
                if pd.isna(row["Материалы/\nоборудование.1"])
                else row["Материалы/\nоборудование.1"],
                "Стоимость_СМР": None
                if pd.isna(row["СМР, ПНР.1"])
                else row["СМР, ПНР.1"],
                "Стоимость": None
                if pd.isna(row["Стоимость"])
                else row["Стоимость"],
            }
        )

    return tkp_list


def parse_tkp_table(
    yandex_path: str = "disk:/test downloads/tkp.xlsx",
) -> None:
    file = DownloadManager().download([yandex_path])[0]
    tkp_list = get_tkp_list(file)

    for tkp in tkp_list:
        TKP.objects.create(
            parent_costs_name=tkp["parent_costs_name"],
            npp=tkp["Номер"],
            code=tkp["Код"],
            costs_name=tkp["Наименование затрат"],
            contractor_comment=tkp["Комментарий подрядчика"],
            unit=tkp["Ед. изм."],
            consumption_coefficient=tkp["Коэф.расхода"],
            amount=tkp["Кол-во"],
            material_unit_cost=tkp["Цена_материалы"],
            smr_unit_cost=tkp["Цена_СМР"],
            price=tkp["Цена"],
            material_total_cost=tkp["Стоимость_материалы"],
            smr_total_cost=tkp["Стоимость_СМР"],
            total_cost=tkp["Стоимость"],
        )
