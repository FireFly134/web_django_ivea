from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout

import pandas as pd
from sqlalchemy import create_engine

from .forms import *
from .work import *

engine = create_engine(ivea_metrika)
data_list = {}
user_triger = {}

def index(request):
    return render(request, "main/index.html")

def list_doc(request):
    info = pd.read_sql_query(f"SELECT id, number_doc, short_name FROM documents ORDER BY id DESC;", engine)
    html = ''
    for i in range(len(info)):
        html +="""<tr>
                     <td style="text-align:center"><span style="font-size:12pt"><span style="color:black"><span style="font-family:Calibri,sans-serif">""" + str(
            info.loc[i, 'id']) + """</span></span></span></td>
                     <td><span style="font-size:12pt"><span style="color:black"><span style="font-family:Calibri,sans-serif">""" + str(
            info.loc[i, 'number_doc']) + """</span></span></span></td>
                     <td><span style="font-size:12pt"><span style="color:black"><span style="font-family:Calibri,sans-serif">""" + str(
            info.loc[i, 'short_name']) + """</span></span></span></td>
                </tr>"""
    return render(request, 'main/list_doc.html', context={'html': html})

def new_doc(request):
    if request.method=='POST':
        context = {"context": "POST"}
        for i in range(1, 30):
            context.update({f"in_{i}": request.POST.get(f"in_{i}")})
        context.update({"text_for_call": request.POST.get("text_for_call")})
        if request.POST.get('save') is None:
            if context['in_8'] is not None and context['in_8'].isdigit():
                enter = ""
                for j in range(0, int(context['in_8']) * 2, 2):
                    enter += f'<p style="text-align:center"><span style="font-size:14px"><span style="font-family:Times New Roman,Times,serif">Наименование работ:&nbsp;<input maxlength="100" name="in_{9 + j}" required="required" size="25" type="text">&nbsp; Дата:&nbsp;</span></span><input maxlength="10" name="in_{10 + j}" size="10" type="text" placeholder="29.05.2022"></p>'
                context.update({"enter": enter})
        else:
            context["context"] = "save"
            if context['in_29'] != '':
                engine.execute(
                    f"INSERT INTO documents (number_doc, counterparty, name, scan, date, short_name, link, type_works, mail, teg, text_for_call) "
                    f"VALUES('{context['in_1']}', '{context['in_2']}', '{context['in_3']}', '1', '{context['in_7']}', '{context['in_4']}', '{context['in_5']}', '{context['in_6']}', 'info@ivea-water.ru;cherkas1@yandex.ru;nm@ivea-water.ru;ks@ivea-water.ru;ds@ivea-water.ru', '{context['in_29']}', '{context['text_for_call']}');")
            else:
                engine.execute(
                    f"INSERT INTO documents (number_doc, counterparty, name, scan, date, short_name, link, type_works, mail, text_for_call) "
                    f"VALUES('{context['in_1']}', '{context['in_2']}', '{context['in_3']}', '1', '{context['in_7']}', '{context['in_4']}', '{context['in_5']}', '{context['in_6']}', 'info@ivea-water.ru;cherkas1@yandex.ru;nm@ivea-water.ru;ks@ivea-water.ru;ds@ivea-water.ru', '{context['text_for_call']}');")
            w_name = [context['in_9'], context['in_11'], context['in_13'], context['in_15'], context['in_17'], context['in_19'], context['in_21'], context['in_23'], context['in_25'], context['in_27']]
            w_date = [context['in_10'], context['in_12'], context['in_14'], context['in_16'], context['in_18'], context['in_20'], context['in_22'], context['in_24'], context['in_26'], context['in_28']]
            if "." in str(context['in_7']):
                data_end = str(context['in_7']).split('.')
                date = f"{data_end[2]}-{data_end[1]}-{data_end[0]} 00:00:00"
            else:
                date = str(context['in_7'])
            engine.execute(f"INSERT INTO doc_date (doc_name, work_name, date_end) VALUES('{context['in_4']}', '{w_name[i]}', '{date}');")

            for i in range(len(w_name)):
                if w_name[i] is not None:
                    date = w_date[i]
                    if "." in str(date):
                        data_end = str(date).split('.')
                        date = f"{data_end[2]}-{data_end[1]}-{data_end[0]} 00:00:00"
                    engine.execute(f"INSERT INTO doc_date (doc_name, work_name, date_end) VALUES('{context['in_4']}', '{w_name[i]}', '{date}');")
                    # print(f"INSERT INTO doc_date (doc_name, work_name, date_end) VALUES('{context['in_4']}', '{w_name[i]}', '{date}');")
            messages.success(request, 'Данные успешно сохранены!')
            return redirect('home')
        return render(request, "main/new_doc.html", context=context)
    if request.method == 'GET':
        return render(request, "main/new_doc.html", context={"context": "GET"})

def not_an_agreed_doc(request):
    info = pd.read_sql_query(f"SELECT id, num_doc, contragent, date_doc, num_1c FROM doc_entera_1c WHERE send_email = 'False' and delete = 'False';", engine)
    html = ''
    for i in range(len(info)):
        html +="""<tr>
                     <td style="text-align:center"><span style="font-size:12pt"><span style="color:black"><span style="font-family:Calibri,sans-serif">""" + str(
            info.loc[i, 'id']) + """</span></span></span></td>
                    <td style="text-align:center"><span style="font-size:12pt"><span style="color:black"><span style="font-family:Calibri,sans-serif">""" + str(
            info.loc[i, 'num_1c']) + """</span></span></span></td>
                     <td style="text-align:center"><span style="font-size:12pt"><span style="color:black"><span style="font-family:Calibri,sans-serif">Счёт № """ + str(
            info.loc[i, 'num_doc']) + """</span></span></span></td>
                     <td style="text-align:center"><span style="font-size:12pt"><span style="color:black"><span style="font-family:Calibri,sans-serif">""" + str(
            info.loc[i, 'contragent']) + """</span></span></span></td>
                    <td style="text-align:center"><span style="font-size:12pt"><span style="color:black"><span style="font-family:Calibri,sans-serif">""" + str(
            info.loc[i, 'date_doc']) + """</span></span></span></td>
                </tr>"""
    return render(request, 'main/not_an_agreed_doc.html', context={'html': html})

def user_login(request):
    if request.method == 'POST':
        form = UserLoginForms(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = UserLoginForms()
    return render(request, "main/login.html", context={'form': form})

def user_logout(request):
    logout(request)
    return redirect('home')

def add_pocup_oborud(request):
    table = accounting_for_purchased_equipment.objects
    form = accounting_for_purchased_equipment_form()
    return add_one_value(request, table, form)

def add_uslug_i_oborud_description(request):
    table = accounting_of_services_and_equipment_description.objects
    form = accounting_of_services_and_equipment_description_form()
    return add_one_value(request, table, form, get_name='description')

def add_uslug_i_oborud(request):
    table = accounting_of_services_and_equipment.objects
    form = accounting_of_services_and_equipment_form()
    return add_one_value(request, table, form)

def add_one_value(request, table, form, get_name='name'):
    try:
        table_name = str(form).split('<label for="id_name">Наименование ')[1].split(':</label></th>')[0]
    except Exception:
        table_name = ''
    if request.method == 'POST':
        if get_name == 'name':
            if table.filter(name=request.POST.get('name')).exists() != True:
                fail = True
                сounter = 0
                while fail:
                    if сounter == 1000:
                        messages.error(request, 'Ошибка записи, пожалуйста повторите позже!')
                        break
                    try:
                        table.create(name=request.POST.get('name'))
                        messages.success(request, 'Запись успешно добавлена.')
                        fail = False
                    except Exception as err:
                        print(err)
                    сounter += 1
            else:
                messages.error(request, 'Такая запись уже присутствует.')
        elif get_name == 'description':
            if table.filter(description=request.POST.get('description')).exists() != True:
                print('description= ', request.POST.get('description'))
                print('services= ', request.POST.getlist('services'))
                table.create(description=request.POST.get('description'), services=request.POST.getlist('services'))
                messages.success(request, 'Запись успешно добавлена.')
            else:
                messages.error(request, 'Такая запись уже присутствует.')
    return render(request, "main/add_one_value.html", context={'form': form, 'table': table.all(), 'table_name': table_name})

def details_def(request):
    model_obj = accounting_for_purchased_equipment.objects
    class choice_form(forms.Form):
        list_details = []
        for item in model_obj.all():
            x = (item.id, item.name)
            list_details.append(x)
        choice_id = forms.ChoiceField(choices=list_details, label='Наименование детали', widget=forms.Select(attrs={
            'required': "required",
            'onchange': "document.getElementById('update').submit()",
            'style': 'width:50%'
        }), )
    if request.method == 'POST':
        print(request.POST)
        form = choice_form(request.POST)
        choice_id = request.POST.get('choice_id')
        if request.POST.get('save') is not None: #form.is_valid():
            if request.POST.get('link') is not None: #form.is_valid():
                if details.objects.filter(link=request.POST.get('link'), name=request.POST.get('name')).exists() != True:
                    if details.objects.filter(name=request.POST.get('name')).exists() != True:
                        form_save = details_form(request.POST)
                        form_save.save()
                    else:
                        edit_link = details.objects.get(name=request.POST.get('name'))
                        edit_link.link = request.POST.get('link')
                        edit_link.save()
                    messages.success(request, 'Запись успешно добавлена.')
                else:
                    messages.error(request, 'Такая запись уже есть!')
            else:
                messages.error(request, 'Вы не ввели ссылку.')
        elif request.POST.get('save_new_purchased') is not None:
            if model_obj.filter(name=request.POST.get('name')).exists() != True:
                model_obj.create(name=request.POST.get('name'))
                messages.success(request, 'Запись успешно добавлена.')
            else:
                messages.error(request, 'Такая запись уже присутствует.')
        elif request.POST.get('rename') is not None:
            form = choice_form(request.POST)
            choice_id = request.POST.get('choice_id')
            if model_obj.filter(name=request.POST.get('rename')).exists() != True:
                pk = request.POST.get('pk')
                rename = model_obj.get(pk=pk)
                rename.name = request.POST.get('rename')
                rename.save()
                messages.success(request, 'Запись успешно изменена.')
            else:
                messages.error(request, 'Такое наименование уже присутствует.')
    else:
        form = choice_form()
        choice_id = '1'
    return render(request, "main/details.html", context={'form': form, 'table': details.objects.all(), 'table_name': "детали", 'choice_id': choice_id})
def choice(request, model_obj, label):
    class choice_form(forms.Form):
        list_under_the_node = []
        for item in model_obj.all():
            x = (item.id, item.name)
            list_under_the_node.append(x)
        choice_id = forms.ChoiceField(choices=list_under_the_node, label=label, widget=forms.Select(attrs={
            'required': "required",
            'size': "1",
            'onchange': "document.getElementById('update').submit()",
            'style': 'width:400px'
        }), )
    if request.method == 'POST':
        if request.POST.get('save_all') is not None:
            form = choice_form(request.POST)
            choice_id = request.POST.get('choice_id')
            if model_obj.filter(name=request.POST.get('name')).exists() != True:
                model_obj.create(name=request.POST.get('name'))
                messages.success(request, 'Запись успешно добавлена.')
            else:
                messages.error(request, 'Такая запись уже присутствует.')
        elif request.POST.get('rename') is not None:
            form = choice_form(request.POST)
            choice_id = request.POST.get('choice_id')
            if model_obj.filter(name=request.POST.get('rename')).exists() != True:
                pk = request.POST.get('pk')
                rename = model_obj.get(pk=pk)
                rename.name = request.POST.get('rename')
                rename.save()
                messages.success(request, 'Запись успешно изменена.')
            else:
                messages.error(request, 'Такое наименование уже присутствует.')
        else:
            form = choice_form(request.POST)
            choice_id = request.POST.get('choice_id')
    else:
        form = choice_form()
        choice_id = '1'
    return form, choice_id

def choice_poduzel(request):
    label = 'Выбор подузла'
    model_obj = under_the_node.objects
    form, choice_id = choice(request, model_obj,label)
    obj1 = utn_details.objects.filter(belongs_id=choice_id)
    obj2 = utn_purchased.objects.filter(belongs_id=choice_id)
    return render(request, "main/object_assembly/choice.html", context={'form': form, 'obj1': obj1, 'obj2': obj2, 'choice_id': choice_id, 'url': '/edit_under_the_node/', 'title': 'Подузел', })

def choice_uzel(request):
    label = 'Выбор узла'
    model_obj = unit.objects
    form, choice_id = choice(request, model_obj, label)
    obj1 = unit_details.objects.filter(belongs_id=choice_id)
    obj2 = unit_purchased.objects.filter(belongs_id=choice_id)
    obj3 = unit_under_the_node.objects.filter(belongs_id=choice_id)
    return render(request, "main/object_assembly/choice.html", context={'form': form, 'obj1': obj1, 'obj2': obj2, 'obj3': obj3, 'choice_id': choice_id, 'url': '/edit_unit/', 'title': 'Узел', })

def choice_assembly_unit(request):
    label = 'Выбор cборочной единицы'
    model_obj = assembly_unit.objects
    form, choice_id = choice(request, model_obj, label)
    obj1 = assembly_unit_details.objects.filter(belongs_id=choice_id)
    obj2 = assembly_unit_purchased.objects.filter(belongs_id=choice_id)
    obj3 = assembly_unit_under_the_node.objects.filter(belongs_id=choice_id)
    obj4 = assembly_unit_unit.objects.filter(belongs_id=choice_id)
    return render(request, "main/object_assembly/choice.html", context={'form': form, 'obj1': obj1, 'obj2': obj2, 'obj3': obj3, 'obj4': obj4, 'choice_id': choice_id, 'url': '/edit_assembly_unit/', 'title': 'Сборочная единица', })

def choice_object_assembly(request):
    info = pd.read_sql_query(f"SELECT id, short_name FROM documents ORDER BY id DESC;", engine)
    class object_assembly_form(forms.Form):
        list_choice = []
        for i in range(len(info)):
                list_choice.append((info.loc[i,'id'], info.loc[i,'short_name']))
        choice_id = forms.ChoiceField(choices=list_choice, label='Выбор объектной сборки', widget=forms.Select(attrs={
            'required': "required",
            'size': "1",
            'onchange': "document.getElementById('update').submit()",
            'style': 'width:400px'
        }), )

    if request.method == 'POST':
        form = object_assembly_form(request.POST)
        choice_id = request.POST.get('choice_id')
    else:
        form = object_assembly_form()
        choice_id = info.loc[0,'id']
    obj1 = object_assembly_assembly_unit.objects.filter(belongs=choice_id)
    obj2 = object_assembly_purchased.objects.filter(belongs=choice_id)
    return render(request, "main/object_assembly/choice.html", context={'form': form, 'obj1': obj1, 'obj2': obj2, 'choice_id': choice_id, 'url': '/edit_object_assembly/', 'title': 'Объектная сборка', })

### общая функция для изменения списков ###
def edit_general(request, model_obj, name_model):
    global data_list
    username = str(request.user.username) # Узнаем имя пользователя.
    if request.POST.get('choice_id') is not None: # На всякий случай проверяем выбрали ли мы что... это всё срабатывает только в момент перехода из выбова в редактирование
        if username in user_triger: # Проверка били ли записи от этого пользователя
            user_triger.pop(username) #  обнуляем чтобы небыло недопониманий
        obj = model_obj.filter(pk=request.POST.get('choice_id')) # находим в нужной моделе нужную запись
        user_triger[username] = {'pk': request.POST.get('choice_id'),
                                             'edit': 'details',
                                            'name': obj[0].name,}# записываем всё в словарь, ключем выступает имя пользователя
        data_list = {
            'data':{'purchased': {},
                    'poduzel': {},
                    'uzel': {},
                     'details': {}},
            'add': {'purchased': {},
                    'poduzel': {},
                    'uzel': {},
                     'details': {}},
            'del': {'purchased': {},
                    'poduzel': {},
                    'uzel': {},
                    'details': {}}
        }

    if request.method == 'POST':
        if request.POST.get('edit') == 'purchased' or (request.POST.get('edit') is None and user_triger[username]['edit'] == 'purchased'):
            user_triger[username]['edit'] = 'purchased'
            obj = accounting_for_purchased_equipment.objects
            if name_model == 'under_the_node':
                obj2 = utn_purchased.objects
            elif name_model == 'unit':
                obj2 = unit_purchased.objects
            elif name_model == 'assembly_unit':
                obj2 = assembly_unit_purchased.objects
        elif request.POST.get('edit') == 'details' or (request.POST.get('edit') is None and user_triger[username]['edit'] == 'details'):
            user_triger[username]['edit'] = 'details'
            obj = details.objects
            if name_model == 'under_the_node':
                obj2 = utn_details.objects
            elif name_model == 'unit':
                obj2 = unit_details.objects
            elif name_model == 'assembly_unit':
                obj2 = assembly_unit_details.objects
        elif request.POST.get('edit') == 'poduzel' or (request.POST.get('edit') is None and user_triger[username]['edit'] == 'poduzel'):
            user_triger[username]['edit'] = 'poduzel'
            obj = under_the_node.objects
            if name_model == 'unit':
                obj2 = unit_under_the_node.objects
            elif name_model == 'assembly_unit':
                obj2 = assembly_unit_under_the_node.objects
        elif request.POST.get('edit') == 'uzel' or (request.POST.get('edit') is None and user_triger[username]['edit'] == 'uzel'):
            user_triger[username]['edit'] = 'uzel'
            obj = unit.objects
            obj2 = assembly_unit_unit.objects
        if request.POST.get('edit') is not None:
            data_list['add'][user_triger[username]['edit']] = {}
            data_list['del'][user_triger[username]['edit']] = {}
            data_list['data'][user_triger[username]['edit']] = {}
            for items in obj2.filter(belongs_id=user_triger[username]['pk']):
                if request.POST.get('edit') == 'details' or (request.POST.get('edit') is None and user_triger[username]['edit'] == 'details'):
                    data_list['data'][user_triger[username]['edit']][items.name.name.name] = items.quantity
                else:
                    data_list['data'][user_triger[username]['edit']][items.name.name] = items.quantity
        if request.POST.get('name_add') is not None:
            data_list['data'][user_triger[username]['edit']][request.POST.get('name_add')] = request.POST.get('kol-vo')
            data_list['add'][user_triger[username]['edit']][request.POST.get('name_add')] = request.POST.get('kol-vo')
        if request.POST.get('name_del') is not None:
            data_list['data'][user_triger[username]['edit']].pop(request.POST.get('name_del'))
            if request.POST.get('name_del') in data_list['add'][user_triger[username]['edit']]:
                data_list['add'][user_triger[username]['edit']].pop(request.POST.get('name_del'))
                data_list['del'][user_triger[username]['edit']][request.POST.get('name_del')] = False
            else:
                data_list['del'][user_triger[username]['edit']][request.POST.get('name_del')] = True
        if request.POST.get('save') is not None:
            for key in data_list['del'][user_triger[username]['edit']]:
                if data_list['del'][user_triger[username]['edit']][key]:
                    if user_triger[username]['edit'] == 'purchased' or user_triger[username]['edit'] == 'details':
                        get_id = accounting_for_purchased_equipment.objects.get(name=key).pk
                    elif user_triger[username]['edit'] == 'poduzel':
                        get_id = under_the_node.objects.get(name=key).pk
                    elif user_triger[username]['edit'] == 'uzel':
                        get_id = unit.objects.get(name=key).pk
                    obj2.filter(belongs_id=user_triger[username]['pk'], name_id=get_id).delete()
            for key in data_list['add'][user_triger[username]['edit']]:
                value = data_list['add'][user_triger[username]['edit']][key]
                if user_triger[username]['edit'] == 'purchased' or user_triger[username]['edit'] == 'details':
                    get_id = accounting_for_purchased_equipment.objects.get(name=key).pk
                elif user_triger[username]['edit'] == 'poduzel':
                    get_id = under_the_node.objects.get(name=key).pk
                elif user_triger[username]['edit'] == 'uzel':
                    get_id = unit.objects.get(name=key).pk
                if obj2.filter(name_id=get_id, belongs_id = user_triger[username]['pk']).exists() != True:
                    obj2.create(name_id=get_id, belongs_id=user_triger[username]['pk'], quantity=value)
                elif obj2.filter(name_id=get_id, belongs_id = user_triger[username]['pk'], quantity=value).exists() != True:
                    edit_obj = obj2.get(name_id=get_id, belongs_id=user_triger[username]['pk'])
                    edit_obj.quantity = value
                    edit_obj.save()
    return obj

def edit_poduzel(request):
    global data_list
    print(request.POST)
    username = str(request.user.username)
    obj = edit_general(request, under_the_node.objects, 'under_the_node')
    return render(request, "main/object_assembly/edit.html", context={'edit': user_triger[username]['edit'], 'data': data_list['data'], 'name_poduzel': user_triger[username]['name'],'obj': obj.all(), 'model': 1, })

def edit_uzel(request):
    global data_list
    username = str(request.user.username)
    obj = edit_general(request, unit.objects, 'unit')
    return render(request, "main/object_assembly/edit.html", context={'edit': user_triger[username]['edit'], 'data': data_list['data'], 'name_poduzel': user_triger[username]['name'],'obj': obj.all(), 'model': 2, })

def edit_assembly_unit(request):
    global data_list
    username = str(request.user.username)
    print(1)
    obj = edit_general(request, assembly_unit.objects, 'assembly_unit')
    return render(request, "main/object_assembly/edit.html", context={'edit': user_triger[username]['edit'], 'data': data_list['data'], 'name_poduzel': user_triger[username]['name'],'obj': obj.all(), 'model': 3, })

def edit_object_assembly(request):
    global data_list
    username = str(request.user.username)
    if request.POST.get('choice_id') is not None:
        if username in user_triger:
            user_triger.pop(username)
        info = pd.read_sql_query(f"SELECT short_name FROM documents WHERE id = {request.POST.get('choice_id')};", engine)
        print(info)
        user_triger[username] = {'pk': request.POST.get('choice_id'),
                                             'edit': 'assembly_unit',
                                            'name': info.loc[0, 'short_name'],}
        data_list = {
            'data':{'purchased': {},
                     'assembly_unit': {}},
            'add': {'purchased': {},
                     'assembly_unit': {}},
            'del': {'purchased': {},
                    'assembly_unit': {}}
        }
        print(user_triger[username]['name'])
    if request.POST.get('edit') == 'purchased' or (request.POST.get('edit') is None and user_triger[username]['edit'] == 'purchased'):
        user_triger[username]['edit'] = 'purchased'
        obj = accounting_for_purchased_equipment.objects
        obj2 = object_assembly_purchased.objects
        if request.POST.get('edit') is not None:
            data_list['add'][user_triger[username]['edit']] = {}
            data_list['del'][user_triger[username]['edit']] = {}
            data_list['data'][user_triger[username]['edit']] = {}
            for items in obj2.filter(belongs=user_triger[username]['pk']):
                data_list['data'][user_triger[username]['edit']][items.name.name] = items.quantity
    elif request.POST.get('edit') == 'assembly_unit' or (request.POST.get('edit') is None and user_triger[username]['edit'] == 'assembly_unit'):
        user_triger[username]['edit'] = 'assembly_unit'
        obj = assembly_unit.objects
        obj2 = object_assembly_assembly_unit.objects
        if request.POST.get('edit') is not None:
            data_list['add'][user_triger[username]['edit']] = {}
            data_list['del'][user_triger[username]['edit']] = {}
            data_list['data'][user_triger[username]['edit']] = {}
            for items in obj2.filter(belongs=user_triger[username]['pk']):
                data_list['data'][user_triger[username]['edit']][items.name.name] = items.quantity
    if request.POST.get('name_add') is not None:
        data_list['data'][user_triger[username]['edit']][request.POST.get('name_add')] = request.POST.get('kol-vo')
        data_list['add'][user_triger[username]['edit']][request.POST.get('name_add')] = request.POST.get('kol-vo')
    if request.POST.get('name_del') is not None:
        data_list['data'][user_triger[username]['edit']].pop(request.POST.get('name_del'))
        if request.POST.get('name_del') in data_list['add'][user_triger[username]['edit']]:
            data_list['add'][user_triger[username]['edit']].pop(request.POST.get('name_del'))
            data_list['del'][user_triger[username]['edit']][request.POST.get('name_del')] = False
        else:
            data_list['del'][user_triger[username]['edit']][request.POST.get('name_del')] = True
    if request.POST.get('save') is not None:
        for key in data_list['del'][user_triger[username]['edit']]:
            if data_list['del'][user_triger[username]['edit']][key]:
                if user_triger[username]['edit'] == 'purchased':
                    get_id = accounting_for_purchased_equipment.objects.get(name=key).pk
                    obj2.filter(belongs=user_triger[username]['pk'], name_id=get_id).delete()
                elif user_triger[username]['edit'] == 'assembly_unit':
                    get_id = assembly_unit.objects.get(name=key).pk
                    obj2.filter(belongs=user_triger[username]['pk'], name_id=get_id).delete()
        for key in data_list['add'][user_triger[username]['edit']]:
            value = data_list['add'][user_triger[username]['edit']][key]
            if user_triger[username]['edit'] == 'purchased':
                get_id = accounting_for_purchased_equipment.objects.get(name=key).pk
                if obj2.filter(name_id=get_id, belongs=user_triger[username]['pk']).exists() != True:
                    obj2.create(belongs=user_triger[username]['pk'], name_id=get_id, quantity=value)
                elif obj2.filter(name_id=get_id, belongs=user_triger[username]['pk'], quantity=value).exists() != True:
                    edit_obj = obj2.get(name_id=get_id, belongs=user_triger[username]['pk'])
                    edit_obj.quantity = value
                    edit_obj.save()
            elif user_triger[username]['edit'] == 'assembly_unit':
                get_id = assembly_unit.objects.get(name=key).pk
                if obj2.filter(name_id=get_id, belongs=user_triger[username]['pk']).exists() != True:
                    obj2.create(belongs=user_triger[username]['pk'], name_id=get_id, quantity=value)
                elif obj2.filter(name_id=get_id, belongs=user_triger[username]['pk'], quantity=value).exists() != True:
                    edit_obj = obj2.get(name_id=get_id, belongs=user_triger[username]['pk'])
                    edit_obj.quantity = value
                    edit_obj.save()
    return render(request, "main/object_assembly/edit.html", context={'edit': user_triger[username]['edit'], 'data': data_list['data'], 'name_poduzel': user_triger[username]['name'],'obj': obj.all(), 'model': 4, })

#####################################
### Составляем отчетную ведомость ###
#####################################

def report_object_assembly(request):
    if request.POST.get('choice_id') is not None:
        info = pd.read_sql_query(f"SELECT short_name FROM documents WHERE id = {request.POST.get('choice_id')};",engine)
        global data_list
        data_list = {'details': {},
           'purchased': {}}
        object1 = object_assembly_assembly_unit.objects.filter(belongs=int(request.POST.get('choice_id')))
        object2 = object_assembly_purchased.objects.filter(belongs=int(request.POST.get('choice_id')))
        items_assembly_unit(object1)
        items_purchased(object2)
        return render(request, "main/object_assembly/report_object_assembly.html", context={'name': info.loc[0, 'short_name'], "data": data_list, })

###########################################################
### Производим развертование(расспаковку) всех записей, ###
######### которые косаются данного объекта ################
###########################################################

def items_assembly_unit(object1):
    for items_assembly_unit in object1:
        q = 0
        while q < items_assembly_unit.quantity:
            print(q)
            object1 = assembly_unit_unit.objects.filter(belongs_id=items_assembly_unit.name)
            object2 = assembly_unit_under_the_node.objects.filter(belongs_id=items_assembly_unit.name)
            object3 = assembly_unit_details.objects.filter(belongs_id=items_assembly_unit.name)
            object4 = assembly_unit_purchased.objects.filter(belongs_id=items_assembly_unit.name)
            if object1:
                items_unit(object1)
            if object2:
                items_under_the_node(object2)
            if object3:
                items_details(object3)
            if object4:
                items_purchased(object4)
            q += 1

def items_unit(object1):
    for items_unit in object1:
        q = 0
        while q < items_unit.quantity:
            object1 = unit_under_the_node.objects.filter(belongs_id=items_unit.name)
            object2 = unit_details.objects.filter(belongs_id=items_unit.name)
            object3 = unit_purchased.objects.filter(belongs_id=items_unit.name)
            if object1:
                items_under_the_node(object1)
            if object2:
                items_details(object2)
            if object3:
                items_purchased(object3)
            q += 1

def items_under_the_node(object1):
    for items_under_the_node in object1:
        q = 0
        while q < items_under_the_node.quantity:
            object1 = utn_details.objects.filter(belongs_id=items_under_the_node.name)
            object2 = utn_purchased.objects.filter(belongs_id=items_under_the_node.name)
            if object1:
                items_details(object1)
            if object2:
                items_purchased(object2)
            q += 1

def items_details(object1):
    for items_details in object1:
        if items_details.name.name.name in data_list['details']:
            data_list['details'][items_details.name.name.name] += int(items_details.quantity)
        else:
            data_list['details'].update({items_details.name.name.name: int(items_details.quantity)})

def items_purchased(object1):
    for items_purchased in object1:
        if items_purchased.name in data_list['purchased']:
            data_list['purchased'][items_purchased.name] += items_purchased.quantity
        else:
            data_list['purchased'].update({items_purchased.name: items_purchased.quantity})
