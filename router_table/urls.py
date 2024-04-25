from django.contrib.auth.decorators import login_required
from django.urls import path

from .views import (
    PurchasedEquipmentCreate,
    PurchasedEquipmentList,
    RouterCreate,
    RouterDetail,
    RouterList,
    RouterUpdate,
    SimCardDetail,
    SimCardList,
    delete_router,
    upload__files,
)

urlpatterns = [
    path("", login_required(RouterList.as_view()), name="router_list"),
    path(
        "<int:router_id>/",
        login_required(RouterDetail.as_view()),
        name="router_page",
    ),
    path("create/", RouterCreate.as_view(), name="router_create"),
    path(
        "edit/<int:router_id>/",
        login_required(RouterUpdate.as_view()),
        name="router_update",
    ),
    path("delete/<int:router_id>/", delete_router, name="router_delete"),
    path(
        "sim/<int:sim_id>/",
        login_required(SimCardDetail.as_view()),
        name="sim_detail",
    ),
    path(
        "sim/",
        login_required(SimCardList.as_view()),
        name="sim_list",
    ),
    path(
        "create_purchased_equipment/",
        login_required(PurchasedEquipmentCreate.as_view()),
        name="create_equipment",
    ),
    path(
        "purchased_equipment/",
        login_required(PurchasedEquipmentList.as_view()),
        name="equipment_list",
    ),
    path(
        "upload_accrual_reports_file/",
        upload__files,
        name="upload_accrual",
    ),
]
