import datetime
import json
import os
from typing import Any

from db_utils import engine

from django import forms
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.http import (
    FileResponse,
    Http404,
    HttpRequest,
    HttpResponse,
    HttpResponsePermanentRedirect,
    HttpResponseRedirect,
    JsonResponse,
)
from django.shortcuts import redirect, render
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, ListView

from global_utils import DownloadManager, UploadManager

import pandas as pd

from taskmanager.settings import NEW_SITE_URL

import telegram

from .forms import (
    DetailCreateForm,
    ProjectEquipmentCreateForm,
    UserLoginForms,
    accounting_for_purchased_equipment_form,
    accounting_of_services_and_equipment_description_form,
    accounting_of_services_and_equipment_form,
    details_form,
)
from .models import (
    ProjectEquipment,
    accounting_for_purchased_equipment,
    accounting_of_services_and_equipment,
    accounting_of_services_and_equipment_description,
    assembly_unit,
    assembly_unit_details,
    assembly_unit_purchased,
    assembly_unit_under_the_node,
    assembly_unit_unit,
    details,
    object_assembly_assembly_unit,
    object_assembly_details,
    object_assembly_project_equipment,
    object_assembly_purchased,
    object_assembly_under_the_node,
    object_assembly_unit,
    under_the_node,
    unit,
    unit_details,
    unit_purchased,
    unit_under_the_node,
    utn_details,
    utn_purchased,
)
from .services import ExcelReportGenerator

bot = telegram.Bot(os.getenv("TELEGRAM_TOKEN", ""))

data_list: dict[Any, Any] = {}
user_triger: dict[Any, Any] = {}

data_object_assembly_list: dict[str, Any] = {
    "data": {},
    "add": {},
    "del": {},
}


def get_date(in_date: Any) -> Any:
    date: Any
    # Приводим дату в божеский вид.
    if "." in str(in_date):
        data_end = str(in_date).split(".")
        date = f"{data_end[2]}-{data_end[1]}-{data_end[0]} 00:00:00"
    elif "" in str(in_date):
        date = datetime.datetime.now()
    elif "-" in str(in_date):
        date = str(in_date)
    else:
        date = False
    return date


def get_flags(in_flag: Any) -> Any:
    if in_flag == "on":
        flag = "true"
    else:
        flag = "false"
    return flag


def index(request: HttpRequest) -> HttpResponse:
    return render(
        request, "main/index.html", context={"NEW_SITE_URL": NEW_SITE_URL}
    )


def test(request: HttpRequest) -> HttpResponse:
    return render(request, "main/test.html")


def example_view(request: HttpRequest) -> Http404:
    # Генерировать ошибку 404
    raise Http404("Страница не найдена")


def custom_400_view(request: HttpRequest, exception: Any) -> HttpResponse:
    return render(request, "404.html", status=400)


def custom_403_view(request: HttpRequest, exception: Any) -> HttpResponse:
    return render(request, "404.html", status=403)


def custom_404_view(request: HttpRequest, exception: Any) -> HttpResponse:
    return render(request, "404.html", status=404)


def custom_500_view(request: HttpRequest, exception: Any) -> HttpResponse:
    return render(request, "404.html", status=500)


def open_map_with_station(request: HttpRequest) -> HttpResponse:
    list_station = pd.read_sql(
        'SELECT * \
            FROM location_station \
                WHERE "location" is not NULL ORDER BY station_id ASC;',
        engine,
    )

    class ChoiceForm(forms.Form):
        list_details: list[tuple[str | int, str]] = [
            ("-", "----Выбрать элемент----")
        ]
        for idx, row in list_station.iterrows():
            doc_name = (
                f" - {row['document']}" if row["document"] is not None else ""
            )
            x = (row["station_id"], f"IVEA{row['station_id']}{doc_name}")
            list_details.append(x)
        choice_id = forms.ChoiceField(
            choices=list_details,
            label="Поиск станции:",
            widget=forms.Select(
                attrs={
                    "required": "required",
                    "onchange": "document.getElementById('update').submit()",
                    "style": "width:50%",
                    "class": "form-control select2 my-custom-select",
                }
            ),
        )

    if request.method == "POST":
        form = ChoiceForm(request.POST)
        choice_id: str | None = request.POST.get("choice_id")
    else:
        form = ChoiceForm()
        choice_id = ""
    if "-" == choice_id:
        choice_id = ""
    return render(
        request,
        "main/map.html",
        context={"form": form, "choice_id": choice_id},
    )


def user_login(
    request: HttpRequest, next_page: str = "home"
) -> HttpResponse | HttpResponseRedirect | HttpResponsePermanentRedirect:
    if request.method == "POST":
        form = UserLoginForms(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect(request.POST.get("login_next", ""))
    else:
        form = UserLoginForms()
        next_page = (
            request.GET.get("next", "")
            if request.GET.get("next") is not None
            else "home"
        )
    return render(
        request,
        "main/login.html",
        context={"form": form, "next_page": next_page},
    )


def user_logout(
    request: HttpRequest,
) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
    logout(request)
    return redirect("home")


def add_pocup_oborud(request: HttpRequest) -> HttpResponse:
    table = accounting_for_purchased_equipment.objects
    form = accounting_for_purchased_equipment_form()
    return add_one_value(request, table, form)


def add_uslug_i_oborud_description(request: HttpRequest) -> HttpResponse:
    table = accounting_of_services_and_equipment_description.objects
    form = accounting_of_services_and_equipment_description_form()
    return add_one_value(request, table, form, get_name="description")


def add_uslug_i_oborud(request: HttpRequest) -> HttpResponse:
    table = accounting_of_services_and_equipment.objects
    form = accounting_of_services_and_equipment_form()
    return add_one_value(request, table, form)


def add_one_value(
    request: HttpRequest, table: Any, form: Any, get_name: str = "name"
) -> HttpResponse:
    try:
        table_name = (
            str(form)
            .split('<label for="id_name">Наименование ')[1]
            .split(":</label></th>")[0]
        )
    except Exception:
        table_name = ""
    if request.method == "POST":
        if get_name == "name":
            name = request.POST.get("name")
            if table.filter(name=name).exists() is not True:
                fail = True
                counter: int = 0
                while fail:
                    if counter == 1000:
                        messages.error(
                            request,
                            "Ошибка записи, пожалуйста повторите позже!",
                        )
                        break
                    try:
                        table.create(name=name)
                        messages.success(request, "Запись успешно добавлена.")
                        fail = False
                    except Exception as err:
                        print(err)
                    counter += 1
            else:
                messages.error(request, "Такая запись уже присутствует.")
        elif get_name == "description":
            if (
                table.filter(
                    description=request.POST.get("description")
                ).exists()
                is not True
            ):
                # print('description= ', request.POST.get('description'))
                # print('services= ', request.POST.getlist('services'))
                table.create(
                    description=request.POST.get("description"),
                    services=request.POST.getlist("services"),
                )
                messages.success(request, "Запись успешно добавлена.")
            else:
                messages.error(request, "Такая запись уже присутствует.")
    return render(
        request,
        "main/add_one_value.html",
        context={"form": form, "table": table.all(), "table_name": table_name},
    )


def create_new_equipment(request: HttpRequest) -> HttpResponse:
    redirect_name = request.POST.get("redirect")

    if not redirect_name:
        redirect_name = "afpe"

    if request.method == "POST":
        name = request.POST.get("name")

        if not name:
            messages.error(request, "Пустое имя")
        elif accounting_for_purchased_equipment.objects.filter(
            name=name
        ).exists():
            messages.error(
                request,
                "Оборудование с таким наименованием уже существует",
            )
        else:
            accounting_for_purchased_equipment.objects.create(
                name=name,
            )
            messages.success(request, "Добавлено")

    return redirect(redirect_name)


class DetailCreateView(CreateView[details, DetailCreateForm]):
    model = details
    template_name = "main/create_detail.html"
    success_url = reverse_lazy("details")
    form_class = DetailCreateForm

    def form_valid(
        self,
        form: Any,
    ) -> HttpResponseRedirect | HttpResponsePermanentRedirect:
        detail = form.save(commit=False)

        yandex_paths = list()
        if form.cleaned_data.get("file"):
            upload_manager = UploadManager("disk:/detail_documents/")

            dir_path = upload_manager.mkdir(detail.name.name)

            files = [file.file for file in form.cleaned_data["file"]]
            filenames = [str(file) for file in form.cleaned_data["file"]]

            yandex_paths = upload_manager.upload_all(
                files,
                filenames,
                dir_path,
            )

        detail.yandex_file_paths = yandex_paths
        detail.save()

        return redirect("details")


class ProjectEquipmentListView(ListView[ProjectEquipment]):
    model = ProjectEquipment
    template_name = "main/project_equipment_list.html"
    context_object_name = "equipments"


class ProjectEquipmentCreateView(
    CreateView[ProjectEquipment, ProjectEquipmentCreateForm]
):
    model = ProjectEquipment
    form_class = ProjectEquipmentCreateForm
    template_name = "main/create_project_equipment.html"
    success_url = reverse_lazy("project_equipment_list")


def document_path_generator(request: HttpRequest) -> JsonResponse:
    if request.method == "POST":
        body = json.loads(request.body.decode("utf-8"))
        path = body.get("path")

        link = DownloadManager().get_download_link(path=path)

        return JsonResponse({"status": True, "path": link})
    else:
        return JsonResponse(
            {"status": False, "msg": "Only POST/DELETE method!"}
        )


def delete_detail_document(request: HttpRequest) -> JsonResponse:
    if request.method == "POST":
        body = json.loads(request.body.decode("utf-8"))
        detail_name = body.get("detail_name")
        path = body.get("path")

        detail_list = details.objects.filter(name__name=detail_name)

        if not detail_list.exists():
            return JsonResponse(
                {
                    "status": False,
                    "msg": "Деталь не найдена. Обратитесь к разработчику",
                }
            )

        detail = detail_list.first()
        if not detail:
            raise ValueError("Деталь не найдена. Обратитесь к разработчику")

        detail.yandex_file_paths.remove(path)
        detail.save()
        UploadManager("disk:/detail_documents/").delete(path=path)

        response_detail: dict[str, Any] = {
            "name": str(detail.name.name),
            "document_paths": detail.yandex_file_paths,
        }

        return JsonResponse(
            {
                "status": True,
                "msg": "Документ удалён!",
                "detail": response_detail,
            }
        )
    else:
        return JsonResponse(
            {"status": False, "msg": "Only POST/DELETE method!"}
        )


def update_detail_document(
    request: HttpRequest,
) -> HttpResponseRedirect | HttpResponseRedirect:
    if request.method == "POST":
        documents = request.FILES.getlist("document")

        if not documents:
            messages.add_message(request, 50, "Документы не указаны")
            return redirect("details")

        detail_name = request.POST.get("detail_name")
        if not detail_name:
            messages.add_message(request, 50, "Ошибка передачи имени детали")
            return redirect("details")

        detail_list = details.objects.filter(name__name=detail_name)

        if not detail_list.exists():
            messages.add_message(request, 50, "Не удаётся найти имя детали")
            return redirect("details")

        detail = detail_list.first()

        if not detail:
            raise ValueError("Деталь не найдена")

        upload_manager = UploadManager("disk:/detail_documents/")
        dir_path = upload_manager.mkdir(detail.name.name)

        files = [file.file for file in documents if file.file is not None]
        filenames = [str(file) for file in documents if file.file is not None]

        paths = upload_manager.upload_all(
            files,
            filenames,
            dir_path,
        )

        detail.yandex_file_paths.extend(paths)
        detail.save()

        messages.add_message(request, 100, "Сохранено")
        return redirect("details")
    else:
        messages.add_message(request, 50, "Поддерживается только POST метод!")
        return redirect("details")


class DetailListView(ListView[details]):
    model = details
    template_name = "main/details.html"
    context_object_name = "details"


def details_def(request: HttpRequest) -> HttpResponse:
    model_obj: Any = accounting_for_purchased_equipment.objects

    class ChoiceForm(forms.Form):
        list_details: list[tuple[int | str, str]] = [
            ("-", "----Выбрать элемент----")
        ]
        for item in model_obj.all():
            x = (item.id, item.name)
            list_details.append(x)
        choice_id = forms.ChoiceField(
            choices=list_details,
            label="Наименование детали",
            widget=forms.Select(
                attrs={
                    "required": "required",
                    "onchange": "document.getElementById('update').submit()",
                    "style": "width:50%; font-size: 14px;",
                    "class": "form-control select2",
                }
            ),
        )

    if request.method == "POST":
        # print(request.POST)
        form = ChoiceForm(request.POST)
        choice_id: str | int = request.POST.get("choice_id", "0")
        if request.POST.get("save") is not None:  # form.is_valid():
            if request.POST.get("link") is not None:  # form.is_valid():
                name: Any = request.POST.get("name", "")
                if (
                    details.objects.filter(
                        link=request.POST.get("link", ""),
                        name=name,
                    ).exists()
                    is not True
                ):
                    if details.objects.filter(name=name).exists() is not True:
                        form_save = details_form(request.POST)
                        form_save.save()
                    else:
                        edit_link: Any = details.objects.get(name=name)
                        edit_link.link = request.POST.get("link", "")
                        edit_link.save()
                    messages.success(request, "Запись успешно добавлена.")
                else:
                    messages.error(request, "Такая запись уже есть!")
            else:
                messages.error(request, "Вы не ввели ссылку.")
        elif request.POST.get("save_new_purchased") is not None:
            if (
                model_obj.filter(name=request.POST.get("name")).exists()
                is not True
            ):
                model_obj.create(name=request.POST.get("name", ""))
                messages.success(request, "Запись успешно добавлена.")
            else:
                messages.error(request, "Такая запись уже присутствует.")
        elif request.POST.get("rename") is not None:
            form = ChoiceForm(request.POST)
            choice_id = request.POST.get("choice_id", "0")
            if (
                model_obj.filter(name=request.POST.get("rename")).exists()
                is not True
            ):
                choice_id = request.POST.get("pk", "")
                rename = model_obj.get(pk=choice_id)
                rename.name = request.POST.get("rename", "")
                rename.save()
                messages.success(request, "Запись успешно изменена.")
            else:
                messages.error(request, "Такое наименование уже присутствует.")
    else:
        form = ChoiceForm()
        choice_id = "1"
    return render(
        request,
        "main/details.html",
        context={
            "form": form,
            "text": str(model_obj.get(pk=choice_id)),
            "table": details.objects.all(),
            "table_name": "детали",
            "choice_id": choice_id,
        },
    )


def choice(request: HttpRequest, model_obj: Any, label: Any) -> Any:
    class ChoiceForm(forms.Form):
        list_under_the_node = []
        for item in model_obj.all():
            x = (item.id, item.name)
            list_under_the_node.append(x)
        choice_id = forms.ChoiceField(
            choices=list_under_the_node,
            label=label,
            widget=forms.Select(
                attrs={
                    "required": "required",
                    "size": "1",
                    "onchange": "document.getElementById('update').submit()",
                    "style": "width:400px",
                    "class": "form-control select2",
                }
            ),
        )

    if request.method == "POST":
        if request.POST.get("save_all") is not None:
            form = ChoiceForm(request.POST)
            choice_id: str | int = request.POST.get("choice_id", "0")
            if (
                model_obj.filter(name=request.POST.get("name")).exists()
                is not True
            ):
                model_obj.create(name=request.POST.get("name"))
                messages.success(request, "Запись успешно добавлена.")
            else:
                messages.error(request, "Такая запись уже присутствует.")
        elif request.POST.get("rename") is not None:
            form = ChoiceForm(request.POST)
            choice_id = request.POST.get("choice_id", "0")
            if (
                model_obj.filter(name=request.POST.get("rename")).exists()
                is not True
            ):
                pk = request.POST.get("pk")
                rename = model_obj.get(pk=pk)
                rename.name = request.POST.get("rename")
                rename.save()
                messages.success(request, "Запись успешно изменена.")
            else:
                messages.error(request, "Такое наименование уже присутствует.")
        else:
            form = ChoiceForm(request.POST)
            choice_id = request.POST.get("choice_id", "0")
    else:
        first_id = "0"
        form = ChoiceForm()
        try:
            for item in model_obj.all():
                if first_id == "0":
                    first_id = str(item.id)
                    break
        except ValueError:
            pass
        choice_id = first_id
    return form, choice_id


def choice_poduzel(request: HttpRequest) -> HttpResponse:
    label = "Выбор подузла"
    model_obj: Any = under_the_node.objects
    form, choice_id = choice(request, model_obj, label)
    saved_choice_id = request.session.get("__choice_id", None)
    if saved_choice_id:
        choice_id = saved_choice_id
        form.fields["choice_id"].initial = choice_id
        del request.session["__choice_id"]
    obj1 = utn_details.objects.filter(belongs_id=choice_id)
    obj2 = utn_purchased.objects.filter(belongs_id=choice_id)
    return render(
        request,
        "main/object_assembly/choice.html",
        context={
            "form": form,
            "text": str(model_obj.get(pk=choice_id)),
            "obj1": obj1,
            "obj2": obj2,
            "choice_id": choice_id,
            "url": reverse("edit_under_the_node"),
            "title": "Подузел",
            "report_url": reverse("report_under_the_node"),
        },
    )


def create_poduzel(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        name = request.POST.get("name")
        if not name:
            messages.error(request, "Имя не указано")
        elif under_the_node.objects.filter(name=name).exists():
            messages.error(request, "Подузел с таким именем уже существует")
            instance = under_the_node.objects.filter(name=name).first()
            if instance:
                request.session["__choice_id"] = instance.pk
        else:
            new_item = under_the_node.objects.create(name=name)
            messages.success(request, "Подузел успешно создан")
            request.session["__choice_id"] = new_item.pk

    return redirect("utn")


def rename_poduzel(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        pk = request.POST.get("pk")
        new_name = request.POST.get("rename")

        if not pk or not new_name:
            messages.error(
                request, "Ошибка при отправке ключа или нового имени"
            )
        elif not under_the_node.objects.filter(pk=pk).exists():
            messages.error(request, "Не найден подузел для редактирования")
        elif under_the_node.objects.filter(name=new_name).exists():
            messages.error(
                request, "Подузел с таким наименованием уже существует"
            )
            instance = under_the_node.objects.filter(name=new_name).first()
            if instance:
                request.session["__choice_id"] = instance.pk
        else:
            instance = under_the_node.objects.filter(pk=pk).first()
            if instance:
                instance.name = new_name
                instance.save()
                messages.success(request, "Узел переименован")
                request.session["__choice_id"] = instance.pk

    return redirect("utn")


def choice_uzel(request: HttpRequest) -> HttpResponse:
    label = "Выбор узла"
    model_obj: Any = unit.objects
    form, choice_id = choice(request, model_obj, label)
    saved_choice_id = request.session.get("__choice_id", None)
    if saved_choice_id:
        choice_id = saved_choice_id
        form.fields["choice_id"].initial = choice_id
        del request.session["__choice_id"]
    obj1 = unit_details.objects.filter(belongs_id=choice_id)
    obj2 = unit_purchased.objects.filter(belongs_id=choice_id)
    obj3 = unit_under_the_node.objects.filter(belongs_id=choice_id)
    return render(
        request,
        "main/object_assembly/choice.html",
        context={
            "form": form,
            "text": str(model_obj.get(pk=choice_id)),
            "obj1": obj1,
            "obj2": obj2,
            "obj3": obj3,
            "choice_id": choice_id,
            "url": reverse("edit_unit"),
            "title": "Узел",
            "report_url": reverse("report_unit"),
        },
    )


def rename_uzel(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        pk = request.POST.get("pk")
        new_name = request.POST.get("rename")

        if not pk or not new_name:
            messages.error(
                request, "Ошибка при отправке ключа или нового имени"
            )
        elif not unit.objects.filter(pk=pk).exists():
            messages.error(request, "Не найден узел для редактирования")
        elif unit.objects.filter(name=new_name).exists():
            messages.error(
                request, "Узел с таким наименованием уже существует"
            )
            instance = unit.objects.filter(name=new_name).first()
            if instance:
                request.session["__choice_id"] = instance.pk
        else:
            instance = unit.objects.filter(pk=pk).first()
            if instance:
                instance.name = new_name
                instance.save()
                messages.success(request, "Узел переименован")
                request.session["__choice_id"] = instance.pk

    return redirect("unit")


def choice_assembly_unit(request: HttpRequest) -> HttpResponse:
    label = "Выбор cборочной единицы"
    model_obj: Any = assembly_unit.objects
    form, choice_id = choice(request, model_obj, label)
    saved_choice_id = request.session.get("__choice_id", None)
    if saved_choice_id:
        choice_id = saved_choice_id
        form.fields["choice_id"].initial = choice_id
        del request.session["__choice_id"]
    obj1: Any = assembly_unit_details.objects.filter(belongs_id=choice_id)
    obj2: Any = assembly_unit_purchased.objects.filter(belongs_id=choice_id)
    obj3: Any = assembly_unit_under_the_node.objects.filter(
        belongs_id=choice_id
    )
    obj4: Any = assembly_unit_unit.objects.filter(belongs_id=choice_id)
    return render(
        request,
        "main/object_assembly/choice.html",
        context={
            "form": form,
            "text": str(model_obj.get(pk=choice_id)),
            "obj1": obj1,
            "obj2": obj2,
            "obj3": obj3,
            "obj4": obj4,
            "choice_id": choice_id,
            "url": reverse("edit_assembly_unit"),
            "title": "Сборочная единица",
            "report_url": reverse("report_assembly_unit"),
        },
    )


def rename_assembly_unit(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        pk = request.POST.get("pk")
        new_name = request.POST.get("rename")

        if not pk or not new_name:
            messages.error(
                request, "Ошибка при отправке ключа или нового имени"
            )
        elif not assembly_unit.objects.filter(pk=pk).exists():
            messages.error(
                request, "Не найдена сборочная единица для редактирования"
            )
        elif assembly_unit.objects.filter(name=new_name).exists():
            messages.error(
                request,
                "Сборочная единица с таким наименованием уже существует",
            )
            instance = assembly_unit.objects.filter(name=new_name).first()
            if instance:
                request.session["__choice_id"] = instance.pk
        else:
            instance = assembly_unit.objects.filter(pk=pk).first()
            if instance:
                instance.name = new_name
                instance.save()
                messages.success(request, "Сборочная единица переименована")
                request.session["__choice_id"] = instance.pk

    return redirect("assembly_unit")


def choice_object_assembly(request: HttpRequest) -> HttpResponse:
    global data_list
    data_list = {"details": {}, "purchased": {}, "assembly_unit": {}}
    info = pd.read_sql_query(
        "SELECT id, short_name FROM documents ORDER BY id DESC;", engine
    )

    class ObjectAssemblyForm(forms.Form):
        list_choice = []
        for i in range(len(info)):
            select_label = f'{info.loc[i, "id"]} | {info.loc[i, "short_name"]}'
            list_choice.append((info.loc[i, "id"], select_label))
        choice_id = forms.ChoiceField(
            choices=list_choice,
            label="Выбор объектной сборки",
            widget=forms.Select(
                attrs={
                    "required": "required",
                    "size": "1",
                    "onchange": "document.getElementById('update').submit()",
                    "style": "width:400px",
                    "class": "form-control select2",
                }
            ),
        )

    if request.method == "POST":
        form = ObjectAssemblyForm(request.POST)
        choice_id: str | int = request.POST.get("choice_id", "0")
    else:
        form = ObjectAssemblyForm()
        choice_id = str(info.loc[0, "id"])
    obj1: Any = object_assembly_assembly_unit.objects.filter(belongs=choice_id)
    purchased: Any = object_assembly_purchased.objects.filter(
        belongs=choice_id
    )
    details: Any = object_assembly_details.objects.filter(belongs=choice_id)
    obj3: Any = object_assembly_under_the_node.objects.filter(
        belongs=choice_id
    )
    obj4: Any = object_assembly_unit.objects.filter(belongs=choice_id)

    items_assembly_unit(obj1)
    items_details(details)
    items_purchased(purchased)
    return render(
        request,
        "main/object_assembly/choice.html",
        context={
            "form": form,
            "text": "",
            "obj1": obj1,
            "purchased": data_list["purchased"],
            "details": data_list["details"],
            "obj4": obj4,
            "obj3": obj3,
            "choice_id": choice_id,
            "data": data_list,
            "url": reverse("edit_object_assembly"),
            "title": "Объектная сборка",
            "report_url": reverse("report"),
        },
    )


# общая функция для изменения списков
def edit_general(request: HttpRequest, model_obj: Any, name_model: Any) -> Any:
    global data_list
    username = str(request.user.username)  # Узнаем имя пользователя.
    if (
        request.POST.get("choice_id") is not None
    ):  # На всякий случай проверяем выбрали ли мы что...
        # это всё срабатывает только в момент
        # перехода из выбова в редактирование
        if (
            username in user_triger
        ):  # Проверка били ли записи от этого пользователя
            user_triger.pop(username)  # обнуляем чтобы небыло недопониманий
        obj: Any = model_obj.filter(
            pk=request.POST.get("choice_id")
        )  # находим в нужной моделе нужную запись
        user_triger[username] = {
            "pk": request.POST.get("choice_id"),
            "edit": "details",
            "name": obj[0].name,
        }  # записываем всё в словарь, ключем выступает имя пользователя
        data_list = {
            "data": {
                "purchased": {},
                "poduzel": {},
                "uzel": {},
                "details": {},
            },
            "add": {"purchased": {}, "poduzel": {}, "uzel": {}, "details": {}},
            "del": {"purchased": {}, "poduzel": {}, "uzel": {}, "details": {}},
        }

    if request.method == "POST":
        if request.POST.get("edit") == "purchased" or (
            request.POST.get("edit") is None
            and user_triger[username]["edit"] == "purchased"
        ):
            user_triger[username]["edit"] = "purchased"
            obj = accounting_for_purchased_equipment.objects
            if name_model == "under_the_node":
                obj2: Any = utn_purchased.objects
            elif name_model == "unit":
                obj2 = unit_purchased.objects
            elif name_model == "assembly_unit":
                obj2 = assembly_unit_purchased.objects
        elif request.POST.get("edit") == "details" or (
            request.POST.get("edit") is None
            and user_triger[username]["edit"] == "details"
        ):
            user_triger[username]["edit"] = "details"
            obj = details.objects
            if name_model == "under_the_node":
                obj2 = utn_details.objects
            elif name_model == "unit":
                obj2 = unit_details.objects
            elif name_model == "assembly_unit":
                obj2 = assembly_unit_details.objects
        elif request.POST.get("edit") == "poduzel" or (
            request.POST.get("edit") is None
            and user_triger[username]["edit"] == "poduzel"
        ):
            user_triger[username]["edit"] = "poduzel"
            obj = under_the_node.objects
            if name_model == "unit":
                obj2 = unit_under_the_node.objects
            elif name_model == "assembly_unit":
                obj2 = assembly_unit_under_the_node.objects
        elif request.POST.get("edit") == "uzel" or (
            request.POST.get("edit") is None
            and user_triger[username]["edit"] == "uzel"
        ):
            user_triger[username]["edit"] = "uzel"
            obj = unit.objects
            obj2 = assembly_unit_unit.objects
        if request.POST.get("edit") is not None:
            data_list["add"][user_triger[username]["edit"]] = {}
            data_list["del"][user_triger[username]["edit"]] = {}
            data_list["data"][user_triger[username]["edit"]] = {}
            for items in obj2.filter(belongs_id=user_triger[username]["pk"]):
                if request.POST.get("edit") == "details" or (
                    request.POST.get("edit") is None
                    and user_triger[username]["edit"] == "details"
                ):
                    data_list["data"][user_triger[username]["edit"]][
                        items.name.name.name
                    ] = {"quantity": items.quantity, "unit": items.unit}
                else:
                    data_list["data"][user_triger[username]["edit"]][
                        items.name.name
                    ] = {"quantity": items.quantity, "unit": items.unit}
        if request.POST.get("name_add") is not None:
            data_list["data"][user_triger[username]["edit"]][
                request.POST.get("name_add")
            ] = {
                "quantity": request.POST.get("kol-vo"),
                "unit": request.POST.get("unit"),
            }
            data_list["add"][user_triger[username]["edit"]][
                request.POST.get("name_add")
            ] = {
                "quantity": request.POST.get("kol-vo"),
                "unit": request.POST.get("unit"),
            }
        if request.POST.get("name_del") is not None:
            data_list["data"][user_triger[username]["edit"]].pop(
                request.POST.get("name_del")
            )
            if (
                request.POST.get("name_del")
                in data_list["add"][user_triger[username]["edit"]]
            ):
                data_list["add"][user_triger[username]["edit"]].pop(
                    request.POST.get("name_del")
                )
                data_list["del"][user_triger[username]["edit"]][
                    request.POST.get("name_del")
                ] = False
            else:
                data_list["del"][user_triger[username]["edit"]][
                    request.POST.get("name_del")
                ] = True
        if request.POST.get("save") is not None:
            for key in data_list["del"][user_triger[username]["edit"]]:
                if data_list["del"][user_triger[username]["edit"]][key]:
                    if (
                        user_triger[username]["edit"] == "purchased"
                        or user_triger[username]["edit"] == "details"
                    ):
                        get_id = (
                            accounting_for_purchased_equipment.objects.get(
                                name=key
                            ).pk
                        )
                    elif user_triger[username]["edit"] == "poduzel":
                        get_id = under_the_node.objects.get(name=key).pk
                    elif user_triger[username]["edit"] == "uzel":
                        get_id = unit.objects.get(name=key).pk
                    obj2.filter(
                        belongs_id=user_triger[username]["pk"], name_id=get_id
                    ).delete()
            for key in data_list["add"][user_triger[username]["edit"]]:
                value = data_list["add"][user_triger[username]["edit"]][key]
                if (
                    user_triger[username]["edit"] == "purchased"
                    or user_triger[username]["edit"] == "details"
                ):
                    get_id = accounting_for_purchased_equipment.objects.get(
                        name=key
                    ).pk
                elif user_triger[username]["edit"] == "poduzel":
                    get_id = under_the_node.objects.get(name=key).pk
                elif user_triger[username]["edit"] == "uzel":
                    get_id = unit.objects.get(name=key).pk
                if (
                    obj2.filter(
                        name_id=get_id, belongs_id=user_triger[username]["pk"]
                    ).exists()
                    is not True
                ):
                    obj2.create(
                        name_id=get_id,
                        belongs_id=user_triger[username]["pk"],
                        quantity=value["quantity"],
                        unit=value["unit"],
                    )
                elif (
                    obj2.filter(
                        name_id=get_id,
                        belongs_id=user_triger[username]["pk"],
                        quantity=value["quantity"],
                        unit=value["unit"],
                    ).exists()
                    is not True
                ):
                    edit_obj: Any = obj2.get(
                        name_id=get_id, belongs_id=user_triger[username]["pk"]
                    )
                    edit_obj.quantity = value["quantity"]
                    edit_obj.unit = value["unit"]
                    edit_obj.save()
    return obj


def edit_poduzel(request: HttpRequest) -> HttpResponse:
    global data_list
    username = str(request.user.username)
    obj: Any = edit_general(request, under_the_node.objects, "under_the_node")
    return render(
        request,
        "main/object_assembly/poduzel.html",
        context={
            "edit": user_triger[username]["edit"],
            "data": data_list["data"],
            "name_poduzel": user_triger[username]["name"],
            "obj": obj.all(),
            "model": 1,
        },
    )


def edit_uzel(request: HttpRequest) -> HttpResponse:
    global data_list
    username = str(request.user.username)
    obj: Any = edit_general(request, unit.objects, "unit")
    return render(
        request,
        "main/object_assembly/poduzel.html",
        context={
            "edit": user_triger[username]["edit"],
            "data": data_list["data"],
            "name_poduzel": user_triger[username]["name"],
            "obj": obj.all(),
            "model": 2,
        },
    )


def edit_assembly_unit(request: HttpRequest) -> HttpResponse:
    global data_list
    username = str(request.user.username)
    obj: Any = edit_general(request, assembly_unit.objects, "assembly_unit")
    return render(
        request,
        "main/object_assembly/poduzel.html",
        context={
            "edit": user_triger[username]["edit"],
            "data": data_list["data"],
            "name_poduzel": user_triger[username]["name"],
            "obj": obj.all(),
            "model": 3,
        },
    )


def x(request: HttpRequest, edit: str, obj2: Any) -> None:
    global data_object_assembly_list
    username = str(request.user.username)
    if request.POST.get("edit") is not None:
        data_object_assembly_list["add"][edit] = {}
        data_object_assembly_list["del"][edit] = {}
        data_object_assembly_list["data"][edit] = {}
        try:
            for items in obj2.filter(belongs=user_triger[username]["pk"]):
                if edit in ["details"]:
                    data_object_assembly_list["data"][edit][
                        items.name.name.name
                    ] = items.quantity
                else:
                    data_object_assembly_list["data"][edit][
                        items.name.name
                    ] = items.quantity
        except Exception:
            pass
    # print(edit, '\n', data_object_assembly_list['data'])


def engineers_edit(  # type: ignore
    request: HttpRequest, doc_id: int | str = ""
) -> HttpResponse:
    username = str(request.user.username)
    if username in user_triger:
        user_triger.pop(username)
    if doc_id != "":
        info = pd.read_sql_query(
            f"SELECT short_name \
                       FROM documents \
                           WHERE id = '{doc_id}';",
            engine,
        )
        name: str = str(info.loc[0, "short_name"])
        objects: dict[str, dict[str, Any]] = {
            "1": {
                "obj": list(assembly_unit.objects.values("pk", "name")),
                "obj2": list(
                    object_assembly_assembly_unit.objects.filter(
                        belongs=doc_id
                    ).values("pk", "name")
                ),
            },
            "2": {
                "obj": list(
                    accounting_for_purchased_equipment.objects.values(
                        "pk", "name"
                    )
                ),
                "obj2": list(
                    object_assembly_purchased.objects.filter(
                        belongs=doc_id
                    ).values("pk", "name")
                ),
            },
            "3": {
                "obj": list(under_the_node.objects.values("pk", "name")),
                "obj2": list(
                    object_assembly_under_the_node.objects.filter(
                        belongs=doc_id
                    ).values("pk", "name")
                ),
            },
            "4": {
                "obj": list(unit.objects.values("pk", "name")),
                "obj2": list(
                    object_assembly_unit.objects.filter(belongs=doc_id).values(
                        "pk", "name"
                    )
                ),
            },
            "5": {
                "obj": list(
                    accounting_for_purchased_equipment.objects.values(
                        "pk", "name"
                    )
                ),
                "obj2": list(
                    object_assembly_details.objects.filter(
                        belongs=doc_id
                    ).values("pk", "name")
                ),
            },
        }
        # Преобразование данных в JSON и экранирование
        objects_json = json.dumps(objects)
        # user_triger[username] = {
        #     "pk": doc_id,
        #     "obj": {
        #         1: {
        #             'obj': assembly_unit.objects.all(),
        #             'obj2': object_assembly_assembly_unit.objects.filter(
        #                 belongs=doc_id
        #             ),
        #         },
        #         2: {
        #             'obj': accounting_for_purchased_equipment.objects,
        #             'obj2': object_assembly_purchased.objects.filter(
        #                 belongs=doc_id
        #             ),
        #         },
        #         3: {
        #             'obj': under_the_node.objects.all(),
        #             'obj2': object_assembly_under_the_node.objects.filter(
        #                 belongs=doc_id
        #             ),
        #         },
        #         4: {
        #             'obj': unit.objects.all(),
        #             'obj2': object_assembly_unit.objects.filter(
        #                 belongs=doc_id
        #             ),
        #         },
        #         5: {
        #             'obj': details.objects.all(),
        #             'obj2': object_assembly_details.objects.filter(
        #                 belongs=doc_id
        #             ),
        #         },
        #     },
        #     "name": info.loc[0, "short_name"],
        # }  #
        return render(
            request,
            "main/object_assembly/engineers_edit.html",
            context={
                "name": name,
                "objects": objects_json,
                "model": 4,
            },
        )
    else:
        pass


def edit_object_assembly(request: HttpRequest) -> HttpResponse:
    global data_object_assembly_list
    global data_list
    username = str(request.user.username)
    if request.POST.get("choice_id") is not None:
        if username in user_triger:
            user_triger.pop(username)
        info = pd.read_sql_query(
            f"SELECT short_name \
                FROM documents \
                    WHERE id = {request.POST.get('choice_id')};",
            engine,
        )
        user_triger[username] = {
            "pk": request.POST.get("choice_id"),
            "edit": "assembly_unit",
            "name": info.loc[0, "short_name"],
        }  #
        data_object_assembly_list = {
            "data": {
                "purchased": {},
                "details": {},
                "assembly_unit": {},
                "project_equipment": {},
            },
            "add": {
                "purchased": {},
                "details": {},
                "assembly_unit": {},
                "project_equipment": {},
            },
            "del": {
                "purchased": {},
                "details": {},
                "assembly_unit": {},
                "project_equipment": {},
            },
        }
        # print(user_triger[username]['name'])
    # Принимаем что мы должны редактировать
    if request.POST.get("edit") == "purchased" or (
        request.POST.get("edit") is None
        and user_triger[username]["edit"] == "purchased"
    ):
        # Перестраховываемся и пересохраняем
        user_triger[username]["edit"] = "purchased"
        # Заполняем переменные "obj" данными из БД
        obj: Any = accounting_for_purchased_equipment.objects
        obj2: Any = object_assembly_purchased.objects
        # Выполняем общее действие
        x(request, "purchased", obj2)
    elif request.POST.get("edit") == "details" or (
        request.POST.get("edit") is None
        and user_triger[username]["edit"] == "details"
    ):
        user_triger[username]["edit"] = "details"
        obj = details.objects
        obj2 = object_assembly_details.objects
        x(request, "details", obj2)
    elif request.POST.get("edit") == "uzel" or (
        request.POST.get("edit") is None
        and user_triger[username]["edit"] == "uzel"
    ):
        user_triger[username]["edit"] = "uzel"
        obj = unit.objects
        obj2 = object_assembly_unit.objects
        x(request, "uzel", obj2)
    elif request.POST.get("edit") == "poduzel" or (
        request.POST.get("edit") is None
        and user_triger[username]["edit"] == "poduzel"
    ):
        user_triger[username]["edit"] = "poduzel"
        obj = under_the_node.objects
        obj2 = object_assembly_under_the_node.objects
        x(request, "poduzel", obj2)
    elif request.POST.get("edit") == "assembly_unit" or (
        request.POST.get("edit") is None
        and user_triger[username]["edit"] == "assembly_unit"
    ):
        user_triger[username]["edit"] = "assembly_unit"
        obj = assembly_unit.objects
        obj2 = object_assembly_assembly_unit.objects
        x(request, "assembly_unit", obj2)
        x(request, "purchased", object_assembly_purchased.objects)
        x(request, "details", object_assembly_details.objects)
    elif (
        request.POST.get("edit") == "project_equipment"
        or request.POST.get("edit") is None
        and user_triger[username]["edit"] == "project_equipment"
    ):
        user_triger[username]["edit"] = "project_equipment"
        obj = ProjectEquipment.objects
        obj2 = object_assembly_project_equipment.objects
        x(request, "project_equipment", obj2)

    # Принимаем переменную для добавления
    """Надо предусмотреть тот момент, если у нас было добавлено,
    надо только плюсануть количество."""
    if request.POST.get("name_add") is not None:
        if request.POST.get("edit") == "assembly_unit" or (
            request.POST.get("edit") is None
            and user_triger[username]["edit"] == "assembly_unit"
        ):
            quantity: str = request.POST.get("kol-vo", "0")
            report_assembly_unit(request, True, int(quantity))
            for edit in ["purchased", "details"]:
                for name in data_list[edit]:
                    if name in data_object_assembly_list["data"][edit].keys():
                        if isinstance(
                            data_object_assembly_list["data"][edit][name], dict
                        ):
                            data_object_assembly_list["data"][edit][name][
                                "quantity"
                            ] += data_list[edit][name]["quantity"]
                        else:
                            data_object_assembly_list["data"][edit][
                                name
                            ] += data_list[edit][name]["quantity"]
                    else:
                        data_object_assembly_list["data"][edit].update(
                            data_list[edit]
                        )
                    if name in data_object_assembly_list["add"][edit].keys():
                        if isinstance(
                            data_object_assembly_list["add"][edit][name], dict
                        ):
                            data_object_assembly_list["add"][edit][name][
                                "quantity"
                            ] += data_list[edit][name]["quantity"]
                        else:
                            data_object_assembly_list["add"][edit][
                                name
                            ] += data_list[edit][name]["quantity"]
                    else:
                        new_name = data_object_assembly_list["data"][edit][
                            name
                        ]
                        data_object_assembly_list["add"][edit].update(
                            {name: new_name}
                        )
            data_object_assembly_list["data"]["assembly_unit"][
                request.POST.get("name_add")
            ] = quantity
            data_object_assembly_list["add"]["assembly_unit"][
                request.POST.get("name_add")
            ] = quantity
        else:
            data_object_assembly_list["data"][user_triger[username]["edit"]][
                request.POST.get("name_add")
            ] = request.POST.get("kol-vo")
            data_object_assembly_list["add"][user_triger[username]["edit"]][
                request.POST.get("name_add")
            ] = request.POST.get("kol-vo")
    # Принимаем переменную что нужно удалить
    if request.POST.get("edit") == "assembly_unit" or (
        request.POST.get("edit") is None
        and user_triger[username]["edit"] == "assembly_unit"
    ):
        if request.POST.get("name_del") is not None:  # оборудование
            data_object_assembly_list["data"]["purchased"].pop(
                request.POST.get("name_del")
            )
            if (
                request.POST.get("name_del")
                in data_object_assembly_list["add"]["purchased"]
            ):
                data_object_assembly_list["add"]["purchased"].pop(
                    request.POST.get("name_del")
                )
                data_object_assembly_list["del"]["purchased"][
                    request.POST.get("name_del")
                ] = False
            else:
                data_object_assembly_list["del"]["purchased"][
                    request.POST.get("name_del")
                ] = True

        elif request.POST.get("name_del1") is not None:  # Details
            data_object_assembly_list["data"]["details"].pop(
                request.POST.get("name_del1")
            )
            if (
                request.POST.get("name_del1")
                in data_object_assembly_list["add"]["details"]
            ):
                data_object_assembly_list["add"]["details"].pop(
                    request.POST.get("name_del1")
                )
                data_object_assembly_list["del"]["details"][
                    request.POST.get("name_del1")
                ] = False
            else:
                data_object_assembly_list["del"]["details"][
                    request.POST.get("name_del1")
                ] = True
        elif request.POST.get("name_del2") is not None:  # assembly_unit
            data_object_assembly_list["data"]["assembly_unit"].pop(
                request.POST.get("name_del2")
            )
            if (
                request.POST.get("name_del2")
                in data_object_assembly_list["add"]["assembly_unit"]
            ):
                data_object_assembly_list["add"]["assembly_unit"].pop(
                    request.POST.get("name_del2")
                )
                data_object_assembly_list["del"]["assembly_unit"][
                    request.POST.get("name_del2")
                ] = False
            else:
                data_object_assembly_list["del"]["assembly_unit"][
                    request.POST.get("name_del2")
                ] = True
    else:
        if request.POST.get("name_del") is not None:  # оборудование или детали
            data_object_assembly_list["data"][
                user_triger[username]["edit"]
            ].pop(request.POST.get("name_del"))
            if (
                request.POST.get("name_del")
                in data_object_assembly_list["add"][
                    user_triger[username]["edit"]
                ]
            ):
                data_object_assembly_list["add"][
                    user_triger[username]["edit"]
                ].pop(request.POST.get("name_del"))
                data_object_assembly_list["del"][
                    user_triger[username]["edit"]
                ][request.POST.get("name_del")] = False
            else:
                data_object_assembly_list["del"][
                    user_triger[username]["edit"]
                ][request.POST.get("name_del")] = True

    # Принимаем переменную которая говорит что нужно сохраняться
    if request.POST.get("save") is not None:
        if user_triger[username]["edit"] == "project_equipment":
            for key in data_object_assembly_list["del"][
                user_triger[username]["edit"]
            ]:
                get_id = obj.get(name=key).pk
                if data_object_assembly_list["del"][
                    user_triger[username]["edit"]
                ][key]:
                    obj2.filter(
                        belongs=user_triger[username]["pk"], name_id=get_id
                    ).delete()
            for key in data_object_assembly_list["add"][
                user_triger[username]["edit"]
            ]:
                get_id = obj.get(name=key).pk
                value = data_object_assembly_list["add"][
                    user_triger[username]["edit"]
                ][key]
                if not unit_purchased.objects.filter(
                    name=get_id, belongs=user_triger[username]["pk"]
                ).exists():
                    obj2.create(
                        belongs=user_triger[username]["pk"],
                        name_id=get_id,
                        quantity=value,
                    )
                else:
                    edit_obj: Any = obj2.get(
                        name_id=get_id, belongs=user_triger[username]["pk"]
                    )
                    edit_obj.quantity = value
                    edit_obj.save()
        if user_triger[username]["edit"] in ["poduzel", "uzel"]:
            for key in data_object_assembly_list["del"][
                user_triger[username]["edit"]
            ]:
                get_id = obj.get(name=key).pk
                if data_object_assembly_list["del"][
                    user_triger[username]["edit"]
                ][key]:
                    obj2.filter(
                        belongs=user_triger[username]["pk"], name_id=get_id
                    ).delete()
            for key in data_object_assembly_list["add"][
                user_triger[username]["edit"]
            ]:
                get_id = obj.get(name=key).pk
                value = data_object_assembly_list["add"][
                    user_triger[username]["edit"]
                ][key]
                if not unit_purchased.objects.filter(
                    name=get_id, belongs=user_triger[username]["pk"]
                ).exists():
                    obj2.create(
                        belongs=user_triger[username]["pk"],
                        name_id=get_id,
                        quantity=value,
                    )
                else:
                    edit_obj = obj2.get(
                        name_id=get_id, belongs=user_triger[username]["pk"]
                    )
                    edit_obj.quantity = value
                    edit_obj.save()
        if (
            user_triger[username]["edit"] == "purchased"
            or user_triger[username]["edit"] == "details"
        ):
            for key in data_object_assembly_list["del"][
                user_triger[username]["edit"]
            ]:
                get_id = accounting_for_purchased_equipment.objects.get(
                    name=key
                ).pk
                if data_object_assembly_list["del"][
                    user_triger[username]["edit"]
                ][key]:
                    obj2.filter(
                        belongs=user_triger[username]["pk"], name_id=get_id
                    ).delete()
            for key in data_object_assembly_list["add"][
                user_triger[username]["edit"]
            ]:
                get_id = accounting_for_purchased_equipment.objects.get(
                    name=key
                ).pk
                value = data_object_assembly_list["add"][
                    user_triger[username]["edit"]
                ][key]
                if (
                    obj2.filter(
                        name_id=get_id, belongs=user_triger[username]["pk"]
                    ).exists()
                    is not True
                ):
                    obj2.create(
                        belongs=user_triger[username]["pk"],
                        name_id=get_id,
                        quantity=value,
                    )
                elif (
                    obj2.filter(
                        name_id=get_id,
                        belongs=user_triger[username]["pk"],
                        quantity=value,
                    ).exists()
                    is not True
                ):
                    edit_obj = obj2.get(
                        name_id=get_id, belongs=user_triger[username]["pk"]
                    )
                    edit_obj.quantity = value
                    edit_obj.save()
        if user_triger[username]["edit"] == "assembly_unit":
            for edit in ["purchased", "details", "assembly_unit"]:
                seq = data_object_assembly_list["del"][edit]
                for key in seq:
                    # print(data_object_assembly_list['del'][edit])
                    # print(edit,'-',key)
                    if edit == "assembly_unit":
                        get_id = assembly_unit.objects.get(name=key).pk
                        tmp_model = object_assembly_assembly_unit
                        obj2 = tmp_model.objects
                    else:
                        if edit == "purchased":
                            obj2 = object_assembly_purchased.objects
                        else:
                            obj2 = object_assembly_details.objects
                        get_id = (
                            accounting_for_purchased_equipment.objects.get(
                                name=key
                            ).pk
                        )
                    if data_object_assembly_list["del"][edit][key]:
                        obj2.filter(
                            belongs=user_triger[username]["pk"], name_id=get_id
                        ).delete()
                for key in data_object_assembly_list["add"][edit]:
                    if edit == "assembly_unit":
                        get_id = assembly_unit.objects.get(name=key).pk
                        tmp_model = object_assembly_assembly_unit
                        obj2 = tmp_model.objects
                    else:
                        if edit == "purchased":
                            obj2 = object_assembly_purchased.objects
                        else:
                            obj2 = object_assembly_details.objects
                        get_id = (
                            accounting_for_purchased_equipment.objects.get(
                                name=key
                            ).pk
                        )
                    value = data_object_assembly_list["add"][edit][key]
                    if (
                        obj2.filter(
                            name_id=get_id, belongs=user_triger[username]["pk"]
                        ).exists()
                        is not True
                    ):
                        obj2.create(
                            belongs=user_triger[username]["pk"],
                            name_id=get_id,
                            quantity=value["quantity"]
                            if isinstance(value, dict)
                            else value,
                        )
                    elif (
                        obj2.filter(
                            name_id=get_id,
                            belongs=user_triger[username]["pk"],
                            quantity=value["quantity"]
                            if isinstance(value, dict)
                            else value,
                        ).exists()
                        is not True
                    ):
                        edit_obj = obj2.get(
                            name_id=get_id, belongs=user_triger[username]["pk"]
                        )
                        edit_obj.quantity = (
                            value["quantity"]
                            if isinstance(value, dict)
                            else value
                        )
                        edit_obj.save()

    return render(
        request,
        "main/object_assembly/edit2.html",
        context={
            "edit": user_triger[username]["edit"],
            "data": data_object_assembly_list["data"],
            "name_poduzel": user_triger[username]["name"],
            "obj": obj.all(),
            "model": 4,
        },
    )


# Составляем отчетную ведомость
def report_poduzel(request: HttpRequest) -> HttpResponse:
    global data_list
    data_list = {"details": {}, "purchased": {}}
    name = under_the_node.objects.get(
        pk=int(request.POST.get("choice_id", "0"))
    ).name
    object1 = utn_details.objects.filter(
        belongs_id=int(request.POST.get("choice_id", "0"))
    )
    object2 = utn_purchased.objects.filter(
        belongs_id=int(request.POST.get("choice_id", "0"))
    )
    if object1:
        items_details(object1)
    if object2:
        items_purchased(object2)
    return render(
        request,
        "main/object_assembly/report_object_assembly.html",
        context={
            "name": name,
            "data": data_list,
        },
    )


def report_unit(request: HttpRequest) -> HttpResponse:
    global data_list
    data_list = {"details": {}, "purchased": {}}
    name = unit.objects.get(pk=int(request.POST.get("choice_id", "0"))).name
    object1 = unit_under_the_node.objects.filter(
        belongs_id=int(request.POST.get("choice_id", "0"))
    )
    object2 = unit_details.objects.filter(
        belongs_id=int(request.POST.get("choice_id", "0"))
    )
    object3 = unit_purchased.objects.filter(
        belongs_id=int(request.POST.get("choice_id", "0"))
    )
    if object1:
        items_under_the_node(object1)
    if object2:
        items_details(object2)
    if object3:
        items_purchased(object3)
    return render(
        request,
        "main/object_assembly/report_object_assembly.html",
        context={
            "name": name,
            "data": data_list,
            "poduzels": unit_under_the_node.objects.filter(
                belongs_id=int(request.POST.get("choice_id", "0"))
            ),
        },
    )


def report_assembly_unit(
    request: HttpRequest,
    edit_object_assembly_bool: bool = False,
    quantity: int = 1,
) -> Any:
    global data_list
    data_list = {"details": {}, "purchased": {}}
    if edit_object_assembly_bool:
        choice_id: str | int = assembly_unit.objects.get(
            name=request.POST.get("name_add", "")
        ).pk
    else:
        choice_id = request.POST.get("choice_id", "0")
    object1 = assembly_unit_unit.objects.filter(belongs_id=int(choice_id))
    object2 = assembly_unit_under_the_node.objects.filter(
        belongs_id=int(choice_id)
    )
    object3 = assembly_unit_details.objects.filter(belongs_id=int(choice_id))
    object4 = assembly_unit_purchased.objects.filter(belongs_id=int(choice_id))
    for i in range(int(quantity)):
        if object1:
            items_unit(object1)
        if object2:
            items_under_the_node(object2)
        if object3:
            items_details(object3)
        if object4:
            items_purchased(object4)
    if edit_object_assembly_bool:
        return data_list
    else:
        name = assembly_unit.objects.get(
            pk=int(request.POST.get("choice_id", "0"))
        ).name
        return render(
            request,
            "main/object_assembly/report_object_assembly.html",
            context={
                "name": name,
                "data": data_list,
                "poduzels": assembly_unit_under_the_node.objects.filter(
                    belongs_id=int(choice_id)
                ),
                "uzels": assembly_unit_unit.objects.filter(
                    belongs_id=int(choice_id)
                ),
            },
        )


def report_object_assembly(request: HttpRequest) -> HttpResponse | None:
    if request.POST.get("choice_id") is not None:
        choice_id = int(request.POST.get("choice_id", "0"))

        info = pd.read_sql_query(
            f"SELECT short_name, counterparty, number_doc, subject_contract \
                FROM documents \
                    WHERE id = {choice_id};",
            engine,
        )

        short_name = info.loc[0, "short_name"]
        counterparty = info.loc[0, "counterparty"]
        number_doc = info.loc[0, "number_doc"]
        subject_contract = info.loc[0, "subject_contract"]

        work_types = pd.read_sql_query(
            f"SELECT work_name, date_end FROM doc_date WHERE "
            f"doc_name = '{short_name}' AND stage_work = true",
            engine,
        )
        work_types_table = []
        for index, row in work_types.iterrows():
            work_types_table.append(
                {
                    "work_name": row["work_name"],
                    "date_end": "-"
                    if row["date_end"] is pd.NaT
                    else row["date_end"].strftime("%d.%m.%Y"),
                }
            )

        global data_list
        data_list = {"details": {}, "purchased": {}}
        object1 = object_assembly_assembly_unit.objects.filter(
            belongs=choice_id,
        )
        object2 = object_assembly_details.objects.filter(
            belongs=choice_id,
        )
        object3 = object_assembly_purchased.objects.filter(
            belongs=choice_id,
        )
        uzels = object_assembly_unit.objects.filter(
            belongs=choice_id,
        )
        poduzels = object_assembly_under_the_node.objects.filter(
            belongs=choice_id,
        )
        project_equipments = object_assembly_project_equipment.objects.filter(
            belongs=choice_id,
        )
        items_assembly_unit(object1)
        items_details(object2)
        items_purchased(object3)
        return render(
            request,
            "main/object_assembly/report_object_assembly.html",
            context={
                "name": short_name,
                "doc_id": choice_id,
                "counterparty": counterparty,
                "number_doc": number_doc,
                "subject_contract": subject_contract,
                "work_types_table": work_types_table,
                "data": data_list,
                "uzels": uzels,
                "poduzels": poduzels,
                "project_equipments": project_equipments,
            },
        )
    return None


# View которая отдаёт Excel отчёт по конкретному объекту
@login_required
def download_report(request: HttpRequest, doc_id: int) -> FileResponse:
    generator = ExcelReportGenerator(doc_id)
    generator.load_workbook()
    file_stream = generator.file
    return FileResponse(
        file_stream,
        as_attachment=True,
        filename=generator.filename,
    )


# Производим развертование(расспаковку) всех записей,
# которые косаются данного объекта
def items_assembly_unit(object1: Any) -> None:
    for items_assembly_unit_obj in object1:
        q = 0
        while q < items_assembly_unit_obj.quantity:
            # print(q)
            object1 = assembly_unit_unit.objects.filter(
                belongs_id=items_assembly_unit_obj.name
            )
            object2 = assembly_unit_under_the_node.objects.filter(
                belongs_id=items_assembly_unit_obj.name
            )
            object3 = assembly_unit_details.objects.filter(
                belongs_id=items_assembly_unit_obj.name
            )
            object4 = assembly_unit_purchased.objects.filter(
                belongs_id=items_assembly_unit_obj.name
            )
            if object1:
                items_unit(object1)
            if object2:
                items_under_the_node(object2)
            if object3:
                items_details(object3)
            if object4:
                items_purchased(object4)
            q += 1


def items_unit(object1: Any) -> None:
    for items_unit_obj in object1:
        q = 0
        while q < items_unit_obj.quantity:
            object1 = unit_under_the_node.objects.filter(
                belongs_id=items_unit_obj.name
            )
            object2 = unit_details.objects.filter(
                belongs_id=items_unit_obj.name
            )
            object3 = unit_purchased.objects.filter(
                belongs_id=items_unit_obj.name
            )
            if object1:
                items_under_the_node(object1)
            if object2:
                items_details(object2)
            if object3:
                items_purchased(object3)
            q += 1


def items_under_the_node(object1: Any) -> None:
    for items_under_the_node_obj in object1:
        q = 0
        while q < items_under_the_node_obj.quantity:
            object1 = utn_details.objects.filter(
                belongs_id=items_under_the_node_obj.name
            )
            object2 = utn_purchased.objects.filter(
                belongs_id=items_under_the_node_obj.name
            )
            if object1:
                items_details(object1)
            if object2:
                items_purchased(object2)
            q += 1


def items_details(object1: Any) -> None:
    for items_details_obj in object1:
        if items_details_obj.name.name.name in data_list["details"]:
            data_list["details"][items_details_obj.name.name.name][
                "quantity"
            ] += int(items_details_obj.quantity)
        else:
            data_list["details"].update(
                {
                    items_details_obj.name.name.name: {
                        "quantity": int(items_details_obj.quantity),
                        "unit": items_details_obj.unit,
                    }
                }
            )


def items_purchased(object1: Any) -> None:
    for items_purchased_obj in object1:
        if items_purchased_obj.name in data_list["purchased"]:
            data_list["purchased"][items_purchased_obj.name][
                "quantity"
            ] += items_purchased_obj.quantity
        else:
            data_list["purchased"].update(
                {
                    items_purchased_obj.name: {
                        "quantity": items_purchased_obj.quantity,
                        "unit": items_purchased_obj.unit,
                    }
                }
            )
