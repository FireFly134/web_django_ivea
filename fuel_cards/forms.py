from django import forms

from .models import FuelCard


labels = {
    "employee": "Сотрудник",
}

widgets_dict = {
    "employee": forms.Select(attrs={"class": "form-control select2"}),
    "card_number": forms.NumberInput(attrs={"class": "form-control"}),
}


class FuelCardCreateForm(forms.ModelForm[FuelCard]):
    class Meta:
        model = FuelCard
        fields = labels.keys()
        labels = labels
        widgets = widgets_dict


class FileUploadForm(forms.Form):
    file = forms.FileField()
