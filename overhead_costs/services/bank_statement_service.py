import io

from overhead_costs.models import BankState

import pandas as pd


class BankStatementService:
    __columns_for_rename_second_xlsx: dict[str, str] = {
        "Unnamed: 1": "doc_number",
        "Unnamed: 2": "doc_date",
        "Unnamed: 3": "operation_date",
        "Unnamed: 4": "name",
        "Unnamed: 5": "account",
        "Unnamed: 6": "inn",
        "Unnamed: 7": "bank",
        "Unnamed: 8": "debiting_sum",
        "Unnamed: 9": "credit_sum",
        "Unnamed: 10": "appointment",
    }

    __columns_for_drop_second_xlsx: list[str] = [
        "Unnamed: 0",
    ]

    def __init__(self, files: list[io.BytesIO]) -> None:
        self.__files: list[io.BytesIO] = files

    def update_db(self) -> None:
        for file in self.__files:
            df: pd.DataFrame = self.__read_xlsx_with_pd(file)
            self.__load_statements_to_db(df)

    def __read_xlsx_with_pd(self, file: io.BytesIO) -> pd.DataFrame:
        df = pd.read_excel(file)
        df = df.drop(columns=self.__columns_for_drop_second_xlsx)
        df = df.rename(columns=self.__columns_for_rename_second_xlsx)
        df = df.fillna("")

        start_index = 0
        end_index = -1

        for index, row_val in enumerate(df.iterrows()):
            row = row_val[1]
            if row["doc_date"] == "2":
                start_index = index + 1
                break

        df = df.iloc[start_index:]

        for index, row_val in enumerate(df.iterrows()):
            row = row_val[1]
            if row["doc_date"] == "":
                end_index = index
                break

        df = df.iloc[:end_index]

        return df

    @staticmethod
    def __date_to_db_format(date: str) -> str:
        year = date[-4:]
        month = date[3:5]
        day = date[0:2]

        return f"{year}-{month}-{day}"

    def __load_statements_to_db(self, df: pd.DataFrame) -> None:
        curr_statements = set(
            [str(state.doc_number) for state in BankState.objects.all()]
        )
        df = df[~df["doc_number"].isin(curr_statements)]

        for index, row in df.iterrows():
            row["doc_date"] = self.__date_to_db_format(row["doc_date"])
            row["operation_date"] = self.__date_to_db_format(
                row["operation_date"]
            )

            if isinstance(row["credit_sum"], str):
                row["credit_sum"] = None
            if isinstance(row["debiting_sum"], str):
                row["debiting_sum"] = None

            BankState.objects.create(
                doc_number=row["doc_number"],
                doc_date=row["doc_date"],
                operation_date=row["operation_date"],
                name=row["name"],
                account=row["account"],
                inn=row["inn"],
                bank=row["bank"],
                debiting_sum=row["debiting_sum"],
                credit_sum=row["credit_sum"],
                appointment=row["appointment"],
            )
