import datetime
import json
from typing import Any

from db_utils import engine

from django.contrib import messages
from django.http import (
    HttpRequest,
    HttpResponse,
    HttpResponsePermanentRedirect,
    HttpResponseRedirect,
    JsonResponse,
)
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.generic import ListView

from global_utils import UploadManager

from invoice_analysis.models import ContractInvoice

import pandas as pd

from router_table.models import Contract

from sqlalchemy import text as sql_text

from .docement_log import main as log_docement
from .models import RSSDmitrov, TKP
from .services import OverheadCostsAdder, RSSDmitrovService
from .services_dir.send_msg_telegram import go_main as send_msg

data_list: dict[Any, Any] = {}
user_triger: dict[Any, Any] = {}


def costs(doc_id: int) -> Any:
    cache = {
        "headers": [
            "Дата",
            "Контрагент",
            "Номенклатура",
            "Количество",
            "Номенклатура.Единица",
            "Цена",
            "Сумма.1",
            "НДС",
            "Всего",
        ],
        "invoices": ContractInvoice.objects.filter(contract_id=doc_id).exclude(
            invoice__info="Удален"
        ),
    }
    return cache["invoices"], cache["headers"]


def get_date(in_date: Any) -> Any:
    # Приводим дату в божеский вид.
    if "." in str(in_date):
        data_end = str(in_date).split(".")
        date = f"{data_end[2]}-{data_end[1]}-{data_end[0]} 00:00:00"
    elif "-" in str(in_date):
        date = str(in_date)
    elif "" in str(in_date):
        date = datetime.datetime.now()  # type: ignore
    else:
        date = False  # type: ignore
    return date


def get_flags(in_flag: Any) -> Any:
    if in_flag == "on":
        flag = "true"
    else:
        flag = "false"
    return flag


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "documents/index.html")


class InfoListDoc:
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

    def get_all_sum(self, row: Any) -> Any:
        df: pd.DataFrame = pd.read_sql_query(
            f"""SELECT procent, sum_stage, accomplishment, balance_contract,
                           payment, payment_upd, result_dolg
                    FROM web_doc_list_info WHERE doc_id = '{row['id']}';""",
            engine,
        )
        result_dolg, procent = "0", "0%"
        for idx, row2 in df.iterrows():
            self.sum_stage = row2["sum_stage"]
            self.payment = row2["payment"]
            self.accomplishment = row2["accomplishment"]
            self.payment_upd = row2["payment_upd"]
            self.balance_contract = row2["balance_contract"]
            result_dolg = row2["result_dolg"]
            procent = row2["procent"]

        return (
            self.sum_stage,
            self.accomplishment,
            self.payment,
            self.payment_upd,
            self.balance_contract,
            result_dolg,
            procent,
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
                     type="text" class="date-input" value=\
                    "{row['num_pp'] if row['num_pp'] is not None else ""}"\
                         style="width: 200px;">"""
                self.date_pp += f"""<br><input name="dop_date_pp_{row['id']}"\
                     type="date" class="date-input" value=\
                    "{row['date_pp'] if row['date_pp'] is not None else ""}"\
                         style="width: 105px;">"""
                self.dop_payment += f"""
                <br><input name="dop_payment_{row['id']}" type="text"\
                    class="date-input" value=\
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


def list_doc(request: HttpRequest, doc_id: str = "all") -> HttpResponse:
    find_doc_id = "false"
    doc_date_id_list = list()
    info_obj = InfoListDoc()
    info = info_obj.get_info()
    html = ""
    user = request.user.is_superuser

    document_title, text_lines, table_html = "Список документов из БД", "", ""

    invoices, headers = costs(int(doc_id))
    flag_upd = False
    if doc_id != "all":
        find_doc_id = "true"
        info = info[info["id"] == int(doc_id)]
        log_docement_out = log_docement(doc_id=doc_id)
        document_title = log_docement_out[0]
        text_lines = log_docement_out[1]  # type: ignore
        table_html = log_docement_out[2]
    i = 0
    for idx, row in info.iterrows():
        i += 1
        # получаем сумма этапов, выполнение, Оплата, Оплата УПД,
        # Остаток по договору, Итоговая задолжность.
        (
            sum_stage,
            accomplishment,
            payment,
            payment_upd,
            balance_contract,
            result_dolg,
            procent,
        ) = info_obj.get_all_sum(row)

        # № п/п,	ID,	Контрагент,	Договор,	Оригинал,	%,	Предмет договора,
        # Сумма договора,	Выполнение,	Остаток по договору,	Оплачено,
        # Оплачено по УПД,	ИТОГО задолженность покупателя,	#Теги
        edit_url = reverse("edit_doc", kwargs={"doc_id": int(row["id"])})
        html += f"""<tr>
                <td class="doc_table" style="text-align:center">{i}</td>
                <td class="doc_table" style="text-align:center">{row['id']}
                </td>
                <td class="doc_table">{row['counterparty']}</td>
                <td class="doc_table"><a href="{edit_url}">\
                    {row['number_doc']} от {row['date']}</a></td>
                <td style="text-align:center"><input name="flag_{row['id']}"\
                     type="checkbox" class="flags" \
                        {'checked' if row['flag'] else ''}></td>
                <td class="doc_table" style="text-align:center">{procent}
                </td>"""
        if doc_id == "all":
            html += f"""<td class="doc_table">{row['short_name']}</td>"""
        else:
            html += f"""<td class="doc_table">{row['subject_contract']}</td>"""
        html += f"""<td class="doc_table" style="text-align:center"\
                        >{sum_stage}</td>
                    <td class="doc_table" style="text-align:center"\
                        >{accomplishment}</td>
                    <td class="doc_table" style="text-align:center"\
                        >{balance_contract}</td>
                    <td class="doc_table" style="text-align:center"\
                        >{payment}</td>"""

        if doc_id == "all" or not row["flag_upd"]:
            html += f"""<td class="doc_table" style="text-align:center">
                        {payment_upd}</td>"""
        html += f"""<td class="doc_table" style="text-align:center"\
                        >{result_dolg}</td>
                    <td class="doc_table" style="text-align:center;\
              display: none">{row['teg']}</td>"""
        if doc_id == "all":
            html += f"""<td class="doc_table" style="text-align:center;\
                 display: none">{row['doc_open']}</td>
                       <td class="doc_table" style="text-align:center;\
                         display: none">{row['doc_bild_done']}</td>"""

        if doc_id != "all":
            flag_upd = row["flag_upd"]
            if row["doc_open"] and row["doc_bild_done"]:
                if user:
                    html += f"""<td class="doc_table"><button\
                         style="height:40px;width:150px" type="submit"\
                             class="btn btn-outline-dark" name='id'\
                                 value='{row['id']}'>Закрыть договор</button>
                        <br>
                        <button style="height:60px;width:150px" type="submit"\
                             class="btn btn-outline-dark"\
                                 name='id_not_bild_done'\
                                     value='{row['id']}'>Нет строительной\
                                         готовности</button></td></tr>"""
            elif not row["doc_open"] and row["doc_bild_done"]:
                if user:
                    html += f"""<td class="doc_table"><button\
                         style="height:40px;width:250px" type="submit"\
                             class="btn btn-outline-dark" name='id_archive'\
                                 value='{row['id']}'>Вернуть в статус\
                                     "Активный"</button></td></tr>"""
            else:
                if user:
                    html += f"""<td class="doc_table"><button\
                         style="height:40px;width:250px" type="submit"\
                             class="btn btn-outline-dark" name='id_bild_done'\
                                 value='{row['id']}'>Вернуть в статус\
                                     "Активный"</button></td></tr>"""
            info2 = info_obj.info2[
                info_obj.info2["doc_name"] == row["short_name"]
            ]
            html += """</tbody>
                    </table> </br></br>
                    <table class="table_center_by_css table table-bordered\
                          table-hover" border="1" cellpadding="1"\
                              cellspacing="1" style="width:95%" id="myTable">
                            <thead style="position: sticky;top: 0">
                                <tr>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">№ п/п</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">ID</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Виды работ</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Этап работ</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Этап оплат</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Этап УПД</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Оригинал</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Сумма этапа, руб.
                                          </td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Номер п/п</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Дата п/п</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Оплачено/Закрыто</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Выставлен счет
                                          </td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Дата</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Номер документа
                                          </td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Дата договора</td>
                                    <td class="doc_table"\
                                         style="background:#ebebeb;\
                                          text-align:center">Комментарий</td>
                                </tr>
                            </thead>
                            <tbody>"""

            for idx, row2 in info2.iterrows():
                doc_date_id_list.append(row2["id"])
                checked_flag = ""
                checked_stage_work = ""
                checked_stage_pay = ""
                checked_stage_upd = ""
                checked_invoice_issued = ""
                if row2["flag"]:
                    checked_flag = "checked"
                if row2["stage_work"]:
                    checked_stage_work = "checked"
                if row2["stage_pay"]:
                    checked_stage_pay = "checked"
                if row2["stage_upd"]:
                    checked_stage_upd = "checked"
                if row2["invoice_issued"]:
                    checked_invoice_issued = "checked"

                npp = row2["npp"] if row2["npp"] is not None else ""

                html += f"""<tr>
                <td class="doc_table"\
                        style="text-align:center">\
                        <input name="npp_{row2['id']}"\
                                type="text" class="date-input-npp"\
                                     value="{npp}" style="width: 30px;"></td>
                <td class="doc_table"\
                        style="text-align:center">\
                        {row2['id']}</td>
                <td class="doc_table"\\

                        style="text-align:center">\
                        {row2['work_name']}</td>
                <td style="text-align:center"><input\
                     name="flag_stage_work_doc_date_{row2['id']}"\
                         type="checkbox" class="flags" {checked_stage_work}>
                         </td>
                <td style="text-align:center"><input\
                     name="flag_stage_pay_doc_date_{row2['id']}"\
                         type="checkbox" class="flags" {checked_stage_pay}>
                         </td>
                <td style="text-align:center"><input\
                     name="flag_stage_upd_doc_date_{row2['id']}"\
                         type="checkbox" class="flags" {checked_stage_upd}>
                         </td>
                <td style="text-align:center"><input\
                     name="flag_doc_date_{row2['id']}" type="checkbox"\
                          class="flags" {checked_flag}></td>"""

                html += f"""    <td class="doc_table"\
                      style="text-align:center">\
                    <input name="sum_stage_{row2['id']}" type="text"\
                    class="date-input"\
                          value="{'{:,}'.format(row2['sum_stage'])}"\
                              style="width: 120px;"></td>""".replace(
                    ",", "\u00A0"
                ).replace(
                    ".", ","
                )

                value_1 = row2["num_pp"] if row2["num_pp"] is not None else ""
                v_2 = ""
                if not pd.isnull(row2["date_pp"]):
                    v_2 = row2["date_pp"].strftime("%Y-%m-%d")
                v_3 = row2["payment"] if row2["payment"] is not None else ""
                v_4 = info_obj.get_input_dop_payment(row2["id"])
                v_5 = row2["num_act"] if row2["num_act"] is not None else ""
                v_6 = ""
                if not pd.isnull(row2["date_end"]):
                    v_6 = row2["date_end"].strftime("%d.%m.%Y")
                v_7 = row2["comment"] if row2["comment"] is not None else ""
                v_8 = ""
                if not pd.isnull(row2["date_act"]):
                    v_8 = row2["date_act"].strftime("%Y-%m-%d")

                html += f"""    <td class="doc_table"
                    style="text-align:center">

                    <input name="num_pp_{row2['id']}" type="text"
                     class="date-input" value="{value_1}"
                       style="width: 185px;"><input type="image"
                         src="/static/admin/img/icon-addlink.svg"
                           alt="Добавить" title="Добавить"
                             onclick="add_dop_pp('{row2['id']}');\
                                  return false;" style="width: 15px;
                                    height: 15px; margin-top: -10px;">
                                    {info_obj.get_input_num_pp(row2['id'])}</td>
                <td class="doc_table"
                    style="text-align:center">
                    <input name="date_pp_{row2['id']}" type="date"
                     class="date-input"
                       value="{v_2}"
                style="width: 105px;">{info_obj.get_input_date_pp(row2['id'])}
                </td>
                <td class="doc_table"
                    style="text-align:center">
                    <input name="payment_{row2['id']}" type="text"
                     class="date-input" value="{'{:,}'
                .format(v_3)
                .replace(",", " ")
                .replace(".", ",")}"
                       style="width: 100px;">{v_4}</td>
                <td class="doc_table"
                    style="text-align:center">
                    <input name="flag_invoice_issued_{row2['id']}"
                     type="checkbox" class="flags" {checked_invoice_issued}>
                     </td>
                <td class="doc_table"
                    style="text-align:center">
                    <input name="date_act_{row2['id']}" type="date"
                     class="date-input" value="{v_8}" style="width: 105px;">
                     </td>
                <td class="doc_table"
                    style="text-align:center">
                    <input name="num_act_{row2['id']}" type="text"
                     class="num_act-input"
                value="{v_5}" style="width: 200px;"></td>
                <td class="doc_table"
                    style="text-align:center">
                    {v_6}</td>
                <td class="doc_table"
                    style="text-align:center">
                    <input name="comment_{row2['id']}" type="text"
                     class="date-input" value="{v_7}"
                       style="width: 200px;"></td>
                            </tr>"""

    dop_doc_date_id_list = info_obj.dop_doc_date_id_list.copy()
    info_obj.dop_doc_date_id_list = list()
    add_new_doc = (
        request.user.groups.filter(  # type: ignore
            name="Добавить новый договор"
        ).exists(),
    )

    return render(
        request,
        "documents/list_doc.html",
        context={
            "html": html,
            "find_doc_id": find_doc_id,
            "doc_id": doc_id,
            "doc_date_id_list": doc_date_id_list,
            "dop_doc_date_id_list": dop_doc_date_id_list,
            "flag_upd": flag_upd,
            "invoices": invoices,
            "overhead": OverheadCostsAdder().get_overhead_costs(int(doc_id)),
            "headers": headers,
            "documentTitle": document_title,
            "textLines": text_lines,
            "table_html": table_html,
            "add_new_doc": add_new_doc,
        },
    )


def change_status_doc(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        active = request.POST.get("id")
        archive = request.POST.get("id_archive")
        bild_done = request.POST.get("id_bild_done")
        not_bild_done = request.POST.get("id_not_bild_done")

        if request.POST.get("save_new_log"):
            doc_id = request.POST.get("new_log_doc_id")
            text = str(request.POST.get("new_log")).replace("\r\n", "\n")
            user_name = request.POST.get("new_log_user_name")
            date = datetime.datetime.now()
            with engine.connect() as con:
                con.execute(
                    sql_text(
                        "INSERT INTO log_doc \
                        (doc_id,text,user_name,date_time) "
                        f"VALUES('{doc_id}', \
                        '{text}', '{user_name}', '{date}');"
                    )
                )
                con.commit()

        if request.POST.get("save"):
            response_data: dict[Any, Any] = {
                "new_stage": {},
                "new_pp_stage": {},
            }
            doc_date_id_list = json.loads(
                request.POST.get("doc_date_id_list", "")
            )
            dop_doc_date_id_list = json.loads(
                request.POST.get("dop_doc_date_id_list", "")
            )
            doc_id = request.POST.get("doc_id")
            flag = get_flags(request.POST.get(f"flag_{doc_id}"))

            with engine.connect() as con:
                all_upd_flag = con.execute(
                    sql_text(
                        f"SELECT flag_upd "
                        f"FROM documents "
                        f"WHERE id = {doc_id}"
                    )
                ).scalar()

            with engine.connect() as con:
                con.execute(
                    sql_text(
                        f"UPDATE documents \
                    SET flag = '{flag}' WHERE id = '{doc_id}';"
                    )
                )
                con.commit()
            total_sum_stage = 0.0
            total_payment = 0.0
            accomplishment_total = 0.0
            payment_on_upd = 0.0
            for doc_date_id in doc_date_id_list:
                flag = get_flags(
                    in_flag=request.POST.get(f"flag_doc_date_{doc_date_id}")
                )
                flag_stage_work = get_flags(
                    in_flag=request.POST.get(
                        f"flag_stage_work_doc_date_{doc_date_id}"
                    )
                )
                flag_stage_pay = get_flags(
                    in_flag=request.POST.get(
                        f"flag_stage_pay_doc_date_{doc_date_id}"
                    )
                )
                flag_stage_upd = get_flags(
                    in_flag=request.POST.get(
                        f"flag_stage_upd_doc_date_{doc_date_id}"
                    )
                )
                flag_invoice_issued = get_flags(
                    in_flag=request.POST.get(
                        f"flag_invoice_issued_{doc_date_id}"
                    )
                )
                date_act = request.POST.get(f"date_act_{doc_date_id}")
                date_pp = request.POST.get(f"date_pp_{doc_date_id}")
                sum_stage = (
                    request.POST.get(f"sum_stage_{doc_date_id}", "")
                    .replace(",", ".")
                    .replace("\xa0", "")
                    .replace(" ", "")
                    if request.POST.get(f"sum_stage_{doc_date_id}") != ""
                    else 0
                )
                total_sum_stage += float(sum_stage)  # type: ignore
                if flag == "true":
                    accomplishment_total += float(sum_stage)  # type: ignore
                payment_doc_date = request.POST.get(
                    f"payment_{doc_date_id}", ""
                )
                payment_doc_date = payment_doc_date.replace(",", ".").replace(
                    " ", ""
                )

                # payment_doc_date - оплачено/закрыто за этап
                # (только первое значение)

                with engine.connect() as con:
                    results = con.execute(
                        sql_text(
                            f"SELECT * "
                            f"FROM public.doc_date_pp "
                            f"WHERE id_doc_date = {doc_date_id}"
                        )
                    ).all()
                    additional_stage_sum = 0.0
                    # остальные значения оплачено/закрыто
                    if results:
                        for result in results:
                            additional_stage_sum += result[4]

                total_payment += float(payment_doc_date)
                total_payment += additional_stage_sum

                if all_upd_flag or flag_stage_upd == "true":
                    payment_on_upd += float(payment_doc_date)
                    payment_on_upd += additional_stage_sum

                with engine.connect() as con:
                    con.execute(
                        sql_text(
                            f"UPDATE doc_date SET flag = '{flag}', "
                            f"stage_work = '{flag_stage_work}', "
                            f"stage_pay = '{flag_stage_pay}', "
                            f"stage_upd = '{flag_stage_upd}', "
                            f"invoice_issued = '{flag_invoice_issued}', "
                            f"""payment =\
                        '{payment_doc_date if payment_doc_date != ''  else 0}'\
                        , """
                            f"""{f"date_act = '{date_act}', " if date_act else ''}"""  # noqa
                            f"""{f"date_pp = '{date_pp}', " if date_pp else ''}"""  # noqa
                            f"num_pp = '{request.POST.get(f'num_pp_{doc_date_id}')}', "  # noqa
                            f"""num_act =\
                              '{request.POST.get(f'num_act_{doc_date_id}')}',"""  # noqa
                            f"npp = '{request.POST.get(f'npp_{doc_date_id}')}',"  # noqa
                            f"sum_stage = '{sum_stage}', "
                            f"""comment = \
                            '{request.POST.get(f'comment_{doc_date_id}')}'\
                              WHERE id = '{doc_date_id}';"""
                        )
                    )
                    con.commit()

            with engine.connect() as con:
                # Сумма договора
                total_sum_stage = round(total_sum_stage, 2)

                # Оплачено
                total_payment = round(total_payment, 2)

                # Остаток по договору
                balance_contract = round(total_sum_stage - total_payment, 2)

                # Выполнение
                accomplishment = round(accomplishment_total, 2)

                # Оплачено по УПД
                payment_on_upd = round(payment_on_upd, 2)

                # ИТОГО задолженность покупателя
                result_dolg = 0.0
                if all_upd_flag:
                    result_dolg = total_sum_stage - total_payment
                else:
                    result_dolg = accomplishment - payment_on_upd
                result_dolg = round(result_dolg, 2)

                total_sum_stage_str = number_to_formatted_str(total_sum_stage)
                total_payment_str = number_to_formatted_str(total_payment)
                balance_contract_str = number_to_formatted_str(
                    balance_contract
                )
                accomplishment_str = number_to_formatted_str(accomplishment)
                payment_on_upd_str = number_to_formatted_str(payment_on_upd)
                result_dolg_str = number_to_formatted_str(result_dolg)

                result = con.execute(
                    sql_text(
                        f"UPDATE web_doc_list_info "
                        f"SET sum_stage = '{total_sum_stage_str}', "
                        f"payment = '{total_payment_str}', "
                        f"balance_contract = '{balance_contract_str}', "
                        f"accomplishment = '{accomplishment_str}', "
                        f"payment_upd = '{payment_on_upd_str}', "
                        f"result_dolg = '{result_dolg_str}' "
                        f"WHERE doc_id = {doc_id}"
                    )
                )
                con.commit()

            for dop_doc_date_id in dop_doc_date_id_list:
                payment = (
                    request.POST.get(
                        f"dop_payment_{dop_doc_date_id}", ""
                    )  # noqa
                    .replace(",", ".")
                    .replace("\xa0", "")
                    .replace(" ", "")
                    if request.POST.get(f"dop_payment_{dop_doc_date_id}") != ""
                    else 0
                )
                date_pp = request.POST.get(f"dop_date_pp_{dop_doc_date_id}")
                with engine.connect() as con:
                    con.execute(
                        sql_text(
                            f"""UPDATE doc_date_pp SET """
                            f"""payment = '{payment}', """
                            f"""{f"date_pp = '{date_pp}', " if date_pp != '' else ''}"""  # noqa
                            f"""num_pp = """
                            f"""'{request.POST.get(f'dop_num_pp_{dop_doc_date_id}')}'"""  # noqa
                            f"""WHERE id = '{dop_doc_date_id}';"""
                        )
                    )
                    con.commit()
            info = pd.read_sql_query(
                f"""SELECT short_name FROM documents WHERE\
                      id = '{request.POST.get('doc_id')}';""",
                engine,
            )
            for i in range(int(request.POST.get("counter_new_element", "0"))):
                if (
                    request.POST.get(f"work_name_new{i}") != ""
                    and request.POST.get(f"work_name_new{i}") is not None
                ):
                    date_pp = request.POST.get(f"date_pp_new{i}")
                    date_act = request.POST.get(f"date_act_new{i}")
                    date = request.POST.get(f"date_new{i}", "")  # type: ignore
                    flag = get_flags(
                        in_flag=request.POST.get(f"flag_doc_date_new{i}")
                    )
                    flag_stage_work = get_flags(
                        in_flag=request.POST.get(
                            f"flag_stage_work_doc_date_new{i}"
                        )
                    )
                    flag_stage_pay = get_flags(
                        in_flag=request.POST.get(
                            f"flag_stage_pay_doc_date_new{i}"
                        )
                    )
                    flag_stage_upd = get_flags(
                        in_flag=request.POST.get(
                            f"flag_stage_upd_doc_date_new{i}"
                        )
                    )
                    flag_invoice_issued = get_flags(
                        in_flag=request.POST.get(f"flag_invoice_issued_{i}")
                    )

                    payment_new = request.POST.get(f"payment_new{i}", "")
                    num_act_new = request.POST.get(f"num_act_new{i}", "")
                    num_pp_new = request.POST.get(f"num_pp_new{i}", "")
                    comment_new = request.POST.get(f"comment_new{i}", "")
                    sum_stage_new = request.POST.get(
                        f"sum_stage_new{i}", "0"
                    ).replace(",", ".")
                    with engine.connect() as con:
                        result = con.execute(
                            sql_text(
                                f"INSERT INTO doc_date (doc_name, "
                                "work_name, "
                                f"{'date_act,' if date_act else ''}"
                                f"{'date_pp,' if date_pp else ''}"
                                f"{'date_end,' if date else ''}"
                                "document_id, "
                                "sum_stage, "
                                "flag, "
                                f"{'payment,' if payment_new != '' else ''}"
                                f"{'num_act,' if num_act_new != '' else ''}"
                                f"{'num_pp,' if num_pp_new != '' else ''}"
                                f"{'comment,' if comment_new != '' else ''}"
                                "stage_work, "
                                "stage_pay, "
                                "stage_upd, "
                                "invoice_issued, "
                                "npp) "
                                f"""VALUES('{info.iloc[0,0]}',
        '{request.POST.get(f'work_name_new{i}')}',
        {f"'{date_act}'," if date_act else ''}
        {f"'{date_pp}'," if date_pp else ''}
        {f"'{date}'," if date else ''}
        '{request.POST.get(f'doc_id')}',
        '{sum_stage_new}',
        '{flag}',
        {f"'{payment_new.replace(',','.')}',"  if payment_new != '' else ''}
        {f"'{num_act_new}',"  if num_act_new != '' else ''}
        {f"'{num_pp_new}',"  if num_pp_new != '' else ''}
        {f"'{comment_new}',"  if comment_new != '' else ''}
        '{flag_stage_work}',
        '{flag_stage_pay}',
        '{flag_stage_upd}',
        '{flag_invoice_issued}',
        '{request.POST.get(f'npp_new{i}')}') RETURNING id;"""
                            )
                        )
                        con.commit()
                    response_data["new_stage"].update(
                        {i: result.fetchone()[0]}
                    )
            dict_new_elements = json.loads(
                request.POST.get("dict_new_elements", "")
            )
            for i in dict_new_elements.keys():
                if (
                    request.POST.get(f"dop_num_pp_new{i}") != ""
                    and request.POST.get(f"dop_num_pp_new{i}") is not None
                ):
                    payment = (
                        request.POST.get(f"dop_payment_new{i}", "")
                        .replace(",", ".")
                        .replace("\xa0", "")
                        .replace(" ", "")
                        if request.POST.get(f"dop_payment_new{i}") != ""
                        else 0
                    )
                    date_pp = request.POST.get(f"dop_date_pp_new{i}")
                    with engine.connect() as con:
                        result = con.execute(
                            sql_text(
                                f"INSERT INTO doc_date_pp "
                                f"(id_doc_date, "
                                f"{'payment,' if payment != '' else ''} "
                                f"{'date_pp,' if date_pp else ''} "
                                f"{'num_pp,' if request.POST.get(f'dop_num_pp_new{i}') != '' else ''}noct) "  # noqa
                                f"""VALUES('{dict_new_elements[i]}',
                                {f"'{payment}'," if payment != '' else ''}
                                {f"'{date_pp}'," if date_pp != '' else ''}
                                {f"'{request.POST.get(f'dop_num_pp_new{i}')}'," if request.POST.get(f'dop_num_pp_new{i}') != '' else ''}'0') RETURNING id;"""  # noqa
                            )
                        )
                        con.commit()
                    response_data["new_pp_stage"].update(
                        {i: result.fetchone()[0]}
                    )
            response_json = json.dumps(
                response_data
            )  # Преобразование словаря в JSON-строку
            return HttpResponse(response_json, content_type="application/json")
        with engine.connect() as con:
            if active is not None:
                con.execute(
                    sql_text(
                        f"""UPDATE  documents SET doc_open = 'false'\
                         WHERE  id = '{active}';"""
                    )
                )
                contracts = Contract.objects.filter(contract_id=active)
                for contract in contracts:
                    contract.status = "Архив"
                    contract.save()
            elif archive is not None:
                con.execute(
                    sql_text(
                        f"""UPDATE  documents SET doc_open = 'true'\
                         WHERE  id = '{archive}';"""
                    )
                )
                contracts = Contract.objects.filter(contract_id=archive)
                for contract in contracts:
                    contract.status = "Активный"
                    contract.save()
            elif bild_done is not None:
                con.execute(
                    sql_text(
                        f"""UPDATE  documents SET doc_bild_done = 'true'\
                         WHERE  id = '{bild_done}';"""
                    )
                )
                contracts = Contract.objects.filter(contract_id=bild_done)
                for contract in contracts:
                    contract.status = "Активный"
                    contract.save()
            elif not_bild_done is not None:
                con.execute(
                    sql_text(
                        f"""UPDATE  documents SET doc_bild_done = 'false'\
                          WHERE  id = '{not_bild_done}';"""
                    )
                )
                contracts = Contract.objects.filter(contract_id=not_bild_done)
                for contract in contracts:
                    contract.status = "Нет стройки"
                    contract.save()
            con.commit()
    return HttpResponseRedirect("/documents/list_doc/")


def log_doc(request: HttpRequest, doc_id: str = "all") -> HttpResponse:
    document_title, text_lines, table_html = log_docement(doc_id=doc_id)
    return render(
        request,
        "documents/log_doc.html",
        context={
            "documentTitle": document_title,
            "textLines": text_lines,
            "table_html": table_html,
        },
    )


def edit_doc(request: HttpRequest, doc_id: str = "new_doc") -> Any:
    """
    Обьяснения in_*
    in_number_doc - Номер договора (number_doc)
    in_subject_contract - Предмет договора (subject_contract)
    in_counterparty - Контрагент (counterparty)
    in_name - Наименование договора (name)
    in_short_name - Краткое название договора (short_name)
    in_link - Ссылка на договор (link)
    in_type_works - Тип работ (type_works)
    in_date - Дата (date), она же и дата начала работ.
    in_tags - Теги
    text_for_call - Название для озвучки
    """
    # Если мы нажимаем сохранить
    if request.POST.get("save"):
        in_number_doc = request.POST.get("in_number_doc")
        text_for_call = request.POST.get("text_for_call")
        with engine.connect() as con:
            date = request.POST.get("in_date", "01-01-2000").split("-")
            date_str = f"{date[2]}.{date[1]}.{date[0]}"
            update_sql_query = """
                UPDATE documents
                SET
                    number_doc = :in_number_doc,
                    subject_contract = :in_subject_contract,
                    counterparty = :in_counterparty,
                    name = :in_name,
                    short_name = :in_short_name,
                    link = :in_link,
                    type_works = :in_type_works,
                    date = :date_str,
                    teg = :in_tags,
                    flag_upd = :flag_upd,
                    text_for_call = :text_for_call
                WHERE
                    id = :doc_id
            """

            params = {
                "in_number_doc": in_number_doc,
                "in_subject_contract": request.POST.get("in_subject_contract"),
                "in_counterparty": request.POST.get("in_counterparty"),
                "in_name": request.POST.get("in_name"),
                "in_short_name": request.POST.get("in_short_name"),
                "in_link": request.POST.get("in_link"),
                "in_type_works": request.POST.get("in_type_works"),
                "date_str": date_str,
                "in_tags": request.POST.get("in_tags"),
                "flag_upd": get_flags(request.POST.get("flag_upd")),
                "text_for_call": text_for_call,
                "doc_id": doc_id,
            }
            con.execute(sql_text(update_sql_query), params)
            con.commit()

            contracts = Contract.objects.filter(contract_id=doc_id)
            for contract in contracts:
                contract.contract_counterparty = request.POST.get(
                    "in_counterparty", ""
                )
                contract.contract = request.POST.get("in_name", "")
                contract.short_name = request.POST.get("in_short_name", "")
                contract.save()

        doc_date_id_list = json.loads(
            request.POST.get("doc_date_id_list", "")
        )  # noqa
        for doc_date_id in doc_date_id_list:
            if (
                request.POST.get(f"in_work_name_{doc_date_id}") is None
                and request.POST.get(f"in_sum_stage_{doc_date_id}") is None
                and request.POST.get(f"in_date_{doc_date_id}") is None
            ):
                with engine.connect() as con:
                    con.execute(
                        sql_text(
                            f"DELETE FROM doc_date WHERE id = '{doc_date_id}';"
                        )
                    )
                    con.commit()
            else:
                print(request.POST.get(f"in_date_{doc_date_id}"))
                date = get_date(request.POST.get(f"in_date_{doc_date_id}"))
                print(date)
                if not date:
                    messages.error(request, "Ошибка при вводе даты!")
                    return redirect(f"/documents/edit_doc/{doc_id}")

                in_sum_stage = request.POST.get(f"in_sum_stage_{doc_date_id}")
                in_sum_stage = str(in_sum_stage).replace(",", ".")
                with engine.connect() as con:
                    con.execute(
                        sql_text(
                            f"UPDATE doc_date SET work_name = "
                            f"'{request.POST.get(f'in_work_name_{doc_date_id}')}', "  # noqa
                            f"doc_name = '{request.POST.get('in_short_name')}', "  # noqa
                            f"sum_stage = "
                            f"'{in_sum_stage}', "
                            f"npp = '{request.POST.get(f'npp_{doc_date_id}')}', "  # noqa
                            f"date_end = '{date}' WHERE id = '{doc_date_id}';"
                        )
                    )
                    con.commit()
        w_name = [
            request.POST.get(key)
            for key in request.POST
            if "in_work_name_new" in key
        ]
        w_date = [
            request.POST.get(key)
            for key in request.POST
            if "in_date_new" in key
        ]
        w_sum_stage = [
            str(request.POST.get(key)).replace(",", ".")
            for key in request.POST
            if "in_sum_stage_new" in key
        ]
        w_npp = [
            request.POST.get(key) for key in request.POST if "npp_new" in key
        ]
        # Обработка наименований работ и их даты
        for i in range(len(w_name)):
            if w_name[i] is not None:
                date = get_date(w_date[i])
                with engine.connect() as con:
                    con.execute(
                        sql_text(
                            f"INSERT INTO doc_date (\
                            doc_name,\
                             work_name,\
                             date_end,\
                             sum_stage,\
                             npp) VALUES(\
                            '{request.POST.get('in_short_name')}',\
                             '{w_name[i]}',\
                             '{date}',\
                             '{w_sum_stage[i]}',\
                             '{w_npp[i]}');"
                        )
                    )
                    con.commit()

        messages.success(request, "Данные успешно сохранены!")
        return redirect("list_doc")

    if doc_id != "new_doc":
        context = {}
        documents_df = pd.read_sql(
            f"SELECT * FROM documents WHERE id = '{doc_id}';", engine
        )
        if not documents_df.empty:
            for idx, row in documents_df.iterrows():
                # я всё добавляю id_document кторый равен id документа...
                #  надо всё доделать и
                #  больше не привязываться к короткому названию
                doc_date_df = pd.read_sql(
                    sql_text(
                        f"""SELECT id, work_name, date_end, sum_stage, npp
                            FROM public.doc_date
                            WHERE doc_name = '{row['short_name']}'
                            ORDER BY npp"""
                    ),
                    engine,
                )
                doc_date_df = doc_date_df.fillna("")
                date = row["date"].split(".")
                date_str = f"{date[2]}-{date[1]}-{date[0]}"
                context.update(
                    {
                        "in_number_doc": row["number_doc"],
                        "in_subject_contract": row["subject_contract"],
                        "in_counterparty": row["counterparty"],
                        "in_name": row["name"],
                        "in_short_name": row["short_name"],
                        "in_link": row["link"],
                        "in_type_works": row["type_works"],
                        "in_date": date_str,
                        "in_tags": row["teg"],
                        "text_for_call": row["text_for_call"],
                    }
                )
                doc_date_id_list = list()
                doc_date_data = list()
                for idx, row2 in doc_date_df.iterrows():
                    doc_date_id_list.append(row2["id"])

                    data = {
                        "id": row2["id"],
                        "npp": row2["npp"],
                        "work_name": row2["work_name"],
                        "date_end": str(row2["date_end"])[:10]
                        if not pd.isnull(row2["date_end"])
                        else "",
                        "sum_stage": row2["sum_stage"],
                    }
                    doc_date_data.append(data)
                checked = ""
                if row["flag_upd"]:
                    checked = 'checked="checked"'
                context.update(
                    {
                        "doc_date_data": doc_date_data,
                        "old_short_name": row["short_name"],
                        "doc_date_id_list": doc_date_id_list,
                        "doc_id": doc_id,
                        "checked": checked,
                    }
                )
                return render(
                    request, "documents/edit_doc.html", context=context
                )
    else:
        return redirect("new_doc")
    return None


def new_doc(
    request: HttpRequest,
) -> Any:
    global data_list_on_telegram
    """
    Обьяснения in_*
    in_1 - Номер договора (number_doc)
    in_subject_contract - Предмет договора (subject_contract)
    in_2 - Контрагент (counterparty)
    in_3 - Наименование договора (name)
    in_4 - Краткое название договора (short_name)
    in_5 - Ссылка на договор (link)
    in_6 - Тип работ (type_works)
    in_7 - Дата (date), она же и дата начала работ.
    in_8 - Количество работ и дат завершения.
    in_29 - Теги

    когда заполняем первую форму мы вводим количества работ. и исходя из этого
      мы берем веременные работа(in_9) и дата(in_10) ее завершения. И т.д.
    in_name_* - Наименование работ которые записываются в таблицу doc_date
    (нечетные числа, полюбому есть вариант лучше этого, но когда делал я не
      особо парился.)
    in_date_* - Дата завершения данных работ которые записываются в таблицу
      doc_date
    in_sum_stage_* - Сумма этапа которые записываются в таблицу doc_date

    :param request:
    :return:
    """
    if request.method == "POST":
        if request.POST.get("send_telegram") is None:
            context = {"context": "POST"}
            for key in request.POST:
                context.update({key: request.POST.get(key)})  # type: ignore

            if request.POST.get("save") is not None:
                test_stage_for_msg: str = ""
                sum_stage: float = 0.0
                df = pd.read_sql(
                    f"""SELECT COUNT(*)
                      FROM documents
                        WHERE number_doc = '{context['in_1']}'
                          and short_name = '{context['in_4']}'
                            and name = '{context['in_3']}';""",
                    engine,
                )
                if df.iloc[0, 0] == 0:
                    date = context["in_7"].split("-")
                    date = f"{date[2]}.{date[1]}.{date[0]}"  # type: ignore
                    with engine.connect() as con:
                        if (
                            context["in_29"] != ""
                        ):  # in_29 - теги, если их нет,
                            # то мы просто не записываем.
                            result = con.execute(
                                sql_text(
                                    f"""INSERT INTO documents (\
                                    number_doc,\
                                     counterparty,\
                                     name,\
                                     scan,\
                                     short_name,\
                                     link,\
                                     type_works,\
                                     mail,\
                                     teg,\
                                     text_for_call,\
                                     subject_contract,\
                                     flag_upd,\
                                     date) """
                                    f"VALUES(\
                                    '{context['in_1']}',\
                                     '{context['in_2']}',\
                                     '{context['in_3']}',\
                                     '1',\
                                     '{context['in_4']}',\
                                     '{context['in_5']}',\
                                     '{context['in_6']}',\
                                     'info@ivea-water.ru;cherkas1@yandex.ru;\
                                     nm@ivea-water.ru;ks@ivea-water.ru;\
                                     ds@ivea-water.ru',\
                                     '{context['in_29']}',\
                                     '{context['text_for_call']}',\
                                     '{context['in_subject_contract']}',\
                                     '{get_flags(request.POST.get('flag_upd'))}',\
                                     '{date}') RETURNING id;"
                                )
                            )
                            con.commit()
                        else:
                            result = con.execute(
                                sql_text(
                                    f"""INSERT INTO documents (\
                                    number_doc,\
                                     counterparty,\
                                     name,\
                                     scan,\
                                     short_name,\
                                     link,\
                                     type_works,\
                                     mail,\
                                     text_for_call,\
                                     subject_contract,\
                                     flag_upd,\
                                     date) """
                                    f"""VALUES(\
                                    '{context['in_1']}',\
                                     '{context['in_2']}',\
                                     '{context['in_3']}',\
                                     '1',\
                                     '{context['in_4']}',\
                                     '{context['in_5']}',\
                                     '{context['in_6']}',\
                                     'info@ivea-water.ru;cherkas1@yandex.ru;nm@ivea-water.ru;ks@ivea-water.ru;ds@ivea-water.ru',\
                                     '{context['text_for_call']}',\
                                     '{context['in_subject_contract']}',\
                                     '{get_flags(request.POST.get('flag_upd'))}',\
                                     '{date}') RETURNING id;"""
                                )
                            )
                            con.commit()
                    w_name = [
                        context[key]
                        for key in context
                        if "in_work_name_new" in key
                    ]
                    w_date = [
                        context[key] for key in context if "in_date_new" in key
                    ]
                    w_sum_stage = [
                        str(context[key]).replace(",", ".")
                        for key in context
                        if "in_sum_stage_new" in key
                    ]
                    w_npp = [
                        context[key] for key in context if "npp_new" in key
                    ]
                    # Обработка наименований работ и их даты
                    for i in range(len(w_name)):
                        if w_name[i] is not None:
                            with engine.connect() as con:
                                con.execute(
                                    sql_text(
                                        f"""INSERT INTO doc_date \
                                    (doc_name, work_name, date_end, \
                                    sum_stage, npp)
                                      VALUES(\
                                        '{context['in_4']}',\
                                         '{w_name[i]}',\
                                         '{w_date[i]}',\
                                         '{w_sum_stage[i]}',\
                                         '{w_npp[i]}');"""
                                    )
                                )
                                con.commit()
                        test_stage_for_msg += f"{i+1}){w_name[i]}/\
                                                {w_sum_stage[i]}/{w_date[i]}\n"
                        sum_stage += float(w_sum_stage[i])
                    row = result.fetchone()
                    contract_id = row[0]
                    Contract.objects.create(
                        contract_id=contract_id,
                        contract_counterparty=context["in_2"],
                        contract=context["in_3"],
                        short_name=context["in_4"],
                        status="Активный",
                    )
                    if request.POST.get("checkbox") is None:
                        messages.success(request, "Данные успешно сохранены!")
                        return redirect("home")
                    else:
                        data_list_on_telegram = {  # type: ignore
                            "data": {},
                            "add": {},
                            "del": {},
                        }
                        return create_now_group_on_telegram(request)
                else:
                    messages.error(
                        request, "Такой договор уже имеется в базе данных."
                    )
                    return redirect("home")
            return render(request, "documents/new_doc.html", context=context)
        else:
            return create_now_group_on_telegram(request)
    if request.method == "GET":
        return render(
            request, "documents/new_doc.html", context={"context": "GET"}
        )


def create_now_group_on_telegram(
    request: HttpRequest,
) -> HttpResponseRedirect | HttpResponsePermanentRedirect | HttpResponse:
    info = pd.read_sql_query(
        "SELECT id, name, family_name FROM doc_key_corp ORDER BY id ASC;",
        engine,
    )

    if request.POST.get("send_telegram") == "send_telegram":
        info2 = pd.read_sql_query(
            f"""SELECT id, short_name FROM documents
              WHERE number_doc = '{request.POST.get('in_1')}'
                and name = '{request.POST.get('in_3')}';""",
            engine,
        )
        if not info2.empty:
            sms = f"""Необходимо создать группу:\n
            {info2.loc[0, 'short_name']}(внутр.№{info2.loc[0, 'id']})\n
            Состав: """
            add_people = str(request.POST.getlist("add_people"))
            add_people = add_people.replace("[", "").replace("]", "")
            add_people = add_people.replace("'", "")
            sms += f"""{add_people}."""
            send_msg(sms)
        messages.success(request, "Данные успешно сохранены!")
        return redirect("home")
    list_choice = dict()
    for i, row in info.iterrows():
        list_choice.update({i: f"{row['name']} {row['family_name']}"})
    list_choice.update({1994: "ivea-corporate(bot)"})

    return render(
        request,
        "documents/create_new_group.html",
        context={
            "list_choice": list_choice,
            "data": data_list_on_telegram["data"],  # type: ignore
            "in_1": request.POST.get("in_1"),
            "in_3": request.POST.get("in_3"),
        },
    )


def not_an_agreed_doc(request: HttpRequest) -> HttpResponse:
    info = pd.read_sql_query(
        """SELECT id, num_doc, contragent,\
          date_doc, num_1c, \"comment\", sum FROM doc_entera_1c WHERE\
            send_email = 'False' and delete = 'False';""",
        engine,
    )
    document_info = pd.read_sql_query("SELECT * FROM documents;", engine)
    html = ""
    for idx, row in info.iterrows():
        # Пример если в коменте не один договор
        # ТС№ 34/034/БелРаст_к2,ТС №32/033/Берез_к2,
        # ТС№ 29/026/ДМД2_АБК,¶Приложение №22/01 от 17.01.2022
        #  к Договору №015/05-115-269-К,Пушкино 2 расходомер СД80,
        # еще пример Пушкино 2 расходомер СД80,ТС№ 34/034/БелРаст_к2,
        # ТС№ 6/034/БелРаст_к2
        list_short_name = row["comment"].split(", ")  #
        # print(list_short_name)
        counterparty = ""
        number_doc = ""
        short_name_doc = ""
        for short_name in list_short_name:
            # print(short_name)
            # list_short_name = row['comment']
            df = document_info[document_info["short_name"] == short_name]
            for idx2, row2 in df.iterrows():
                if (
                    counterparty == ""
                    and number_doc == ""
                    and short_name_doc == ""
                ):
                    counterparty += row2["counterparty"]
                    number_doc += row2["number_doc"]
                    short_name_doc += row2["short_name"]
                else:
                    counterparty += ", " + row2["counterparty"]
                    number_doc += ", " + row2["number_doc"]
                    short_name_doc += ", " + row2["short_name"]
                # break
        row_sum = (
            str(
                "{:,}".format(
                    float(
                        str(row["sum"]).replace("\xa0", "").replace(",", ".")
                    )
                )
            )
            .replace(",", "\u00A0")
            .replace(".", ",")
        )
        html += f"""<tr>
        <td class="doc_table" style="text-align:center">
            {row['id']}
        </td>
        <td class="doc_table" style="text-align:center">
            {row['num_1c']}
        </td>
        <td class="doc_table" style="text-align:center">
            Счёт № {row['num_doc']}
        </td>
        <td class="doc_table" style="text-align:center">
            {row['contragent']}
        </td>
        <td class="doc_table" style="text-align:center">
            {row['date_doc']}
        </td>
        <td class="doc_table" style="text-align:center">
            {counterparty}
        </td>
        <td class="doc_table" style="text-align:center">
            {number_doc}
        </td>
        <td class="doc_table" style="text-align:center">
            {short_name_doc}
        </td>
        <td class="doc_table" style="text-align:center">
            {row_sum}
        </td>
                </tr>"""

    list_sum = [
        float(str(cost).replace("\xa0", "").replace(",", "."))
        for cost in info["sum"].to_list()
    ]
    summa = (
        "{:,}".format(sum(list_sum)).replace(",", "\u00A0").replace(".", ",")
    )
    return render(
        request,
        "documents/not_an_agreed_doc.html",
        context={"html": html, "summa": summa},
    )


def get_summa_and_info_json(info: pd.DataFrame) -> tuple[str, str]:
    cost_list = info["sum_stage"].to_list()
    summa = "{:,}".format(sum(cost_list)).replace(",", " ").replace(".", ",")
    info["sum_stage"] = [
        "{:,}".format(cost).replace(",", " ").replace(".", ",")
        for cost in cost_list
    ]
    # Преобразуйте DataFrame в JSON и передайте его в контекст
    info_json = info.to_json(orient="records")
    return summa, info_json


def invoices_under_approval(request: HttpRequest) -> HttpResponse:
    info = pd.read_sql_query(
        """SELECT doc_date.id,
                documents.counterparty,
                documents.number_doc,
                documents.short_name,
                doc_date.work_name,
                doc_date.sum_stage,
        CASE WHEN doc_date.payment IS NULL THEN NULL
        ELSE doc_date.payment + COALESCE(A.total_payment, 0) END AS payment
        FROM doc_date
        INNER JOIN documents ON (doc_date.doc_name = documents.short_name)
        LEFT JOIN (
                    SELECT id_doc_date, SUM(payment) AS total_payment
                    FROM doc_date_pp
                    GROUP BY id_doc_date
                ) A ON (A.id_doc_date = doc_date.id)
        WHERE (doc_date.payment IS NULL OR doc_date.payment >= 0)
                AND (doc_date.sum_stage > 0)
                AND (doc_date.sum_stage != COALESCE(doc_date.payment, 0))
                AND (doc_date.invoice_issued = true)
        ORDER BY doc_date.id DESC;""",
        engine,
    )

    info["sum_stage"] = [
        float(row["sum_stage"]) - float(row["payment"])
        for idx, row in info.iterrows()
    ]
    info = info[info["sum_stage"] != 0.0]
    summa, info_json = get_summa_and_info_json(info)
    return render(
        request,
        "documents/invoices_under_approval.html",
        context={"info_json": info_json, "summa": summa},
    )


def jobs_and_amounts(request: HttpRequest) -> HttpResponse:
    info = pd.read_sql_query(
        """SELECT doc_date.id, documents.counterparty, documents.number_doc,
          documents.date, documents.short_name, doc_date.work_name,
            doc_date.sum_stage FROM doc_date INNER JOIN documents
              ON (doc_date.doc_name=documents.short_name) WHERE
                (doc_date.num_pp IS NULL OR doc_date.num_pp IN (''))
                  AND (doc_date.payment IS NULL OR doc_date.payment = 0)
                    AND (doc_date.sum_stage > 0)
                      AND (doc_date.invoice_issued = false)
                        ORDER BY doc_date.id DESC;""",
        engine,
    )

    summa, info_json = get_summa_and_info_json(info)
    return render(
        request,
        "documents/jobs_and_amounts.html",
        context={"info_json": info_json, "summa": summa},
    )


def list_doc_all(request: HttpRequest) -> HttpResponse:
    info = pd.read_sql_query(
        """SELECT documents.id, documents.counterparty,
                   documents.number_doc, documents.date, documents.flag,
                   web_doc_list_info.procent, documents.short_name,
                   web_doc_list_info.sum_stage,
                   web_doc_list_info.accomplishment,
                   web_doc_list_info.balance_contract,
                   web_doc_list_info.payment, web_doc_list_info.payment_upd,
                   web_doc_list_info.result_dolg, documents.teg,
                   documents.doc_open, documents.doc_bild_done
            FROM documents INNER JOIN web_doc_list_info
            ON (documents.id=web_doc_list_info.doc_id)
            ORDER BY documents.id DESC;""",
        engine,
    )
    info_json = info.to_json(orient="records")

    return render(
        request,
        "documents/list_doc_all.html",
        context={"info_json": info_json, "documentTitle": "Список договоров"},
    )


def list_doc_id_full(
    request: HttpRequest, doc_id: str = "all"
) -> HttpResponse:
    info = pd.read_sql_query(
        f"""SELECT documents.id, documents.counterparty,
                       documents.number_doc, documents.flag,
                       web_doc_list_info.procent, documents.short_name,
                       web_doc_list_info.sum_stage,
                       web_doc_list_info.accomplishment,
                       web_doc_list_info.balance_contract,
                       web_doc_list_info.payment,
                       web_doc_list_info.payment_upd,
                       web_doc_list_info.result_dolg, documents.teg,
                       documents.doc_open, documents.doc_bild_done
                FROM documents INNER JOIN web_doc_list_info
                ON (documents.id=web_doc_list_info.doc_id)
                WHERE documents.id = '{doc_id}';""",
        engine,
    )

    info2 = pd.read_sql_query(
        """SELECT documents.id, documents.counterparty,
                       documents.number_doc, documents.flag,
                       web_doc_list_info.procent, documents.short_name,
                       web_doc_list_info.sum_stage,
                       web_doc_list_info.accomplishment,
                       web_doc_list_info.balance_contract,
                       web_doc_list_info.payment,
                       web_doc_list_info.payment_upd,
                       web_doc_list_info.result_dolg,
                       documents.teg, documents.doc_open,
                       documents.doc_bild_done
                FROM documents INNER JOIN web_doc_list_info
                ON (documents.id=web_doc_list_info.doc_id)
                ORDER BY documents.id DESC;""",
        engine,
    )
    for idx, row in info.iterrows():
        info2 = info2[info2["doc_name"] == row["short_name"]]
        break

    info_json = info.to_json(orient="records")
    info2_json = info2.to_json(orient="records")

    return render(
        request,
        "documents/list_doc_id_full.html",
        context={"info_json": info_json, "info2_json": info2_json},
    )


def list_doc_limitation(request: HttpRequest) -> HttpResponse:
    info = pd.read_sql_query(
        """SELECT id, counterparty, number_doc,
                        short_name, doc_open, doc_bild_done
                FROM documents ORDER BY id DESC;""",
        engine,
    )
    info_json = info.to_json(orient="records")

    return render(
        request,
        "documents/list_doc_limitation.html",
        context={"info_json": info_json},
    )


def number_to_formatted_str(number: float | int) -> str:
    return "{:,}".format(number).replace(",", "\u00A0").replace(".", ",")


class RSSDmitrovListView(ListView[RSSDmitrov]):
    model = RSSDmitrov
    template_name = "rss/rss_dmitrov.html"
    context_object_name = "rss_list"

    def get(
        self, request: HttpRequest, *args: Any, **kwargs: Any
    ) -> HttpResponse:
        user_groups = request.user.groups.all()  # type: ignore

        if (
            "RSS_Dmitrov" in [group.name for group in user_groups]
            or request.user.is_superuser
        ):
            return super().get(request, *args, **kwargs)
        return redirect("home")


def rss_detail_view(
    request: HttpRequest,
    rss_id: int,
) -> HttpResponse | JsonResponse:
    service = RSSDmitrovService(rss_id)

    if request.method == "GET":
        return service.render_detail_page(request)
    else:
        data = json.loads(request.body)["form"]
        return service.update_stage(data)


def delete_rss_dmitrov_stage(
    request: HttpRequest,
    rss_stage_id: int,
) -> JsonResponse:
    if request.method == "POST":
        return RSSDmitrovService.delete_rss_dmitrov_stage(rss_stage_id)
    else:
        return JsonResponse({"success": False, "message": "Invalid request."})


def update_rss_connections(
    request: HttpRequest,
    rss_id: int,
) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
    if request.method == "POST":
        rss_for_relating = request.POST.getlist("new_related_rss_id")

        if not rss_for_relating:
            messages.add_message(request, 50, "Не указаны РСС для связывания")
            return redirect("rss_detail", rss_id=rss_id)

        rss_service = RSSDmitrovService(rss_id)
        for relating_rss_id in rss_for_relating:
            rss_service.add_rss_group(int(relating_rss_id))

        return redirect("rss_detail", rss_id=rss_id)
    else:
        messages.add_message(request, 50, "Не поддерживаемый тип запроса")
        return redirect("rss_detail", rss_id=rss_id)


def update_rss_invoice_connection(
    request: HttpRequest, rss_id: int
) -> JsonResponse:
    service = RSSDmitrovService(rss_id)

    invoice_id = int(json.loads(request.body)["invoice_id"])

    return service.update_invoice_connection(invoice_id)


def update_rss_files(
    request: HttpRequest,
    rss_id: int,
) -> HttpResponseRedirect | HttpResponseRedirect:
    if request.method == "POST":
        documents = request.FILES.getlist("files")

        if not documents:
            messages.add_message(request, 50, "Файлы не указаны")
            return redirect("rss_detail", rss_id=rss_id)

        key = request.POST.get("key", "invalid_key")

        upload_manager = UploadManager("disk:/rss_dmitrov_stage_files/")
        dir_path = upload_manager.mkdir(f"{rss_id}/{key}")

        files = [file.file for file in documents if file.file is not None]
        filenames = [str(file) for file in documents if file.file is not None]

        paths = upload_manager.upload_all(
            files,
            filenames,
            dir_path,
        )

        rss = RSSDmitrov.objects.get(id=rss_id)

        try:
            RSSDmitrovService.update_rss_yandex_paths(rss, key, paths)
        except ValueError:
            messages.add_message(request, 50, "Ошибка ключа папки!")
            return redirect("rss_detail", rss_id=rss_id)

        additional_rss_for_upload = request.POST.getlist("selectedRSS")
        if additional_rss_for_upload:
            for rss_ in additional_rss_for_upload:
                current_rss = RSSDmitrov.objects.get(id=int(rss_))
                try:
                    RSSDmitrovService.update_rss_yandex_paths(
                        current_rss, key, paths, save=True
                    )
                except ValueError:
                    messages.add_message(request, 50, "Ошибка ключа папки!")
                    return redirect("rss_detail", rss_id=rss_id)

        rss.save()

        messages.add_message(request, 100, "Сохранено")
        return redirect("rss_detail", rss_id=rss_id)
    else:
        messages.add_message(request, 50, "Поддерживается только POST метод!")
        return redirect("rss_detail", rss_id=rss_id)


def delete_rss_file(request: HttpRequest, rss_id: int) -> JsonResponse:
    if request.method == "POST":
        key_error = JsonResponse(
            {"success": False, "message": "Ошибка ключа папки!"}
        )

        data = json.loads(request.body)
        path = data.get("path", "invalid_path")
        key = data.get("key", "invalid_key")

        rss = RSSDmitrov.objects.get(pk=rss_id)

        if hasattr(rss, key):
            current_paths = getattr(rss, key)
            if not isinstance(current_paths, list):
                return key_error
            current_paths.remove(path)
            setattr(rss, key, current_paths)
        else:
            return key_error

        if key in [
            "distribution_letter_file_paths",
            "product_on_object_file_paths",
        ]:
            RSSDmitrovService.delete_all_existing_yandex_path(path, key)

        UploadManager("disk:/rss_dmitrov_stage_files/").delete(path=path)
        rss.save()

        return JsonResponse(
            {
                "success": True,
                "message": "Документ удалён!",
            }
        )
    else:
        return JsonResponse(
            {"success": False, "msg": "Only POST/DELETE method!"}
        )


def tkp_table_view(request: HttpRequest) -> HttpResponse:
    context = {
        "tkp_list": TKP.objects.all(),
    }
    return render(request, "tkp/tkp_list.html", context)
