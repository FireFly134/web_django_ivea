from django.urls import path

from .views import index, ls


urlpatterns = [
    path("", index, name="file_storage_main"),
    path("ls/", ls, name="file_storage_ls"),
]
