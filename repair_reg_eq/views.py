from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView, UpdateView

from .forms import RepairEquipmentCreateForm
from .models import RepairEquipment


class RepairEquipmentList(ListView[RepairEquipment]):
    model = RepairEquipment
    template_name = "repair_reg_eq/repair_equipment_list.html"
    context_object_name = "rep_equips"


class RepairEquipmentCreate(
    CreateView[RepairEquipment, RepairEquipmentCreateForm]
):
    model = RepairEquipment
    template_name = "repair_reg_eq/repair_equipment_create.html"
    form_class = RepairEquipmentCreateForm
    success_url = reverse_lazy("req_eq_list")


class RepairEquipmentUpdate(
    UpdateView[RepairEquipment, RepairEquipmentCreateForm]
):
    model = RepairEquipment
    template_name = "repair_reg_eq/repair_equipment_update.html"
    pk_url_kwarg = "rep_eq_id"
    form_class = RepairEquipmentCreateForm
    success_url = reverse_lazy("req_eq_list")
