import re
from typing import Any

from invoice_analysis.models import ContractInvoice, Invoice

from overhead_costs.models import BankState


class InvoiceCompiler:
    __regex: re.Pattern[str] = re.compile(r"\d+")
    __invoices: list[Any]

    __doc_nums: set[Any]

    required_columns: list[str] = [
        "Дата",
        "Контрагент",
        "ID",
        "Номенклатура",
        "Кол",
        "Ед.изм.",
        "Цена",
        "Сумма",
        "НДС",
        "Всего",
    ]

    __trigger_words: list[str] = [
        "комиссия",
        "единый налоговый платеж",
        "заработная плата",
        "возврат",
        "заработной",
        "взносы",
        "алиментов",
        "членские взносы",
        "абонентская",
    ]

    @property
    def invoices(self) -> list[Any]:
        return self.__invoices

    def data_processing(self) -> None:
        self.__invoices: list[Any] = list()
        self.__add_overhead_costs()

        contract_invoices = ContractInvoice.objects.all().exclude(
            invoice__info="Удален"
        )

        for invoice in contract_invoices:
            doc_num = invoice.invoice.incoming_document_number

            counterparty_inn = ""
            if invoice.invoice.counterparty:
                counterparty_inn = invoice.invoice.counterparty.inn

            self.__invoices.append(
                {
                    "id": invoice.contract_id,
                    "Дата": invoice.invoice.date,
                    "Контрагент": invoice.invoice.counterparty,
                    "Номенклатура": invoice.invoice.nomenclature,
                    "Количество": invoice.amount,
                    "Номенклатура_Единица": invoice.invoice.unit,
                    "Цена": invoice.invoice.price,
                    "Сумма": invoice.second_sum,
                    "НДС": invoice.vat,
                    "Всего": invoice.total,
                    "Номер_входящего_документа": doc_num,
                    "Алиас": invoice.invoice.alias,
                    "ИНН": counterparty_inn,
                }
            )

    def __add_overhead_costs(self) -> None:
        self.__processing_overhead()
        self.processing_bank_state()
        self.__concat_invoices()

    def __processing_overhead(self) -> None:
        invoices_list: list[Any] = []
        doc_nums: set[Any] = set()

        for invoice in Invoice.objects.all().exclude(info="Удален"):
            doc_num = invoice.incoming_document_number

            doc_nums.add(doc_num)

            comment = invoice.comment

            if not comment:
                comment = ""

            if re.findall(self.__regex, comment):
                continue

            counterparty_inn = ""
            if invoice.counterparty:
                counterparty_inn = invoice.counterparty.inn

            invoices_list.append(
                {
                    "Дата": invoice.date,
                    "Контрагент": invoice.counterparty,
                    "Номенклатура": invoice.nomenclature,
                    "Количество": invoice.amount,
                    "Номенклатура_Единица": invoice.unit,
                    "Цена": invoice.price,
                    "Сумма": invoice.second_sum,
                    "НДС": invoice.vat,
                    "Всего": invoice.total,
                    "Номер_входящего_документа": doc_num,
                    "Алиас": invoice.alias,
                    "ИНН": counterparty_inn,
                }
            )

        self.__overhead_invoices_list: list[Any] = invoices_list
        self.__doc_nums: set[Any] = doc_nums

    def processing_bank_state(self) -> None:
        invoices_list: list[Any] = []

        banskstate_list = BankState.objects.exclude(debiting_sum=None)

        for row in banskstate_list:
            continue_flag: bool = False
            continue_flag_2: bool = False

            for word in self.__trigger_words:
                if "возврат" in row.appointment.lower():
                    continue
                if word.lower() in str(row.appointment).lower():
                    self.__add_row_to_invoices_list(invoices_list, row)
                    continue_flag = True
                    break

            if continue_flag:
                continue

            if "оплата" in row.appointment.lower():
                for num in self.__doc_nums:
                    if len(num.split()) > 1:
                        if num in row.appointment:
                            continue_flag_2 = True
                            break
                    for element in row.appointment.split():
                        if len(element) == len(num) and element == num:
                            continue_flag_2 = True
                            break
                        if (
                            len(element) == len(num) + 1
                            and element == f"№{num}"
                        ):
                            continue_flag_2 = True
                            break
            else:
                continue_flag_2 = True

            if continue_flag_2:
                continue

            self.__add_row_to_invoices_list(invoices_list, row)

        for invoice in invoices_list:
            invoice.pop("id")

        self.__overhead_bank_state_list: list[Any] = invoices_list

    def __concat_invoices(self) -> None:
        all_invoices = []
        all_invoices.extend(self.__overhead_invoices_list)
        all_invoices.extend(self.__overhead_bank_state_list)
        all_invoices = sorted(
            all_invoices, key=lambda x: x["Всего"], reverse=True
        )

        self.__invoices.extend(all_invoices)

    @staticmethod
    def __add_row_to_invoices_list(
        invoice_list: list[Any], row: BankState
    ) -> None:
        final_dict: dict[Any, Any] = {
            **row.to_dict(),
            **{
                "Количество": 1,
                "Номенклатура_Единица": "шт",
                "НДС": "",
                "Сумма": "",
            },
        }
        final_dict = {**final_dict, **{"Цена": final_dict["Всего"]}}

        invoice_list.append(final_dict)
