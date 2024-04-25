import json

from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render

import requests

from taskmanager import settings

import yadisk

from .forms import FileUploadForm


@login_required
def ls(request: HttpRequest) -> HttpResponse:
    url = "https://cloud-api.yandex.net/v1/disk/resources"

    headers = {
        "Accept": "application/json",
        "Authorization": f"OAuth {settings.Y_TOKEN}",
    }

    path = request.GET.get("path")
    if path:
        url += f"?path={path}"
    else:
        url += "?path=%2"

    response = requests.get(url, headers=headers)
    return JsonResponse(json.loads(response.text))


@login_required
def index(request: HttpRequest) -> HttpResponse:
    message: dict[str, str] = dict()

    if request.POST:
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            filename = str(form.cleaned_data["file"])
            disk_path = request.POST["diskPath"]
            filepath = f"data/file_storage/{filename}"
            file_name = default_storage.save(
                filepath, form.cleaned_data["file"]
            )
            y: yadisk.YaDisk = yadisk.YaDisk(token=settings.Y_TOKEN)
            try:
                y.upload("media/" + file_name, f"{disk_path}/{filename}")
            except yadisk.exceptions.PathExistsError:
                message["status"] = "error"
                message["msg"] = f'Файл "{filename}" уже существует'
            else:
                message["status"] = "success"
                message["msg"] = f'Файл "{filename}" успешно загружен'

            default_storage.delete(file_name)
    return render(
        request,
        "file_storage/file_storage.html",
        context={
            "form": FileUploadForm(),
            "msg": message,
        },
    )
