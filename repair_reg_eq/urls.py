from django.urls import path

from .views import (
    RepairEquipmentCreate,
    RepairEquipmentList,
    RepairEquipmentUpdate,
)


urlpatterns = [
    path("", RepairEquipmentList.as_view(), name="req_eq_list"),
    path("create/", RepairEquipmentCreate.as_view(), name="req_eq_create"),
    path(
        "update/<int:rep_eq_id>/",
        RepairEquipmentUpdate.as_view(),
        name="req_eq_update",
    ),
]
