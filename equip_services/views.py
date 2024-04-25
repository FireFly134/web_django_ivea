from typing import Any

from django.contrib import messages
from django.http import (
    HttpRequest,
    HttpResponse,
    HttpResponsePermanentRedirect,
    HttpResponseRedirect,
)
from django.shortcuts import redirect, render
from django.views.generic import CreateView

from .forms import accounting_of_services_and_equipment_form
from .models import accounting_of_services_and_equipment
from .utils import update_see_id


def add_uslug_i_oborud(request: HttpRequest) -> HttpResponse:
    table = accounting_of_services_and_equipment.objects
    form = accounting_of_services_and_equipment_form()
    return add_one_value(request, table, form)


def add_one_value(
    request: HttpRequest, table: Any, form: Any, get_name: str = "name"
) -> HttpResponse:
    try:
        table_name = (
            str(form)
            .split('<label for="id_name">Наименование ')[1]
            .split(":</label></th>")[0]
        )
    except Exception:
        table_name = ""
    if request.method == "POST":
        if get_name == "name":
            name = request.POST.get("name")
            if table.filter(name=name).exists() is not True:
                fail = True
                сounter = 0
                while fail:
                    if сounter == 1000:
                        messages.error(
                            request,
                            "Ошибка записи, пожалуйста повторите позже!",
                        )
                        break
                    try:
                        table.create(name=name)
                        messages.success(request, "Запись успешно добавлена.")
                        fail = False
                    except Exception as err:
                        print(err)
                    сounter += 1
            else:
                messages.error(request, "Такая запись уже присутствует.")
        elif get_name == "description":
            if (
                table.filter(
                    description=request.POST.get("description")
                ).exists()
                is not True
            ):
                # print('description= ', request.POST.get('description'))
                # print('services= ', request.POST.getlist('services'))
                table.create(
                    description=request.POST.get("description"),
                    services=request.POST.getlist("services"),
                )
                messages.success(request, "Запись успешно добавлена.")
            else:
                messages.error(request, "Такая запись уже присутствует.")

    return render(
        request,
        "equip_services/add_one_value.html",
        context={
            "form": form,
            "table": table.filter(parent=None).order_by("id"),
            "table_name": table_name,
        },
    )


class SubServiceOrEquipmentUnitCreate(
    CreateView[
        accounting_of_services_and_equipment,
        accounting_of_services_and_equipment_form,
    ]
):
    model = accounting_of_services_and_equipment
    template_name = "equip_services/create_sub_unit.html"
    form_class = accounting_of_services_and_equipment_form
    pk_url_kwarg = "obj_id"
    success_url = reversed("aosae")  # type: Any

    def get_context_data(self, **kwargs: Any) -> dict[Any, Any]:
        context = super().get_context_data(**kwargs)
        parent = accounting_of_services_and_equipment.objects.get(
            pk=self.kwargs.get(self.pk_url_kwarg)
        )
        context["parent"] = parent
        return context

    def form_valid(
        self, form: accounting_of_services_and_equipment_form
    ) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
        sub_unit: accounting_of_services_and_equipment = form.save(
            commit=False
        )
        parent = accounting_of_services_and_equipment.objects.get(
            pk=self.kwargs.get(self.pk_url_kwarg)
        )
        sub_unit.parent = parent
        sub_unit.sub_level = parent.sub_level + 1
        sub_unit.save()

        update_see_id(
            accounting_of_services_and_equipment.objects.filter(parent=None)
        )
        return redirect("aosae")


def delete_sub(
    request: HttpRequest, sub_id: int
) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
    sub = accounting_of_services_and_equipment.objects.get(pk=sub_id)
    sub.delete()
    update_see_id(
        accounting_of_services_and_equipment.objects.filter(parent=None)
    )
    return redirect("aosae")
