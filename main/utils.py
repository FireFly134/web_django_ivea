import datetime

from db_utils import engine

from django.utils.timezone import make_aware

import pandas as pd

from .models import ContractStatus


def pull_contract_status_db() -> None:
    df_1: pd.DataFrame = pd.read_sql(
        "SELECT \
            doc_name, document_id, sum_stage, \
                work_name, date_end FROM doc_date ORDER BY id DESC;",
        engine,
    )
    df_2: pd.DataFrame = pd.read_sql(
        "SELECT id, short_name, doc_open, date \
            FROM documents ORDER BY id DESC;",
        engine,
    )

    df: pd.DataFrame = df_1.merge(
        df_2, left_on="doc_name", right_on="short_name", how="right"
    )

    for index, row in df.iterrows():
        if isinstance(row["work_name"], str):
            row["work_name"] = row["work_name"].lower()

    df = df[df["work_name"] == "дата завершения работ"]

    for index, row in df.iterrows():
        open_date = make_aware(
            datetime.datetime.strptime(row["date"].strip(), "%d.%m.%Y")
        )
        close_date = make_aware(
            datetime.datetime.combine(
                row["date_end"].date(), datetime.datetime.min.time()
            )
        )

        if ContractStatus.objects.filter(contract_id=row["id"]).exists():
            contract_status = ContractStatus.objects.filter(
                contract_id=row["id"]
            ).first()

            if not contract_status:
                continue

            contract_status.open_date = open_date
            contract_status.close_date = close_date
            contract_status.save()
        else:
            ContractStatus.objects.create(
                contract_id=row["id"],
                open_date=open_date,
                close_date=close_date,
            )
