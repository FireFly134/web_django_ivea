from django.urls import path

from .views import overhead, upload_bank_statement

urlpatterns = [
    path("", overhead, name="overhead_costs"),
    path(
        "upload_bank_statement/",
        upload_bank_statement,
        name="upload_bank_statement",
    ),
]
