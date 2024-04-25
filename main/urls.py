from django.conf import urls
from django.urls import path, re_path

from . import views

urls.handler400 = views.custom_400_view
urls.handler403 = views.custom_403_view
urls.handler404 = views.custom_404_view


urlpatterns = [
    path("", views.index, name="home"),  # go home
    path("test/", views.engineers_edit, name="test"),  # go home
    re_path(r"^test/(?P<doc_id>\d+)/$", views.engineers_edit),
    path("test/", views.engineers_edit, name="test"),  # go home
    # path('login/', views.user_login, name='login'), # авторизация
    path("accounts/login/", views.user_login, name="login"),  # авторизация
    path("logout/", views.user_logout, name="logout"),  # выход из профиля
    path(
        "accounting_for_purchased_equipment/",
        views.add_pocup_oborud,
        name="afpe",
    ),  # учет_для_покупки_оборудования
    path(
        "accounting_of_services_and_equipment_description/",
        views.add_uslug_i_oborud_description,
        name="aosaed",
    ),  # учет_услуг_и_оборудования_описание
    # список
    path(
        "details/create/",
        views.DetailCreateView.as_view(),
        name="detail_create",
    ),  # создание деталей
    path(
        "details/", views.DetailListView.as_view(), name="details"
    ),  # добавление деталей
    path(
        "details/document/",
        views.document_path_generator,
        name="document_path_generator",
    ),
    path(
        "detail/document/delete/",
        views.delete_detail_document,
        name="delete_detail_document",
    ),
    path(
        "details/update/",
        views.update_detail_document,
        name="detail_update",
    ),
    path(
        "project_equipment/",
        views.ProjectEquipmentListView.as_view(),
        name="project_equipment_list",
    ),
    path(
        "project_equipment/create/",
        views.ProjectEquipmentCreateView.as_view(),
        name="project_equipment_create",
    ),
    path(
        "equipment/create/",
        views.create_new_equipment,
        name="create_new_equipment",
    ),
    path(
        "under_the_node/create/", views.create_poduzel, name="utn_create"
    ),  # эндпоинт создания подузла
    path(
        "under_the_node/rename/", views.rename_poduzel, name="utn_renanme"
    ),  # эндпоинт переименовывания подузла
    path(
        "under_the_node/", views.choice_poduzel, name="utn"
    ),  # добавление и изменение параметров подузла
    path(
        "unit/", views.choice_uzel, name="unit"
    ),  # добавление и изменение параметров узла
    path(
        "unit/rename/",
        views.rename_uzel,
        name="unit_rename",
    ),
    path(
        "assembly_unit/", views.choice_assembly_unit, name="assembly_unit"
    ),  # добавление и изменение параметров сборочной единицы
    path(
        "assembly_unit/rename/",
        views.rename_assembly_unit,
        name="assembly_unit_rename",
    ),
    path(
        "object_assembly/",
        views.choice_object_assembly,
        name="object_assembly",
    ),  # добавление и изменение параметров объектной сборки
    # список
    path(
        "edit_under_the_node/", views.edit_poduzel, name="edit_under_the_node"
    ),
    path("edit_unit/", views.edit_uzel, name="edit_unit"),
    path(
        "edit_assembly_unit/",
        views.edit_assembly_unit,
        name="edit_assembly_unit",
    ),
    path(
        "edit_object_assembly/",
        views.edit_object_assembly,
        name="edit_object_assembly",
    ),
    ###########################
    path(
        "report_under_the_node/",
        views.report_poduzel,
        name="report_under_the_node",
    ),
    path("report_unit/", views.report_unit, name="report_unit"),
    path(
        "report_assembly_unit/",
        views.report_assembly_unit,
        name="report_assembly_unit",
    ),
    path(
        "report_object_assembly/",
        views.report_object_assembly,  # type: ignore
        name="report",
    ),
    path(
        "download_report/<int:doc_id>",
        views.download_report,
        name="assembly_report_download",
    ),
    ###########################
    path("map/", views.open_map_with_station, name="map"),
    ###########################
]
