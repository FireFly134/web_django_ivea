from django.contrib.auth.decorators import login_required
from django.urls import path

from . import views

urlpatterns = [
    path(
        "",
        login_required(views.CommercialOffersList.as_view()),
        name="list_co",
    ),
    path(
        "create/",
        login_required(views.CommercialOffersCreate.as_view()),
        name="create_co",
    ),
    path(
        "edit/<int:info_id>",
        login_required(views.CommercialOffersUpdate.as_view()),
        name="edit_co",
    ),
    path("delete/<int:info_id>", views.delete_contact, name="delete_co"),
    path(
        "list_coase",
        login_required(
            views.ListCommercialOffersAndServicesEquipment.as_view()
        ),
        name="list_coase",
    ),
    path(
        "create_coase/",
        login_required(
            views.CreateCommercialOffersAndServicesEquipment.as_view()
        ),
        name="create_coase",
    ),
    path(
        "edit_coase/<int:info_id>",
        login_required(
            views.UpdateCommercialOffersAndServicesEquipment.as_view()
        ),
        name="edit_coase",
    ),
    path(
        "delete_coase/<int:info_id>", views.delete_coase, name="delete_coase"
    ),
]
