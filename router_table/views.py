from typing import Any

from django.contrib.auth.decorators import login_required
from django.http import (
    HttpRequest,
    HttpResponse,
    HttpResponsePermanentRedirect,
    HttpResponseRedirect,
)
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views.generic import CreateView, DetailView, ListView, UpdateView

from main.models import (
    accounting_for_purchased_equipment as PurchasedEquipment,
)

from .forms import (
    CreatePurchasedEquipmentForm,
    CreateRouterForm,
    FileUploadForm,
)
from .models import AccrualReport, Router, SimCard
from .utils import (
    update_accrual_reports,
    update_sim_db,
    update_total_for_router,
)


class PurchasedEquipmentList(ListView[PurchasedEquipment]):
    model = PurchasedEquipment
    context_object_name = "equipments"
    template_name = "router_table/purchased_equipment_list.html"


class PurchasedEquipmentCreate(
    CreateView[PurchasedEquipment, CreatePurchasedEquipmentForm]
):
    model = PurchasedEquipment
    form_class = CreatePurchasedEquipmentForm
    template_name = "router_table/purchased_equipment_create.html"
    success_url = reverse_lazy("equipment_list")


class RouterList(ListView[Router]):
    model = Router
    template_name = "router_table/router_list.html"
    context_object_name = "routers"


class RouterDetail(DetailView[Router]):
    model = Router
    template_name = "router_table/router_page.html"
    context_object_name = "router"
    pk_url_kwarg = "router_id"


class RouterCreate(CreateView[Router, CreateRouterForm]):
    model = Router
    template_name = "router_table/router_create.html"
    form_class = CreateRouterForm
    success_url = reverse_lazy("router_list")

    def form_valid(
        self, form: CreateRouterForm
    ) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
        router = form.save(commit=False)
        update_total_for_router(router)
        return redirect("router_list")


class RouterUpdate(UpdateView[Router, CreateRouterForm]):
    model = Router
    template_name = "router_table/router_update.html"
    success_url = reverse_lazy("router_list")
    form_class = CreateRouterForm
    pk_url_kwarg = "router_id"


@login_required
def delete_router(
    request: HttpRequest, router_id: int
) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
    router = Router.objects.filter(id=router_id)
    router.delete()
    return redirect("router_list")


@login_required
def upload__files(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            report_file = form.cleaned_data["report_file"]
            sim_list_file = form.cleaned_data["sim_list_file"]

            if hasattr(report_file, "file"):
                update_accrual_reports(report_file.file)
            if hasattr(sim_list_file, "file"):
                update_sim_db(sim_list_file.file)

            return redirect("router_list")
    else:
        form = FileUploadForm()
    return render(
        request, "router_table/upload_accrual_report_info.html", {"form": form}
    )


class SimCardDetail(DetailView[SimCard]):
    model = SimCard
    template_name = "sim_card/sim_detail.html"
    pk_url_kwarg = "sim_id"
    context_object_name = "sim"

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["reports"] = AccrualReport.objects.filter(
            phone_number=context["sim"].phone_number
        )
        context["sum"] = round(
            sum([report.total for report in context["reports"]]), 2
        )
        return context


class SimCardList(ListView[SimCard]):
    model = SimCard
    template_name = "sim_card/sim_list.html"
    context_object_name = "sim_cards"

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["reports"] = AccrualReport.objects.all()
        return context
