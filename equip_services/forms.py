from django import forms

from .models import accounting_of_services_and_equipment


class accounting_of_services_and_equipment_form(
    forms.ModelForm[accounting_of_services_and_equipment]
):
    name = forms.CharField(
        label="Наименование услуг или оборудования",
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )

    class Meta:
        model = accounting_of_services_and_equipment
        fields = ("name",)
