from django.contrib.auth.decorators import login_required
from django.urls import path

from .views import ReportCreate, ReportList, ReportUpdate, delete_report

urlpatterns = [
    path("", login_required(ReportList.as_view()), name="report_list"),
    path(
        "create/", login_required(ReportCreate.as_view()), name="report_create"
    ),
    path(
        "edit/<int:report_id>",
        login_required(ReportUpdate.as_view()),
        name="report_edit",
    ),
    path("delete/<int:report_id>", delete_report, name="report_delete"),
]
