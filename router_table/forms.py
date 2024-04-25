from typing import Any

from django import forms

from main.models import (
    accounting_for_purchased_equipment as PurchasedEquipment,
)

from .models import Router


class CreatePurchasedEquipmentForm(forms.ModelForm[PurchasedEquipment]):
    class Meta:
        model = PurchasedEquipment
        fields = ("name",)
        labels = {
            "name": "Наименование покупного оборудования",
        }
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control"}),
        }


router_labels_dict = {
    "router_user_id": "ID",
    "router": "Роутер",
    "contract": "Договор",
    "sim": "СИМ",
    "note": "Примечание",
    "antenna": "Антенна",
    "station": "Станция",
    "ip_static": "IP статика",
}

router_widgets_dict = {
    "router_user_id": forms.NumberInput(),
    "router": forms.Select(),
    "contract": forms.Select(),
    "antenna": forms.Select(),
    "station": forms.Select(),
    "sim": forms.Select(),
    "note": forms.Textarea(),
}

select_fields = [
    "router",
    "contract",
    "antenna",
    "station",
    "sim",
]


class CreateRouterForm(forms.ModelForm[Router]):
    def __init__(self, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control"
        for field in select_fields:
            self.fields[field].widget.attrs["class"] = "form-control select2"

    class Meta:
        model = Router
        fields = router_labels_dict.keys()
        labels = router_labels_dict
        widgets = router_widgets_dict


class FileUploadForm(forms.Form):
    report_file = forms.FileField(required=False)
    sim_list_file = forms.FileField(required=False)
