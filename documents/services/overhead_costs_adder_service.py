import calendar
from datetime import datetime
from functools import reduce
from typing import Any

from db_utils import engine

from main.models import ContractStatus

from overhead_costs.models import MonthTotal

import pandas as pd

import pytz


class OverheadCostsAdder:
    __month_dict = {
        "1": "Январь",
        "2": "Февраль",
        "3": "Март",
        "4": "Апрель",
        "5": "Май",
        "6": "Июнь",
        "7": "Июль",
        "8": "Август",
        "9": "Сентябрь",
        "10": "Октябрь",
        "11": "Ноябрь",
        "12": "Декабрь",
    }

    def __init__(self) -> None:
        self.__read_month_totals()
        self.__read_contract_df(engine)
        self.__create_contract_totals()

    def __read_month_totals(self) -> None:
        totals = MonthTotal.objects.all()

        self.__month_totals = {
            f"{total.year}_{total.month}": total.total for total in totals
        }

    def __read_contract_df(self, engine: Any) -> None:
        df_1: pd.DataFrame = pd.read_sql(
            "SELECT doc_name, document_id, sum_stage\
                 FROM doc_date ORDER BY id ASC;",
            engine,
        )
        df_2: pd.DataFrame = pd.read_sql(
            "SELECT id, short_name, doc_open, date\
                 FROM documents ORDER BY id DESC;",
            engine,
        )
        df: pd.DataFrame = df_1.merge(
            df_2, left_on="doc_name", right_on="short_name", how="right"
        )
        # Оставляем только открытые договоры
        df = df[df["doc_open"]]

        self.__contract_df: pd.DataFrame = df

    def __create_contract_totals(self) -> None:
        # Словарь [ключ - id договора, значение - сумма договора]
        self.__contract_totals: dict[Any, Any] = (
            self.__contract_df.groupby("id")["sum_stage"].sum().to_dict()
        )
        # Сумма всех договоров
        self.__all_contract_sum: float = sum(self.__contract_totals.values())

        # Даты создания контрактов
        self.__contracts_dates: dict[Any, Any] = {
            key: datetime.strptime(
                self.__contract_df[self.__contract_df["id"] == key].iloc[0][
                    "date"
                ],
                "%d.%m.%Y",
            )
            for key in self.__contract_df.groupby("id")["sum_stage"]
            .sum()
            .to_dict()
            .keys()
            if pd.notna(
                self.__contract_df[self.__contract_df["id"] == key].iloc[0][
                    "date"
                ]
            )
        }

    def get_overhead_costs(self, obj_id: int) -> list[dict[str, Any]]:
        overhead: list[dict[str, Any]] = []

        bad_dict_keys = [f"2023_{str(i).zfill(2)}" for i in range(1, 7)]
        contracts_statuses = ContractStatus.objects.all()

        # Получаем дату создания договора по его id
        contract_start_date = self.__contracts_dates.get(obj_id, None)
        contract_end_date = datetime(3000, 12, 31)
        if contracts_statuses.filter(contract_id=obj_id).exists():
            contract_end_date = (
                contracts_statuses.filter(contract_id=obj_id)
                .first()
                .close_date  # type: ignore
            )

        # Если даты старта контракта нет - пропускаем
        if not contract_start_date:
            return []
        # Если сумма по договору равна 0 - пропускаем
        if self.__contract_totals[obj_id] == 0:
            return []

        percent: float = 100 / (
            self.__all_contract_sum / self.__contract_totals.get(obj_id, 1)
        )
        for year_month, cost in self.__month_totals.items():
            if year_month in bad_dict_keys:
                continue

            year, month = (
                year_month.split("_")[0],
                year_month.split("_")[-1],
            )

            current_overhead_cost_date = datetime(int(year), int(month), 1)
            last_day_month = reduce(
                lambda x, y: y[1],
                [
                    calendar.monthrange(
                        current_overhead_cost_date.year,
                        current_overhead_cost_date.month,
                    )
                ],
                28,
            )
            current_overhead_cost_date = datetime(
                current_overhead_cost_date.year,
                current_overhead_cost_date.month,
                int(last_day_month),
            )

            # Проверка, что дата начала контракта больше проверяемого
            # месяца накладных расходов
            if contract_start_date > current_overhead_cost_date:
                continue
            # Проверка, что дата конца контракта меньше проверяемого
            # месяца накладных расходов
            if contract_end_date.replace(
                tzinfo=pytz.UTC
            ) < current_overhead_cost_date.replace(tzinfo=pytz.UTC):
                continue

            overhead_cost: float = round((float(cost) / 100) * percent, 2)

            curr_co = self.__month_dict[month]

            overhead.append(
                {
                    "Дата": f"31.{month.zfill(2)}.{year}",
                    "Контрагент": "",
                    "Номенклатура": f"Накладные расходы за {curr_co}",
                    "Количество": "",
                    "Номенклатура.Единица": "",
                    "Цена": "",
                    "Сумма.1": "",
                    "НДС": "",
                    "Всего": f"{overhead_cost:,}".replace(",", "\u00A0"),
                }
            )

        return overhead
