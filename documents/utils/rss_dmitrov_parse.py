from global_utils import DownloadManager

import numpy as np

import pandas as pd

from ..models import RSSDmitrov


rename_cols: dict[str, str] = {
    "Unnamed: 0": "npp",
    "Unnamed: 1": "code",
    "Unnamed: 2": "work_name",
    "Unnamed: 3": "unit",
    "Unnamed: 4": "accounting_method",
    "Unnamed: 5": "material_consumption_rate",
    "Unnamed: 6": "volume",
    "Unnamed: 7": "basic_materials_unit_cost",
    "Unnamed: 8": "smr_unit_cost",
    "Unnamed: 9": "total_unit_cost",
    "Unnamed: 10": "basic_materials_total_cost",
    "Unnamed: 11": "smr_total_cost",
    "Unnamed: 12": "total_total_cost",
    "Unnamed: 13": "note",
}


def to_float_or_none(
    number_str: float | str | None,
) -> float | None:
    if number_str is None or isinstance(number_str, float):
        return number_str

    return float(number_str.replace(",", ".").replace(" ", ""))


def to_float(
    number_str: float | str,
) -> float:
    if isinstance(number_str, float):
        return number_str

    return float(number_str.replace(",", ".").replace(" ", ""))


def parse_dmitrov_xlsx(
    yandex_path: str,
) -> None:
    file = DownloadManager().download([yandex_path])[0]

    df = (
        pd.read_excel(file)
        .iloc[14:]
        .rename(columns=rename_cols)
        .replace(np.nan, None)
    )

    parent_work_name = ""
    parent_note = ""
    for index, row in df.iterrows():
        if row["npp"] is None:
            continue

        if "." not in str(row["npp"]):
            parent_work_name = row["work_name"]
            parent_note = row["note"]
            continue

        final_note = None

        if parent_note is not None:
            final_note = parent_note

        if row["note"] is not None:
            if final_note is not None:
                final_note = f"{parent_note}. {row['note']}"
            else:
                final_note = row["note"]

        RSSDmitrov.objects.create(
            contract_id=260,
            npp=str(row["npp"]),
            code=row["code"],
            parent_work_name=parent_work_name,
            work_name=row["work_name"],
            unit=row["unit"],
            accounting_method=row["accounting_method"],
            material_consumption_rate=to_float_or_none(
                row["material_consumption_rate"]
            ),
            volume=to_float(row["volume"]),
            basic_materials_unit_cost=to_float_or_none(
                row["basic_materials_unit_cost"]
            ),
            smr_unit_cost=to_float_or_none(row["smr_unit_cost"]),
            total_unit_cost=to_float_or_none(row["total_unit_cost"]),
            basic_materials_total_cost=to_float_or_none(
                row["basic_materials_total_cost"]
            ),
            smr_total_cost=to_float_or_none(row["smr_total_cost"]),
            total_total_cost=to_float_or_none(row["total_total_cost"]),
            note=final_note,
        )
