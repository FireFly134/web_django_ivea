import copy
import datetime
from io import BytesIO
from typing import Any

from db_utils import engine

import pandas as pd

from sqlalchemy import text

import xlsxwriter
from xlsxwriter.format import Format

from .models import (
    object_assembly_details,
    object_assembly_project_equipment,
    object_assembly_purchased,
    object_assembly_under_the_node,
    object_assembly_unit,
    unit_details,
    unit_purchased,
    unit_under_the_node,
    utn_details,
    utn_purchased,
)


class ExcelReportGenerator:
    # Используемые модели для составления отчёта
    reading_models: dict[str, Any] = {
        "Детали": object_assembly_details,
        "Покупное оборудование": object_assembly_purchased,
        "Узел": object_assembly_unit,
        "Подузел": object_assembly_under_the_node,
        "Проектное оборудование": object_assembly_project_equipment,
    }

    def __init__(self, doc_id: int) -> None:
        self.__doc_id = doc_id
        self.__file = BytesIO()
        self.__book = xlsxwriter.Workbook(self.__file)
        self.__init_sheets()
        self.__init_formats()
        self.__read_db()
        self.__init_rows_state()

    def __init_sheets(self) -> None:
        self.__report_sheet = self.__book.add_worksheet("Закупочная ведомость")

    def __init_formats(self) -> None:
        self.__align_center_format = self.__book.add_format(
            {
                "align": "center",
                "valign": "vcenter",
            }
        )

    def __read_db(self) -> None:
        self.__read_info_from_documents()
        self.__read_info_from_doc_id(self.__documents_info["short_name"])

        self.__query_sets_dict: dict[str, Any] = {}

        # Если данные есть - добавляем в память
        for name, model in self.reading_models.items():
            elements = model.objects.filter(belongs=self.__doc_id)
            if elements.exists():
                self.__query_sets_dict.update(
                    {
                        name: (
                            elements,
                            self.__book.add_worksheet(name),
                        ),
                    }
                )

    def __init_rows_state(self) -> None:
        self.__rows = {title: 0 for title in self.__query_sets_dict.keys()}

    def __create_table_header(
        self,
        sheet: Any,
        row: int,
        headers: list[str],
        col: int = 0,
        fg_color: str = "#32a852",
        font_color: str = "#ffffff",
    ) -> int:
        for header in headers:
            sheet.write(
                row,
                col,
                header,
                self.__generate_header_format(fg_color, font_color),
            )
            col += 1
        return row + 1

    def __read_info_from_documents(self) -> None:
        info = pd.read_sql_query(
            text(
                f"SELECT short_name, \
            counterparty, \
            number_doc, \
            subject_contract \
                FROM documents \
                    WHERE id = {self.__doc_id}"
            ),
            engine,
        )

        self.__documents_info: dict[str, Any] = {
            "short_name": info.loc[0, "short_name"],
            "counterparty": info.loc[0, "counterparty"],
            "number_doc": info.loc[0, "number_doc"],
            "subject_contract": info.loc[0, "subject_contract"],
        }

    def __read_info_from_doc_id(self, short_name: str) -> None:
        work_types = pd.read_sql_query(
            text(
                f"SELECT work_name, date_end \
                FROM doc_date WHERE doc_name = '{short_name}' \
                AND stage_work = true"
            ),
            engine,
        )

        doc_id_info = []
        for index, row in work_types.iterrows():
            doc_id_info.append(
                {
                    "work_name": row["work_name"],
                    "date_end": "-"
                    if row["date_end"] is pd.NaT
                    else row["date_end"].strftime("%d.%m.%Y"),
                }
            )

        self.__doc_id_info = doc_id_info

    def __generate_header_format(
        self, fg_color: str, font_color: str
    ) -> Format:
        return self.__book.add_format(
            {
                "align": "center",
                "valign": "vcenter",
                "fg_color": fg_color,
                "font_color": font_color,
            }
        )

    @property
    def doc_id(self) -> int:
        return self.__doc_id

    @property
    def file(self) -> BytesIO:
        self.__book.close()
        self.__file.seek(0)
        return self.__file

    @property
    def documents_info(self) -> dict[str, Any]:
        return copy.deepcopy(self.__documents_info)

    @property
    def doc_id_info(self) -> list[dict[str, Any]]:
        return copy.deepcopy(self.__doc_id_info)

    @property
    def filename(self) -> str:
        return (
            f'Закупочная ведомость «{self.__documents_info["short_name"]}»'
            f' от {datetime.datetime.now().strftime("%d.%m.%Y")}.xlsx'
        )

    def load_workbook(self) -> None:
        self.load_report_sheet()
        self.load_report_components_sheet()

    def load_report_sheet(self) -> None:
        documents_info = self.documents_info
        doc_id_info = self.doc_id_info

        subject_contract = documents_info.get("subject_contract")
        subject_contract_str = "Не указан"
        if subject_contract:
            subject_contract = subject_contract.split()
            for i in range(len(subject_contract), 0, -10):
                subject_contract.insert(i, "\n")

            subject_contract_str = " ".join(subject_contract)

        self.__report_sheet.merge_range(
            "B1:C1",
            f'Закупочная ведомость по объекту {documents_info["short_name"]}',
            self.__align_center_format,
        )
        self.__report_sheet.write(
            1, 1, f"Контрагент - {documents_info['counterparty']}"
        )
        self.__report_sheet.write(
            2, 1, f"Договор - {documents_info['number_doc']}"
        )
        self.__report_sheet.write(
            3, 1, f"Предмет договора - {subject_contract_str}"
        )
        n_count = subject_contract_str.count("\n")
        row_height = 30
        height = row_height if n_count == 0 else n_count * row_height
        self.__report_sheet.set_row(3, height)

        row = 6

        if doc_id_info:
            row = self.__create_table_header(
                self.__report_sheet,
                row,
                ["№", "Вид работы", "Дата"],
                fg_color="#538ed2",
            )

            for i, work_type in enumerate(doc_id_info, 1):
                self.__report_sheet.write(row, 0, i)
                self.__report_sheet.write(row, 1, work_type["work_name"])
                self.__report_sheet.write(row, 2, work_type["date_end"])
                row += 1

            row += 2

        self.__write_assembly_info(row)

        self.__report_sheet.autofit()

    def load_report_components_sheet(self) -> None:
        for title, model_props in self.__query_sets_dict.items():
            model_values = model_props[0]
            sheet = model_props[1]

            headers = ["№", title, "шт."]
            if title == "Детали":
                headers.append("Ссылка на документ")

            row = self.__create_table_header(sheet, 0, headers)
            for i, value in enumerate(model_values, 1):
                self.__write_table_row(sheet, row, value, i)
                if title == "Детали":
                    sheet.write(row, 3, str(value.name.link.strip()))
                row += 1

            self.__rows[title] = row + 2

        self.__autofit_component_sheets()

        nodes = self.__query_sets_dict.get("Узел", [])
        if len(nodes) != 0:
            nodes = nodes[0]

        for sheet_number, node in enumerate(nodes, 1):
            # Лист для конкретного узла
            sheet = self.__book.add_worksheet(f"Узел_{sheet_number}")

            # Узел
            current_node = node.name

            sheet.merge_range(
                "B1:C1",
                current_node.name,
                self.__align_center_format,
            )

            # Детали узла
            details_of_node = unit_details.objects.filter(
                belongs=current_node,
            )

            # Покупное оборудование узла
            equipments_of_node = unit_purchased.objects.filter(
                belongs=current_node,
            )

            # Подузлы узла
            sub_nodes_of_node = unit_under_the_node.objects.filter(
                belongs=current_node,
            )

            row = 2

            row = self.__write_table_on_sheet_for_node(
                sheet,
                row,
                details_of_node,
                "Деталь",
            )

            row = self.__write_table_on_sheet_for_node(
                sheet,
                row,
                equipments_of_node,
                "Покупное оборудование",
            )

            row = self.__write_table_on_sheet_for_node(
                sheet,
                row,
                sub_nodes_of_node,
                "Подузел",
            )

            sheet.autofit()

        sub_nodes = self.__query_sets_dict.get("Подузел", [])
        if len(sub_nodes) != 0:
            sub_nodes = sub_nodes[0]

        for sheet_number, sub_node in enumerate(sub_nodes, 1):
            # Лист для конкретного подузла
            sheet = self.__book.add_worksheet(f"Подузел_{sheet_number}")

            # Подузел
            current_sub_node = sub_node.name

            sheet.merge_range(
                "B1:C1",
                current_sub_node.name,
                self.__align_center_format,
            )

            # Детали подузла
            details_of_sub_node = utn_details.objects.filter(
                belongs=current_sub_node,
            )

            # Покупное оборудование подузла
            equipments_of_sub_node = utn_purchased.objects.filter(
                belongs=current_sub_node,
            )

            row = 2

            row = self.__write_table_on_sheet_for_node(
                sheet,
                row,
                details_of_sub_node,
                "Деталь",
            )

            row = self.__write_table_on_sheet_for_node(
                sheet,
                row,
                equipments_of_sub_node,
                "Покупное оборудование",
            )

            sheet.autofit()

    def __autofit_component_sheets(self) -> None:
        for model in self.__query_sets_dict.values():
            model[1].autofit()

    def __write_assembly_info(self, row: int) -> int:
        for title, model_query_set in self.__query_sets_dict.items():
            row = self.__create_table_header(
                self.__report_sheet, row, ["№", title, "шт."]
            )
            for i, model in enumerate(model_query_set[0], 1):
                row = self.__write_table_row(
                    self.__report_sheet, row, model, i
                )

            row += 2

        return row

    @staticmethod
    def __write_table_row(sheet: Any, row: int, model: Any, i: int) -> int:
        sheet.write(row, 0, i)
        sheet.write(row, 1, str(model.name).strip())
        sheet.write(row, 2, float(model.quantity))
        return row + 1

    def __write_table_on_sheet_for_node(
        self, sheet: Any, row: int, model_query_set: Any, table_for: str
    ) -> int:
        if not model_query_set.exists():
            return row
        row = self.__create_table_header(sheet, row, ["№", table_for, "шт."])
        for i, detail in enumerate(model_query_set, 1):
            row = self.__write_table_row(sheet, row, detail, i)
        return row + 2
