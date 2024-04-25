from django.urls import path

from .views import InvoicesWithoutCounterpartiesList, invoice_analysis

urlpatterns = [
    path("", invoice_analysis, name="invoice_analysis"),
    path(
        "not_matched/",
        InvoicesWithoutCounterpartiesList.as_view(),
        name="invoices_without_counterpaties",
    ),
]
