from typing import Any

from django.db.models.query import QuerySet
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.views.generic import ListView

from .models import Invoice
from .services import InvoiceCompiler


def invoice_analysis(request: HttpRequest) -> HttpResponse:
    compiler = InvoiceCompiler()
    compiler.data_processing()

    context: dict[str, Any] = {
        "invoices": compiler.invoices,
        "headers": compiler.required_columns,
        "bad_invoices_count": Invoice.objects.filter(
            counterparty=None
        ).count(),
    }

    if request.GET.get("counterparty_inn", None):
        context["init_search"] = request.GET.get("counterparty_inn", "")

    return render(
        request,
        template_name="invoice_analysis/invoices_list.html",
        context=context,
    )


class InvoicesWithoutCounterpartiesList(ListView[Invoice]):
    model = Invoice
    template_name = "invoice_analysis/invoices_without_counterparties.html"
    context_object_name = "invoices"

    def get_queryset(self) -> QuerySet[Any]:
        return Invoice.objects.filter(counterparty=None)
