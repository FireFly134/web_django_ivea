from typing import Any

from django import forms

from .models import Counterparty, CounterpartyAliases, Employee


employee_labels_dict = {
    "name": "Имя",
    "family_name": "Фамилия",
    "birthday": "Дата рождения",
    "position_at_work": "Должность",
    "tel": "Номер телефона",
    "gender": "Пол",
    "citizenship": "Гражданство",
    "photo": "Фото",
    "series_number": "Серия и номер паспорта",
    "issuing_authority": "Орган выдающий паспорт",
    "date_of_issue": "Дата выдачи",
    "address": "Адрес проживания",
    "organization": "Организация",
    "second_organization": "Организация",
    "work_type": "Тип занятости",
    "mail": "Эл. почта",
    "is_dismissed": "Уволен",
}

employee_widgets_dict = {
    "birthday": forms.DateInput(format="%Y-%m-%d", attrs={"type": "date"}),
    "photo": forms.FileInput(),
    "date_of_issue": forms.DateInput(
        format="%Y-%m-%d", attrs={"type": "date"}
    ),
    "organization": forms.Select(),
    "second_organization": forms.Select(),
    "gender": forms.Select(),
    "work_type": forms.Select(),
    "mail": forms.EmailInput(attrs={"placeholder": "andrey@mail.ru"}),
    "is_dismissed": forms.CheckboxInput(),
}

select_employee_fields = [
    "organization",
    "second_organization",
]


class EmployeeCreateForm(forms.ModelForm[Employee]):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control"
        for field in select_employee_fields:
            self.fields[field].widget.attrs["class"] = "form-control select2"
        self.fields["is_dismissed"].widget.attrs["class"] = "form-check-input"

    class Meta:
        model = Employee
        fields = employee_labels_dict.keys()
        labels = employee_labels_dict
        widgets = employee_widgets_dict


class EmployeeUpdateForm(EmployeeCreateForm):
    pass


counterparty_labels_dict: dict[str, str] = {
    "title": "Наименование",
    "inn": "ИНН",
    "group_k": "Группа",
    "type_k": "Вид контрагента",
    "trade_name": "Торговое название",
    "description": "Описание",
    "url": "Сайт",
    "tel": "Номер телефона",
}

counterparty_widgets_dict: dict[str, Any] = {
    "group_k": forms.Select(),
    "type_k": forms.Select(),
    "description": forms.Textarea(),
    "url": forms.URLInput(attrs={"type": "url"}),
    "tel": forms.TextInput(attrs={"type": "tel"}),
}


class CounterpartyCreateForm(forms.ModelForm[Counterparty]):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control"

    class Meta:
        model = Counterparty
        fields = counterparty_labels_dict.keys()
        labels = counterparty_labels_dict
        widgets = counterparty_widgets_dict


class CounterpartyAliasCreateForm(forms.ModelForm[CounterpartyAliases]):
    class Meta:
        model = CounterpartyAliases
        fields = ("alias", "counterparty")
        labels = {
            "alias": "Алиас",
            "counterparty": "Контрагент",
        }
        widgets = {
            "counterparty": forms.Select(
                attrs={"class": "form-control select2"}
            ),
            "alias": forms.TextInput(attrs={"class": "form-control"}),
        }
