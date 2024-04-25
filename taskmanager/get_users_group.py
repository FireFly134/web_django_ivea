from typing import Any

from django.http import HttpRequest
from django.urls import reverse


class get_link:
    def __init__(self, user_groups: Any) -> None:
        self.links_base = ""
        self.links_index = ""
        self.user_groups = user_groups

    def add_url(self, dict: dict[Any, Any]) -> None:
        empty = True
        for name, url in dict.items():
            if name in self.user_groups:
                empty = False
                url = reverse(
                    url
                )  # Генерируем URL на основе имени представления
                self.links_base += f"""<li>
                                    <a class="item" href="{url}">{name}</a>
                                </li>"""
                self.links_index += f'<a href="{url}">{name}</a><br /><br />'
        if not empty:
            self.links_index += "<br /><br />"

    def add_group_url(self, dict: dict[Any, Any], group_name: str) -> None:
        ferst = True
        for name, url in dict.items():
            if name in self.user_groups:
                if name in "Список договоров (с ограничениями)":
                    name = "Список договоров"
                if ferst:
                    self.links_base += f"""<li>
                    <a \
                    class="item" \
                    href="javascript:void(0);">{group_name} &rarr;\
                    <span class="border-fixer"></span></a>
                    <div class="dropdown flyout columns-1 "\
                        style="width:220px;">
                        <div class="column col1" style="width:220px;">
                            <ul class="l3">
                    """
                    if group_name != "Документы":
                        self.links_index += f"<p>{group_name}:</p>"
                    ferst = False
                url = reverse(
                    url
                )  # Генерируем URL на основе имени представления
                if (
                    "Счета на согласовании" in self.user_groups
                    and "Работы и суммы в перспективе" in self.user_groups
                    and (
                        name == "Счета на согласовании"
                        or name == "Работы и суммы в перспективе"
                    )
                ):
                    if name == "Работы и суммы в перспективе":
                        self.links_index += f'<a\
                            href="{reverse("invoices_under_approval")}">Счета \
                            на согласовании\
                            </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp<a \
                            href=\
                            "{reverse("jobs_and_amounts")}">\
                            Работы и суммы в перспективе</a><br /><br />'
                else:
                    if "Добавить новый договор" != name:
                        self.links_index += (
                            f'<a href="{url}">{name}</a><br /><br />'
                        )
                self.links_base += f"""<li>
                                    <a class="item" href="{url}">{name}</a>
                                </li>"""
        if not ferst:
            self.links_base += """</ul>
                            </div>
                        </div>
                    </li>"""
            self.links_index += "<br /><br />"


def check_group(request: HttpRequest) -> dict[str, Any]:
    user = request.user
    user_groups = user.groups.values_list("name", flat=True)  # type: ignore
    links = get_link(user_groups)

    # documents_dict_nameURL_and_URL = {
    #     "Добавить новый договор": "new_doc",
    #     "Список договоров": "list_doc",
    #     "Список договоров (с ограничениями)": "list_doc_limitation",
    #     "Список не согласованных счетов в оплату": "not_an_agreed_doc",
    #     "Счета на согласовании": "invoices_under_approval",
    #     "Работы и суммы в перспективе": "jobs_and_amounts",
    # }
    financial_dict_nameURL_and_URL = {
        "Накладные расходы": "overhead_costs",
        "Структура расходов": "invoice_analysis",
        "Финансовые отчеты": "report_list",
        "Топливные карты": "fuel_cards_list",
        "Файловое хранилище": "file_storage_main",
        "Cписок потенциальных заказчиков": "list_co",
        "Cписок коммерческих предложений": "list_coase",
    }
    engineer_dict_nameURL_and_URL = {
        "Проектное оборудование": "project_equipment_list",
        "Добавление покупного оборудования": "afpe",
        "Добавление услуг или оборудования": "aosae",
        "Добавление деталей": "details",
        "Добавление и изменение параметров подузла": "utn",
        "Добавление и изменение параметров узла": "unit",
        "Добавление и изменение параметров сборочной единицы": "assembly_unit",
        "Добавление и изменение параметров объектной сборки": "object_assembly",  # noqa
    }

    # links.add_group_url(documents_dict_nameURL_and_URL, "Документы")
    links.add_group_url(financial_dict_nameURL_and_URL, "Финансовые")
    links.add_group_url(engineer_dict_nameURL_and_URL, "Инженерные")

    return {
        "user_groups": user_groups,
        "links_base": links.links_base,
        "links_index": links.links_index,
    }
