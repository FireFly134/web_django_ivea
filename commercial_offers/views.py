from typing import Any, Dict

from django.contrib.auth.decorators import login_required
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

from equip_services.models import (
    accounting_of_services_and_equipment as ServicesEquipment,
)


from .forms import (
    ContactInformationToServicesEquipmentForm,
    CreateContactInformationForm,
    UpdateContactInformationForm,
    UpdateContactInformationToServicesEquipmentForm,
)
from .models import ContactInformation, ContactInformationToServicesEquipment


class CommercialOffersList(ListView[ContactInformation]):
    model = ContactInformation
    template_name = "commercial_offers/list_co.html"
    context_object_name = "list"

    def get_queryset(
        self,
    ) -> QuerySetAny[ContactInformation, ContactInformation]:
        return ContactInformation.objects.all()


class CommercialOffersUpdate(
    UpdateView[ContactInformation, UpdateContactInformationForm],
):
    model = ContactInformation
    form_class = UpdateContactInformationForm
    template_name = "commercial_offers/edit_co.html"
    pk_url_kwarg = "info_id"
    context_object_name = "info"
    success_url = reverse_lazy("list_co")


@login_required
def delete_contact(
    request: HttpRequest, info_id: int
) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
    info = ContactInformation.objects.get(pk=info_id)
    if request.user.is_superuser:
        info.delete()
        return redirect("list_co")
    raise PermissionDenied()


class CommercialOffersCreate(
    CreateView[ContactInformation, CreateContactInformationForm]
):
    model = ContactInformation
    form_class = CreateContactInformationForm
    template_name = "commercial_offers/create_co.html"
    success_url = reverse_lazy("create_co")

    def form_valid(
        self,
        form: CreateContactInformationForm,
    ) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
        report = form.save(commit=False)
        report.save()

        return redirect("list_co")


class ListCommercialOffersAndServicesEquipment(
    ListView[ContactInformationToServicesEquipment]
):
    model = ContactInformationToServicesEquipment
    template_name = "commercial_offers/list_coase.html"
    context_object_name = "list"

    def get_queryset(
        self,
    ) -> QuerySetAny[
        ContactInformationToServicesEquipment,
        ContactInformationToServicesEquipment,
    ]:
        return ContactInformationToServicesEquipment.objects.all().order_by(
            "npp"
        )


class UpdateCommercialOffersAndServicesEquipment(
    UpdateView[
        ContactInformationToServicesEquipment,
        UpdateContactInformationToServicesEquipmentForm,
    ],
):
    model = ContactInformationToServicesEquipment
    form_class = UpdateContactInformationToServicesEquipmentForm
    template_name = "commercial_offers/edit_coase.html"
    pk_url_kwarg = "info_id"
    context_object_name = "info"
    success_url = reverse_lazy("list_coase")

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        # Фильтруем объекты по указанному contact_information
        obj = ContactInformationToServicesEquipment.objects.filter(
            contact_information=context["info"].contact_information,
            id=context["info"].id,
        )
        # отправляем список услуг
        context["list"] = ServicesEquipment.objects.all()
        # Получаем список id связанных services_equipment и отправляем его
        context["selected_value"] = obj.values_list(
            "services_equipment__id", flat=True
        )

        return context


@login_required
def delete_coase(
    request: HttpRequest, info_id: int
) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
    info = ContactInformationToServicesEquipment.objects.get(pk=info_id)
    if request.user.is_superuser:
        info.delete()
        return redirect("list_coase")
    raise PermissionDenied()


class CreateCommercialOffersAndServicesEquipment(
    CreateView[
        ContactInformationToServicesEquipment,
        ContactInformationToServicesEquipmentForm,
    ]
):
    model = ContactInformationToServicesEquipment
    form_class = ContactInformationToServicesEquipmentForm
    template_name = "commercial_offers/create_coase.html"
    success_url = reverse_lazy("list_coase")

    def form_valid(
        self,
        form: ContactInformationToServicesEquipmentForm,
    ) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
        report = form.save(commit=False)
        report.save()
        form.save_m2m()
        return redirect("list_coase")

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["list"] = ServicesEquipment.objects.all()
        return context
