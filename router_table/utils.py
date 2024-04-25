from datetime import datetime
from typing import Any, IO

from db_utils import engine

import pandas as pd

from .models import AccrualReport, Contract, Router, SimCard, Station


def router_depends_update() -> None:
    update_contracts_in_db()
    update_stations_in_db()


def update_sim_db(file: IO[Any]) -> None:
    file.seek(0)
    df: pd.DataFrame = pd.read_excel(file)
    for index, row in df.iterrows():
        sim_card = SimCard.objects.filter(phone_number=row["Номер телефона"])
        if sim_card.exists():
            sim_card = sim_card.first()  # type: ignore
            if isinstance(sim_card, SimCard):
                sim_card.contract = row["Договор"]
                sim_card.fio = row["ФИО"]
                sim_card.email = row["Эл. почта"]
                sim_card.rate = row["Тариф"]
                sim_card.serial_number = row["Серийный номер SIM/eSIM"]
                sim_card.spending_threshold = row[
                    "Порог расходов, руб. (с НДС)"
                ]
                sim_card.status = row["Статус"]
                sim_card.update_date = datetime.strptime(
                    row["Дата изменения статуса"], "%d.%m.%Y"
                ).date()
                sim_card.activate_date = datetime.strptime(
                    row["Дата активации"], "%d.%m.%Y"
                ).date()
                sim_card.save()
        else:
            SimCard.objects.create(
                phone_number=row["Номер телефона"],
                contract=row["Договор"],
                fio=row["ФИО"],
                email=row["Эл. почта"],
                rate=row["Тариф"],
                serial_number=row["Серийный номер SIM/eSIM"],
                spending_threshold=row["Порог расходов, руб. (с НДС)"],
                status=row["Статус"],
                update_date=datetime.strptime(
                    row["Дата изменения статуса"], "%d.%m.%Y"
                ).date(),
                activate_date=datetime.strptime(
                    row["Дата активации"], "%d.%m.%Y"
                ).date(),
            )


def update_accrual_reports(file: IO[Any]) -> None:
    file.seek(0)
    df: pd.DataFrame = pd.read_csv(
        file,
        delimiter=";",
        encoding="ISO-8859-1",
    )

    for index, row in df.iterrows():
        phone_number = (
            row["Íîìåð òåëåôîíà"]
            if not str(row["Íîìåð òåëåôîíà"]).endswith(".0")
            else str(row["Íîìåð òåëåôîíà"])[:-2]
        )
        if pd.isna(phone_number):
            break
        date_of_start_period = datetime.strptime(
            row["Äàòà íà÷àëà ïåðèîäà"], "%d.%m.%Y"
        )
        date_of_end_period = datetime.strptime(
            row["Äàòà îêîí÷àíèÿ ïåðèîäà"], "%d.%m.%Y"
        )
        total = float(row["Âñåãî ïî ñòðîêå"].replace(",", "."))

        if not AccrualReport.objects.filter(
            phone_number=phone_number,
            date_of_start_period=date_of_start_period,
            date_of_end_period=date_of_end_period,
            total=total,
        ).exists():
            AccrualReport.objects.create(
                phone_number=phone_number,
                date_of_start_period=date_of_start_period,
                date_of_end_period=date_of_end_period,
                total=total,
            )

    routers = Router.objects.all()
    for router in routers:
        update_total_for_router(router)


def update_contracts_in_db() -> None:
    df: pd.DataFrame = pd.read_sql(
        "SELECT \
        id, number_doc, counterparty,\
        short_name, doc_bild_done, doc_open \
        FROM documents ORDER BY id DESC;",
        engine,
    )
    contracts = Contract.objects.all()

    for index, row in df.iterrows():
        status = "Архив"
        if row["doc_open"] is True and row["doc_bild_done"] is True:
            status = "Активный"
        elif row["doc_open"] is True and row["doc_bild_done"] is False:
            status = "Нет стройки"

        try:
            contract = contracts.get(contract_id=row["id"])
            contract.status = status
            contract.save()
        except Contract.DoesNotExist:
            Contract.objects.create(
                contract_id=row["id"],
                contract_counterparty=row["counterparty"],
                contract=row["number_doc"],
                short_name=row["short_name"],
                status=status,
            )


def update_stations_in_db() -> None:
    df: pd.DataFrame = pd.read_sql("SELECT * FROM check_connect;", engine)
    for index, row in df.iterrows():
        title = row["system_name"]
        connect = int(row["connect"])
        power_supply = int(row["power_supply"])

        station = None
        stmt = Station.objects.filter(title=title)
        if stmt.exists():
            station = stmt

        if station:
            for st in station:
                st.connect = connect
                st.power_supply = power_supply
                st.save()
        else:
            Station.objects.create(
                title=title,
                connect=connect,
                power_supply=power_supply,
                is_monitoring=True,
            )


def update_total_for_router(router: Router) -> None:
    accrual_reports = AccrualReport.objects.filter(
        phone_number=router.sim.phone_number
    )

    total = 0.0
    for report in accrual_reports:
        total += report.total

    router.total = round(total, 2)
    router.save()
