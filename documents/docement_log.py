# coding=UTF-8
#
#
from datetime import datetime

from db_utils import engine

import pandas as pd


def main(doc_id: str = "all") -> tuple[str, list[str], str]:
    info = pd.read_sql_query(
        f"""SELECT log_doc.*, documents.link, documents.link_group,\
              documents.number_doc, documents.date, documents.counterparty,\
                  documents.name, documents.short_name
                                        FROM log_doc INNER JOIN documents\
                                              ON (log_doc.doc_id=documents.id)
                                        WHERE\
                                        documents.id = '{doc_id}'\
                                        ORDER BY log_doc.date_time ASC;""",
        engine,
    )
    quantity = len(info)
    if quantity > 0:
        date_end = info["date_time"].to_list()[-1].strftime("%d.%m.%Y %H:%M")
    else:
        date_end = "-"
    if info.empty:
        info = pd.read_sql(
            f"SELECT * FROM documents WHERE id = '{doc_id}';", engine
        )

    documentTitle: str = (
        f'Отчёт записей по номеру договора {info.loc[0,"number_doc"]}.'
    )
    textLines: list[str] = [
        f"""Список событий по объекту\
              {datetime.now().strftime("%d.%m.%Y %H:%M")}""",
        f"""Ссылка на договор:\
              <a href="{info.loc[0,"link"]}">{info.loc[0,"link"]}</a>""",
    ]
    if info.loc[0, "link_group"] is not None:
        textLines.append(
            f"""Ссылка на группу в телеграмм: <a \
                href="{info.loc[0,"link_group"]}">{info.loc[0,"link_group"]}\
                    </a>"""
        )
    textLines += [
        f"""ООО "ИВЕА" - {info.loc[0,"counterparty"]},\
              {info.loc[0,"number_doc"]} от {info.loc[0,"date"]} г.""",
        f'Условное название: {info.loc[0,"name"]}',
        f"Количество событий: {quantity}",
        f"Дата последнего события: {date_end}",
    ]

    columns = ["#", "Дата", "Текст", "Имя"]
    if date_end != "-":
        info = info.drop(
            [
                "doc_id",
                "date",
                "link",
                "number_doc",
                "counterparty",
                "name",
                "short_name",
            ],
            axis=1,
        )
        info["date_time"] = [
            date.strftime("%d.%m.%Y %H:%M")
            for date in info["date_time"].to_list()
        ]
        info["text"] = [
            text.replace("\n", ". ") for text in info["text"].to_list()
        ]
        info = info.rename(
            columns={"date_time": "Дата", "text": "Текст", "user_name": "Имя"}
        )
        info["#"] = [i + 1 for i in range(len(info))]
        info = info[columns]
    else:
        info = pd.DataFrame({}, columns=columns)
    return (
        documentTitle,
        textLines,
        info.to_html(  # type: ignore
            index=None,
            table_id="log_doc",
            classes="""table_center_by_css table table-bordered table-hover \
                doc_table" style="width:98%""",
        ),
    )
