from django import forms
from .models import *
from django.contrib.auth.forms import AuthenticationForm # UserCreationForm,

class UserLoginForms(AuthenticationForm):
    username = forms.CharField(label='Имя пользователя', widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(label='Пароль', widget=forms.PasswordInput(attrs={'class': 'form-control'}))

class accounting_for_purchased_equipment_form(forms.ModelForm):
    name = forms.CharField(label='Наименование покупного оборудования', widget=forms.TextInput(attrs={'class': 'form-control'}))
    class Meta:
        model = accounting_for_purchased_equipment
        fields = ('name',)

class accounting_of_services_and_equipment_form(forms.ModelForm):
    name = forms.CharField(label='Наименование услуг или оборудования', widget=forms.TextInput(attrs={'class': 'form-control'}))
    class Meta:
        model = accounting_of_services_and_equipment
        fields = ('name',)

class accounting_of_services_and_equipment_description_form(forms.ModelForm):
    description = forms.CharField(label='Расшифровка услуг или оборудования', widget=forms.TextInput(attrs={'class': 'form-control'}))
    services = forms.ModelMultipleChoiceField(queryset=accounting_of_services_and_equipment.objects.all(), label='Наименование услуг или оборудования')
    class Meta:
        model = accounting_of_services_and_equipment_description
        exclude = ('description', 'services',)

class details_form(forms.ModelForm):
    class Meta:
        model = details
        fields = ('name', 'link', )
        widgets = {
            'name': forms.Select(attrs=
                              {
                               'id': 'id_choice_id',
                                "style": "width:50%"
                               }
                              ),
            'link': forms.TextInput(attrs=
            {
                "style": "width:50%"
            }
            )
        }







































# class utn_purchased_details_form(forms.Form):
#     list_under_the_node = []
#     # list_purchased = []
#     # list_details = []
#     # j = 0
#     for models in [under_the_node, accounting_for_purchased_equipment, details]:
#         for item in models.objects.all():
#             # try:
#                 x = (item.id, item.name)
#             # except Exception:
#             #     x = (item.name_id, item.name)
#             # if j == 0:
#                 list_under_the_node.append(x)
#         #     elif j == 1:
#         #         list_purchased.append(x)
#         #     elif j == 2:
#         #         list_details.append(x)
#         # j += 1
#     name = forms.ChoiceField(choices=list_under_the_node, label='Выбор подузла', widget=forms.Select(attrs={
#                                                                                                             'required': "required",
#                                                                                                             'size': "1",
#                                                                                                             'onchange': "document.getElementById('update').submit()",
#                                                                                                             'style': 'width:400px'
#                                                                                                             }), )
#
# class utn_purchased_details_form2(forms.Form):
#     # list_under_the_node = []
#     list_purchased = []
#     # list_details = []
#     # j = 0
#     for models in [under_the_node, accounting_for_purchased_equipment, details]:
#         for item in models.objects.all():
#             # try:
#                 x = (item.id, item.name)
#             # except Exception:
#             #     x = (item.name_id, item.name)
#             # if j == 0:
#             #     list_under_the_node.append(x)
#             # elif j == 1:
#                 list_purchased.append(x)
#         #     elif j == 2:
#         #         list_details.append(x)
#         # j += 1
#     purchased = forms.ChoiceField(choices=list_purchased, label='Выбор покупного оборудования', widget=forms.Select(attrs={'style': 'width:400px'}), )
#     check_box1 = forms.CheckboxInput()
#     quantity_purchased = forms.IntegerField(label="Количество покупного оборудования(шт.)", min_value=0, widget=forms.NumberInput(attrs={'value': '1', 'style': 'width:30px'}))
#
# class utn_purchased_details_form3(forms.Form):
#     # list_under_the_node = []
#     # list_purchased = []
#     list_details = []
#     # j = 0
#     for models in [under_the_node, accounting_for_purchased_equipment, details]:
#         for item in models.objects.all():
#             # try:
#             #     x = (item.id, item.name)
#             # except Exception:
#                 x = (item.name_id, item.name)
#             # if j == 0:
#             #     list_under_the_node.append(x)
#             # elif j == 1:
#             #     list_purchased.append(x)
#             # elif j == 2:
#                 list_details.append(x)
#         # j += 1
#     details = forms.ChoiceField(choices=list_details, label='Выбор деталей', widget=forms.Select(attrs={'style': 'width:400px'}), )
#     quantity_details = forms.IntegerField(label="Количество деталей(шт.)", min_value=0, widget=forms.NumberInput(attrs={'value': '1', 'style': 'width:30px'}))