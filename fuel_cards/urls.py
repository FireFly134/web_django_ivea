from django.urls import path

from .views import FuelCardCreate, FuelCardUpdate, FuelCardsList, upload_file

urlpatterns = [
    path("", FuelCardsList.as_view(), name="fuel_cards_list"),
    path("create/", FuelCardCreate.as_view(), name="fuel_cards_create"),
    path(
        "update/<int:fuel_card_id>",
        FuelCardUpdate.as_view(),
        name="fuel_cards_update",
    ),
    path("upload/", upload_file, name="upload_fuel_card_info"),
]
