from typing import Any

from django.http import (
    FileResponse,
    HttpRequest,
    HttpResponse,
    HttpResponsePermanentRedirect,
    HttpResponseRedirect,
)
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView, DetailView, ListView, UpdateView

from invoice_analysis.models import Invoice

from .forms import (
    CounterpartyAliasCreateForm,
    CounterpartyCreateForm,
    EmployeeCreateForm,
    EmployeeUpdateForm,
)
from .models import Counterparty, CounterpartyAliases, Employee
from .services import (
    CounterpartiesWordIntegrationService,
    CounterpartyDetailService,
)


class CounterpartyList(ListView[Counterparty]):
    model = Counterparty
    template_name = "counterparties/counterparty_list.html"
    context_object_name = "counterparties"


class CounterpartyCreate(CreateView[Counterparty, CounterpartyCreateForm]):
    model = Counterparty
    template_name = "counterparties/counterparty_create.html"
    form_class = CounterpartyCreateForm

    def form_valid(
        self,
        form: CounterpartyCreateForm,
    ) -> HttpResponse:
        counterparty = form.save()

        Invoice.objects.filter(alias=counterparty.title).update(
            counterparty=counterparty
        )
        return redirect("counterparty_list")


class CounterpartyDetail(DetailView[Counterparty]):
    model = Counterparty
    template_name = "counterparties/counterparty_detail.html"
    context_object_name = "counterparty"
    pk_url_kwarg = "counterparty_id"

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context[
            "counterparty_info"
        ] = CounterpartyDetailService.get_context_by_name(
            context["counterparty"].title
        )
        return context


class CounterpartyUpdate(UpdateView[Counterparty, CounterpartyCreateForm]):
    model = Counterparty
    template_name = "counterparties/counterparty_update.html"
    context_object_name = "counterparty"
    pk_url_kwarg = "counterparty_id"
    form_class = CounterpartyCreateForm


def counterparty_report(request: HttpRequest) -> FileResponse:
    file_stream = CounterpartiesWordIntegrationService().save_report()
    return FileResponse(
        file_stream, as_attachment=True, filename="Список контрагентов.docx"
    )


class CounterpartyAliasesCreate(
    CreateView[CounterpartyAliases, CounterpartyAliasCreateForm]
):
    model = CounterpartyAliases
    template_name = "counterparties/alias_create.html"
    form_class = CounterpartyAliasCreateForm

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)

        if self.request.GET.get("alias", None):
            context["init_alias"] = self.request.GET.get("alias", "")

        return context

    def form_valid(
        self,
        form: CounterpartyAliasCreateForm,
    ) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
        alias = form.save()

        Invoice.objects.filter(alias=alias.alias).update(
            counterparty=alias.counterparty
        )

        return redirect("counterparty_list")


class EmployeeList(ListView[Employee]):
    model = Employee
    template_name = "employee_cards/list.html"
    context_object_name = "employee_list"


class EmployeeUpdate(UpdateView[Employee, EmployeeUpdateForm]):
    model = Employee
    form_class = EmployeeUpdateForm
    pk_url_kwarg = "employee_id"
    template_name = "employee_cards/update.html"
    success_url = reverse_lazy("employee_list")
    context_object_name = "employee"


class EmployeeCreate(CreateView[Employee, EmployeeCreateForm]):
    model = Employee
    form_class = EmployeeCreateForm
    template_name = "employee_cards/create.html"
    success_url = reverse_lazy("employee_list")


def delete_employee(
    request: HttpRequest, employee_id: int
) -> HttpResponsePermanentRedirect | HttpResponseRedirect:
    employee = Employee.objects.filter(id=employee_id)
    employee.delete()
    return redirect("employee_list")
