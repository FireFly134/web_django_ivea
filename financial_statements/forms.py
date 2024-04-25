from typing import Any

from django import forms

from .models import Report


labels_dict = {
    "title": "Наименование",
    "checkbox": "Чек",
    "note": "Примечание",
    "total": "Сумма",
    "mileage": "Пробег (км.)",
    "date": "Дата",
}

widgets_dict = {
    "checkbox": forms.CheckboxInput(),
    "note": forms.Textarea(),
    "total": forms.NumberInput(),
    "mileage": forms.NumberInput(),
    "date": forms.DateInput(format="%Y-%m-%d", attrs={"type": "date"}),
}


class ReportCreateForm(forms.ModelForm[Report]):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        for field in self.visible_fields():
            field.field.widget.attrs["class"] = "form-control"

        self.fields["checkbox"].widget.attrs["class"] = "form-check-input"

    class Meta:
        model = Report
        fields = labels_dict.keys()
        labels = labels_dict
        widgets = widgets_dict


class ReportUpdateForm(ReportCreateForm):
    pass
