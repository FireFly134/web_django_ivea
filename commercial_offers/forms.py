from typing import Any

from django import forms

from .models import ContactInformation, ContactInformationToServicesEquipment

labels_dict: dict[str, str] = {
    "fio": "ФИО",
    "tel": "Номер телефона",
    "organization": "Название организации",
    "mail": "Почта",
}
labels_dict2: dict[str, str] = {
    "contact_information": "Потенциальные покупатели",
    "services_equipment": "Наименование услуг и оборудования",
    "work_name": "Наименование работ",
    "unit_of_measurement": "Ед. изм.",
    "cost_with_vat": "Стоимость, руб с НДС 20%",
    "npp": "№",
}


class ContactInformationForm(forms.ModelForm[ContactInformation]):
    fio = forms.CharField(
        label="ФИО",
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )
    tel = forms.CharField(
        label="Номер телефона",
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )
    organization = forms.CharField(
        label="Название организации",
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )
    mail = forms.CharField(
        label="Почта",
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )

    class Meta:
        model = ContactInformation
        fields = (
            "fio",
            "organization",
        )


class CreateContactInformationForm(forms.ModelForm[ContactInformation]):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        for field in self.visible_fields():
            if "class" not in field.field.widget.attrs:
                field.field.widget.attrs["class"] = "form-control"
                field.field.required = False

    class Meta:
        model = ContactInformation
        fields = labels_dict.keys()
        labels = labels_dict


class UpdateContactInformationForm(CreateContactInformationForm):
    pass


class ContactInformationToServicesEquipmentForm(
    forms.ModelForm[ContactInformationToServicesEquipment]
):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        for field in self.visible_fields():
            if "class" not in field.field.widget.attrs:
                field.field.widget.attrs["class"] = "form-control select2"

    class Meta:
        model = ContactInformationToServicesEquipment
        fields = labels_dict2.keys()
        labels = labels_dict2
        widgets = {
            "work_name": forms.Textarea(
                attrs={"class": "form-control", "style": "height: 133px;"}
            )
        }


class UpdateContactInformationToServicesEquipmentForm(
    ContactInformationToServicesEquipmentForm
):
    pass
