from django.urls import path

from .views import (
    CounterpartyAliasesCreate,
    CounterpartyCreate,
    CounterpartyDetail,
    CounterpartyList,
    CounterpartyUpdate,
    EmployeeCreate,
    EmployeeList,
    EmployeeUpdate,
    counterparty_report,
    delete_employee,
)

urlpatterns = [
    path("", EmployeeList.as_view(), name="employee_list"),
    path("<int:employee_id>/", EmployeeUpdate.as_view(), name="card_edit"),
    path("create/", EmployeeCreate.as_view(), name="card_create"),
    path("delete/<int:employee_id>/", delete_employee, name="card_delete"),
    path("list/", CounterpartyList.as_view(), name="counterparty_list"),
    path(
        "list/create/",
        CounterpartyCreate.as_view(),
        name="counterparty_create",
    ),
    path(
        "list/<int:counterparty_id>/",
        CounterpartyDetail.as_view(),
        name="counterparty_detail",
    ),
    path(
        "list/update/<int:counterparty_id>/",
        CounterpartyUpdate.as_view(),
        name="counterparty_update",
    ),
    path(
        "download_report/",
        counterparty_report,
        name="counterparty_report",
    ),
    path(
        "alias/create/",
        CounterpartyAliasesCreate.as_view(),
        name="alias_create",
    ),
]
