from typing import Any

from django.http import (
    HttpRequest,
    HttpResponse,
    HttpResponsePermanentRedirect,
    HttpResponseRedirect,
)
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView, UpdateView

from .forms import FileUploadForm, FuelCardCreateForm
from .models import FuelCard, ServiceParams
from .services import FuelCardsService


class FuelCardsList(ListView[FuelCard]):
    model = FuelCard
    template_name = "fuel_cards/fuel_cards_list.html"
    context_object_name = "fuel_cards"


def upload_file(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            FuelCardsService(form.cleaned_data["file"].file).update_db()
            return redirect("fuel_cards_list")
    else:
        form = FileUploadForm()
    return render(request, "fuel_cards/upload_info.html", {"form": form})


class FuelCardCreate(CreateView[FuelCard, FuelCardCreateForm]):
    model = FuelCard
    template_name = "fuel_cards/fuel_cards_create.html"
    form_class = FuelCardCreateForm
    success_url = reverse_lazy("fuel_cards_list")

    def get_context_data(self, **kwargs: Any) -> dict[Any, Any]:
        context = super().get_context_data(**kwargs)

        context["card_numbers"] = set(
            ServiceParams.objects.values_list("card_number", flat=True)
        )

        return context

    def form_valid(
        self, form: FuelCardCreateForm
    ) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
        card_number = self.request.POST.get("card_number")
        fuel_card = form.save(commit=False)
        services = ServiceParams.objects.filter(card_number=card_number)
        fuel_card.save()

        for service in services:
            fuel_card.services.add(service)

        return redirect("fuel_cards_list")


class FuelCardUpdate(UpdateView[FuelCard, FuelCardCreateForm]):
    model = FuelCard
    template_name = "fuel_cards/fuel_cards_update.html"
    context_object_name = "fuel_card"
    pk_url_kwarg = "fuel_card_id"
    form_class = FuelCardCreateForm
    success_url = reverse_lazy("fuel_cards_list")

    def get_context_data(self, **kwargs: Any) -> dict[Any, Any]:
        context = super().get_context_data(**kwargs)

        active_card_numbers = {
            fuel_card.services.first().card_number  # type: ignore
            for fuel_card in FuelCard.objects.prefetch_related("services")
            if fuel_card.services.all().exists()
        }

        context["card_numbers"] = set(
            ServiceParams.objects.exclude(
                card_number__in=active_card_numbers
            ).values_list("card_number", flat=True)
        )

        return context

    def form_valid(
        self, form: FuelCardCreateForm
    ) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
        card_number = self.request.POST.get("card_number")
        fuel_card = form.save(commit=False)
        fuel_card.services.all().delete()
        services = ServiceParams.objects.filter(card_number=card_number)
        fuel_card.save()

        for service in services:
            fuel_card.services.add(service)

        return redirect("fuel_cards_list")
