import datetime
from typing import Any, IO

import pandas as pd

from .models import FuelCard, ServiceParams


class FuelCardsService:
    __file: IO[Any]
    __turnover_dict: dict[Any, Any]

    def __init__(self, file: IO[Any]):
        self.__file = file

    def update_db(self) -> None:
        self.__read_xls()
        self.__update_db()

    def __read_xls(self) -> None:
        df: pd.DataFrame = pd.read_excel(self.__file)
        period_string = df.iloc[1]["Unnamed: 1"]
        start_period = self.__get_date_from_df_string(period_string[12:20])
        end_period = self.__get_date_from_df_string(period_string[24:34])

        self.__turnover_dict: dict[Any, Any] = {}

        last_info: str = ""
        for index, row in df.iloc[11:].iterrows():
            if pd.notna(row["Unnamed: 2"]):
                last_info = row["Unnamed: 2"].split()[0]
            else:
                if pd.isna(row["Unnamed: 4"]) or row["Unnamed: 4"].startswith(
                    "Всего"
                ):
                    continue
                if self.__turnover_dict.get(last_info, None) is None:
                    self.__turnover_dict[last_info] = list()

                self.__turnover_dict[last_info].append(
                    {
                        "service": row["Unnamed: 4"],
                        "count": row["Unnamed: 5"],
                        "total": row["Unnamed: 6"],
                        "start_period": start_period,
                        "end_period": end_period,
                    }
                )

    def __update_db(self) -> None:
        for card_number, services in self.__turnover_dict.items():
            for service in services:
                service_unit = ServiceParams(
                    card_number=card_number,
                    service=service["service"],
                    count=service["count"],
                    total=service["total"],
                    start_period=service["start_period"],
                    end_period=service["end_period"],
                )

                if not ServiceParams.objects.filter(
                    service=service_unit.service,
                    count=service_unit.count,
                    total=service_unit.total,
                    start_period=service_unit.start_period,
                    end_period=service_unit.end_period,
                ).exists():
                    service_unit.save()

        fuel_cards = FuelCard.objects.all()
        services = ServiceParams.objects.all()
        for fuel_card in fuel_cards:
            current_card_number = fuel_card.services.all()[0].card_number
            fuel_card.services.set(
                services.filter(card_number=current_card_number)
            )

    @staticmethod
    def __get_date_from_df_string(
        date_string: str, prefix: str = "20"
    ) -> datetime.datetime:
        return datetime.datetime(
            int(f"{prefix}{date_string[-2:]}"),
            int(date_string[3:5]),
            int(date_string[0:2]),
        )
