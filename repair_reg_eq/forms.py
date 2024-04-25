from typing import Any

from django import forms

from .models import RepairEquipment


labels = {
    "counterparty": "Контрагент",
    "contract": "Договор",
    "equipment": "Оборудование",
    "serial_number": "Серийный номер",
    "breakdown_description": "Описание поломки",
    "employee": "Сотрудник, который сделал заключение",
    "conclusion_service_company": "Заключение сервисной компании",
    "sending_date": "Дата отправки оборудования на диагностику",
    "acceptance_date": "Дата приёмки отремонтированного оборудования",
}
widgets = {
    "counterparty": forms.Select(),
    "contract": forms.Select(),
    "equipment": forms.Select(),
    "breakdown_description": forms.Textarea(),
    "employee": forms.Select(),
    "conclusion_service_company": forms.Textarea(),
    "sending_date": forms.DateInput(format="%Y-%m-%d", attrs={"type": "date"}),
    "acceptance_date": forms.DateInput(
        format="%Y-%m-%d", attrs={"type": "date"}
    ),
}

select_fields = [
    "counterparty",
    "contract",
    "equipment",
    "employee",
]


class RepairEquipmentCreateForm(forms.ModelForm[RepairEquipment]):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control"
        for field in select_fields:
            self.fields[field].widget.attrs["class"] = "form-control select2"

    class Meta:
        model = RepairEquipment
        fields = labels.keys()
        labels = labels
        widgets = widgets
