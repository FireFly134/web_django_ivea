from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.http import (
    HttpRequest,
    HttpResponsePermanentRedirect,
    HttpResponseRedirect,
)
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView, UpdateView

from django_stubs_ext import QuerySetAny

from .forms import ReportCreateForm, ReportUpdateForm
from .mixins import ReportOwnerRequiredMixin
from .models import Report


class ReportCreate(CreateView[Report, ReportCreateForm]):
    model = Report
    form_class = ReportCreateForm
    template_name = "financial_statements/report_create.html"
    success_url = reverse_lazy("report_list")

    def form_valid(
        self, form: ReportCreateForm
    ) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
        report = form.save(commit=False)
        report.user = User.objects.get(pk=self.request.user.pk)  # type: ignore
        report.save()

        return redirect("report_list")


class ReportUpdate(
    ReportOwnerRequiredMixin, UpdateView[Report, ReportUpdateForm]
):
    model = Report
    form_class = ReportUpdateForm
    template_name = "financial_statements/report_edit.html"
    pk_url_kwarg = "report_id"
    success_url = reverse_lazy("report_list")


@login_required
def delete_report(
    request: HttpRequest, report_id: int
) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
    report = Report.objects.get(pk=report_id)
    user = request.user
    if report.user.pk == user.pk or request.user.is_superuser:  # type: ignore
        report.delete()
        return redirect("report_list")
    raise PermissionDenied()


class ReportList(ListView[Report]):
    model = Report
    template_name = "financial_statements/report_list.html"
    context_object_name = "reports"

    def get_queryset(self) -> QuerySetAny[Report, Report]:
        user = self.request.user

        if user.is_anonymous:
            raise PermissionDenied()

        if user.is_superuser:
            return Report.objects.all()

        return Report.objects.filter(user=user.pk)
