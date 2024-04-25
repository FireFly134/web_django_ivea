from typing import Any

from db_utils import engine

from invoice_analysis.models import ContractInvoice

import pandas as pd

from sqlalchemy import text as sql_text

from .services import OverheadCostsAdder


class info_list_doc:
    __instance = None

    def __new__(cls, *args: Any, **kwargs: Any) -> Any:
        if cls.__instance is None:
            cls.__instance = super().__new__(cls)
        return cls.__instance

    def __init__(self) -> None:
        self.info = pd.read_sql_query(
            "SELECT * FROM documents ORDER BY id DESC;", engine
        )
        self.info2 = pd.read_sql_query(
            "SELECT id,\
                doc_name,\
                work_name,\
                date_end,\
                sum_stage,\
                flag,\
                payment,\
                num_act,\
                stage_work,\
                stage_pay,\
                stage_upd,\
                date_act,\
                num_pp,\
                date_pp, \
                comment, \
                invoice_issued, \
                npp FROM doc_date ORDER BY npp ASC;",
            engine,
        )  # Склейка по имени info("short_name")-info2(doc_name)

        self.info2["sum_stage"] = self.info2["sum_stage"].fillna(0)
        self.info3 = (
            self.info2.fillna(0)
            .groupby(["doc_name"])
            .agg({"sum_stage": "sum"})
        )
        self.info_dop_pp = pd.read_sql_query(
            """SELECT id, id_doc_date,num_pp,date_pp,payment,num_act,date_act\
                  FROM doc_date_pp ORDER BY id ASC;""",
            engine,
        )
        self.id = 0
        self.dop_doc_date_id_list: list[Any] = list()

    def get_info_setting(
        self,
        stage_upd: bool = False,
        stage_pay: bool = False,
        flag: bool = False,
        short_name: str = "",
    ) -> pd.DataFrame:
        info = self.info2.copy()
        info2 = info.drop(
            ["num_pp", "date_pp", "payment", "num_act", "date_act"], axis=1
        )
        info2 = pd.merge(
            info2, self.info_dop_pp, left_on="id", right_on="id_doc_date"
        )
        info2 = info2.drop(["id_y", "id_doc_date"], axis=1)
        info2.rename(columns={"id_x": "id"}, inplace=True)
        info = pd.concat([info, info2], ignore_index=True)

        # TODO Мне не нравится, надо вывести поиск нового "info", чтобы он
        # добывал эту инфу всего 1 раз.
        # TODO Но сдругой стороны, вдруг появится новая запись?

        if stage_upd:
            info = info[
                info["stage_upd"] == stage_upd
            ]  # установлена галочка "этап УПД"
        if stage_pay:
            info = info[
                info["stage_pay"] == stage_pay
            ]  # установлена галочка  "этап оплат"
        if flag:
            info = info[info["flag"] == flag]  # установлена галочка "Оригинал"
        return info[info["doc_name"] == short_name]

    def get_info(self) -> pd.DataFrame:
        info = pd.merge(
            self.info,
            self.info3,
            left_on="short_name",
            right_on="doc_name",
            how="left",
        )
        info["sum_stage"] = info["sum_stage"].fillna(0)
        info["flag"] = info["flag"].fillna(False)
        info = info.fillna("")
        return info

    def get_payment(self) -> int | float:
        """Графа Оплачено = сумма значений из колонки "оплачено или закрыто" у
          которых выполненно условие:
        Если установлена галочка  "этап оплат", есть дата ПП и номер ПП."""
        payment = 0.0
        payment_df = self.get_info_setting(
            stage_pay=True, short_name=self.short_name
        )
        payment_df = payment_df[
            (
                (payment_df["date_pp"] != "")
                & (payment_df["date_pp"].notnull())
                & (payment_df["num_pp"] != "")
                & (payment_df["num_pp"].notnull())
            )
        ]
        if not payment_df.empty:
            payment = payment_df["payment"].sum()
        return payment

    def get_accomplishment(self) -> int | float:
        """Графа выполнение =
        1) если упд на всю сумму, то выполнение = сумме договора
        2) если упд по этапам (несколько упд), то выполнение - это сумма оплат
          этапов, при галочке оригинал упд.
        В обоих случаях должна быть обязательно галочка Этап УПД и
          дополнительно хотя бы что-то из перечисленного:
           - Дата АКТА и Номер Акта"""

        accomplishment = 0.0

        # получаем таблицу с данными, где установлена галочка "этап УПД"
        accomplishment_df = self.get_info_setting(
            stage_upd=True, short_name=self.short_name
        )
        # если "упд на всю сумму", то выполнение = сумма договора
        if self.flag_upd:
            for idx, row in accomplishment_df.iterrows():
                # есть дата АКТА и номер АКТА или просто стоит "оригинал"
                if (
                    row["date_act"] != "" and row["date_act"] is not None
                ) and (row["num_act"] != "" and row["num_act"] is not None):
                    accomplishment = self.sum_stage
                break
        else:
            # тоже самое, есть дата АКТА и номер АКТА
            accomplishment_df = accomplishment_df[
                (
                    (accomplishment_df["date_act"] != "")
                    & (accomplishment_df["date_act"].notnull())
                    & (accomplishment_df["num_act"] != "")
                    & (accomplishment_df["num_act"].notnull())
                )
            ]
            # то выполнение - это сумма оплат этапов
            if not accomplishment_df.empty:
                accomplishment = accomplishment_df["sum_stage"].sum()
        return accomplishment

    def get_payment_upd(self) -> int | float:
        """Оплачено по УПД =
        1) если упд на всю сумму, то Оплачено по УПД = Оплачено.
        2) если упд по этапам (несколько упд), то Оплачено по УПД =
          сумма значений из колонки "оплачено или закрыто" у которых выполненно
            условие.
         В обоих случаях должна быть обязательно галочка Этап УПД и
           дополнительно хотя бы что-то из перечисленного:
           - Дата АКТА и Номер Акта"""
        # Если установлена галочки "этап УПД"
        payment_upd_df = self.get_info_setting(
            stage_upd=True, short_name=self.short_name
        )
        payment_upd = 0.0
        # если "упд на всю сумму", то выполнение = сумма договора
        if self.flag_upd:
            for idx, row in payment_upd_df.iterrows():
                # есть дата АКТА и номер АКТА
                if (
                    row["date_act"] != "" and row["date_act"] is not None
                ) and (row["num_act"] != "" and row["num_act"] is not None):
                    payment_upd = self.payment
                break
        else:
            # есть дата АКТА и номер АКТА, есть сумма (оплачено\закрыто)
            # то все отлично и мы берем число "оплачено\закрыто"
            payment_upd_df = payment_upd_df[
                (
                    (payment_upd_df["date_act"] != "")
                    & (payment_upd_df["date_act"].notnull())
                    & (payment_upd_df["num_act"] != "")
                    & (payment_upd_df["num_act"].notnull())
                )
            ]
            # и складываем с другими (если они есть)
            # и помещаем в "оплачено по УПД"
            ###
        if not payment_upd_df.empty:
            payment_upd = payment_upd_df["payment"].sum()
        return payment_upd

    def get_result_dolg(self) -> int | float:
        """* ИТОГО задолженность покупателя =
        1) если упд на всю сумму, то ИТОГО задолженность покупателя = Сумма
          договора - Оплачено.
            Должна быть обязательно галочка Этап УПД и дополнительно условие:
                - Дата АКТА и Номер Акта.
        2) если упд по этапам (несколько упд), то ИТОГО задолженность
          покупателя = выполнение - Оплачено по УПД.
            Должна быть обязательно галочка Этап УПД и дополнительно условие:
                - Дата АКТА и Номер Акта.
        """
        result_dolg = 0.0
        result_dolg_df = self.get_info_setting(
            stage_upd=True, short_name=self.short_name
        )
        for idx, row in result_dolg_df.iterrows():
            if (row["date_act"] != "" and row["date_act"] is not None) and (
                row["num_act"] != "" and row["num_act"] is not None
            ):
                if self.flag_upd:
                    result_dolg = self.sum_stage - self.payment
                else:
                    result_dolg = self.accomplishment - self.payment_upd
            break
        return result_dolg

    def get_all_sum(
        self, row: Any
    ) -> tuple[
        int | float,
        int | float,
        int | float,
        int | float,
        int | float,
        int | float,
    ]:
        """
        * Сумма договора = сумма значений из колонки "Сумма этапа, руб."

        * Выполнение =
             1) если упд на всю сумму, то выполнение = сумме договора
             2) если упд по этапам (несколько упд), то выполнение
             - это сумма оплат этапов, при галочке оригинал упд.
             В обоих случаях должна быть обязательно галочка Этап УПД
             и дополнительно хотя бы что-то из перечисленного:
                - Дата АКТА и Номер Акта.

        * Остаток по договору = Сумма договора-Оплачено.

        * Оплачено = сумма значений из колонки "оплачено/закрыто"
        у которых выполненно условие: Если установлена галочка  "этап оплат",
         есть дата ПП и номер ПП.

        * Оплачено по УПД =
             1) если упд на всю сумму, то Оплачено по УПД = Оплачено.
             2) если упд по этапам (несколько упд), то Оплачено по УПД =
             сумма значений из колонки "оплачено/закрыто" у которых выполненно
             условие.
             В обоих случаях должна быть обязательно галочка Этап УПД и
             дополнительно хотя бы что-то из перечисленного:
                - Дата АКТА и Номер Акта.

        * ИТОГО задолженность покупателя =
            1) если упд на всю сумму, то
            ИТОГО задолженность покупателя = Сумма договора - Оплачено.
            2) если упд по этапам (несколько упд),
            то ИТОГО задолженность покупателя = выполнение - Оплачено по УПД.
            В обоих случаях должна быть обязательно галочка Этап УПД
             и дополнительно хотя бы что-то из перечисленного:
                - Дата АКТА и Номер Акта.
        """
        self.sum_stage: int | float = row["sum_stage"]
        self.short_name: str = row["short_name"]
        self.flag_upd: bool | str = row["flag_upd"]
        self.payment: int | float = self.get_payment()
        self.accomplishment: int | float = self.get_accomplishment()
        self.payment_upd: int | float = self.get_payment_upd()

        self.balance_contract = self.sum_stage - self.payment

        result_dolg = self.get_result_dolg()

        return (
            self.sum_stage,
            self.accomplishment,
            self.payment,
            self.payment_upd,
            self.balance_contract,
            result_dolg,
        )

    def get_info_dop(self, id: Any) -> Any:
        if self.id != id:
            self.id = id
            self.num_pp = ""
            self.date_pp = ""
            self.dop_payment = ""
            info = self.info_dop_pp[self.info_dop_pp["id_doc_date"] == id]
            for idx, row in info.iterrows():
                self.dop_doc_date_id_list.append(row["id"])
                self.num_pp += f"""<br><input name="dop_num_pp_{row['id']}"\
                     type="text" class="date-input"\
                         value=\
                    "{row['num_pp'] if row['num_pp'] is not None else ""}"\
                         style="width: 200px;">"""
                self.date_pp += f"""<br><input name="dop_date_pp_{row['id']}"\
                     type="date" class="date-input"\
                         value=\
                    "{row['date_pp'] if row['date_pp'] is not None else ""}"\
                         style="width: 105px;">"""
                self.dop_payment += f"""
                <br><input name="dop_payment_{row['id']}" type="text"\
                    class="date-input"\
                    value=\
                    "{row['payment'] if row['payment'] is not None else ""}"\
                    style="width: 100px;">
                """

    def get_input_num_pp(self, id: Any) -> Any:
        self.get_info_dop(id)
        return self.num_pp

    def get_input_date_pp(self, id: Any) -> Any:
        self.get_info_dop(id)
        return self.date_pp

    def get_input_dop_payment(self, id: Any) -> Any:
        self.get_info_dop(id)
        return self.dop_payment


def int_r(num: float) -> int:
    num_int: int = int(num + (0.5 if num > 0 else -0.5))
    return num_int


def upgrade_db() -> None:
    web_doc_list_info = pd.read_sql_query(
        "SELECT doc_id FROM web_doc_list_info;", engine
    )
    info_obj = info_list_doc()
    info = info_obj.get_info()

    for idx, row in info.iterrows():
        # получаем сумма этапов, выполнение, Оплата, Оплата УПД,
        # Остаток по договору, Итоговая задолжность.
        (
            sum_stage,
            accomplishment,
            payment,
            payment_upd,
            balance_contract,
            result_dolg,
        ) = info_obj.get_all_sum(row)

        procent: str = "0%"

        invoices = ContractInvoice.objects.filter(
            contract_id=int(row["id"])
        ).exclude(invoice__info="Удален")
        overhead_invoices = OverheadCostsAdder().get_overhead_costs(
            int(row["id"])
        )

        if (invoices or overhead_invoices) and sum_stage != 0:
            invoices_sum = float(sum([invoice.total for invoice in invoices]))
            overhead_invoices_sum = sum(
                [
                    float(invoice["Всего"].replace("\u00A0", ""))
                    for invoice in overhead_invoices
                ]
            )

            sum_ = invoices_sum + overhead_invoices_sum
            procent = f"{int_r((sum_ / sum_stage) * 100)}%"

        f_sum_stage: str = f"{'{:,}'.format(sum_stage)}".replace(
            ",", "\u00A0"
        ).replace(".", ",")
        f_accomplishment: str = f"{'{:,}'.format(accomplishment)}".replace(
            ",", "\u00A0"
        ).replace(".", ",")
        f_payment: str = f"{'{:,}'.format(payment)}".replace(
            ",", "\u00A0"
        ).replace(".", ",")
        f_payment_upd: str = f"{'{:,}'.format(payment_upd)}".replace(
            ",", "\u00A0"
        ).replace(".", ",")
        f_balance_contract: str = f"{'{:,}'.format(balance_contract)}".replace(
            ",", "\u00A0"
        ).replace(".", ",")
        f_result_dolg: str = f"{'{:,}'.format(result_dolg)}".replace(
            ",", "\u00A0"
        ).replace(".", ",")

        df: pd.DataFrame = web_doc_list_info[
            web_doc_list_info["doc_id"] == row["id"]
        ]

        if df.empty:
            # Создание SQL-запроса с параметрами
            sql_query = """
                   INSERT INTO web_doc_list_info (procent, sum_stage,
                   accomplishment, payment,
                   payment_upd, balance_contract,
                   result_dolg, doc_id)
                   VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', {}) ;
               """
        else:
            sql_query = """UPDATE web_doc_list_info SET
                                    procent = '{}',
                                    sum_stage = '{}',
                                    accomplishment = '{}',
                                    payment = '{}',
                                    payment_upd = '{}',
                                    balance_contract = '{}',
                                    result_dolg = '{}' WHERE doc_id = {};"""

        # # Выполнение SQL-запроса с параметрами

        with engine.connect() as connection:
            connection.execute(
                sql_text(
                    sql_query.format(
                        procent,
                        f_sum_stage,
                        f_accomplishment,
                        f_payment,
                        f_payment_upd,
                        f_balance_contract,
                        f_result_dolg,
                        row["id"],
                    )
                )
            )
            connection.commit()
