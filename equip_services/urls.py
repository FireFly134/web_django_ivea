from django.urls import path

from .views import (
    SubServiceOrEquipmentUnitCreate,
    add_uslug_i_oborud,
    delete_sub,
)


urlpatterns = [
    path("", add_uslug_i_oborud, name="aosae"),
    path(
        "create_sub/<int:obj_id>/",
        SubServiceOrEquipmentUnitCreate.as_view(),
        name="create_sub",
    ),
    path("delete_sub/<int:sub_id>/", delete_sub, name="delete_sub"),
]
