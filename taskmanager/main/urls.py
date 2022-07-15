from django.conf import settings
from django.conf.urls.static import static

from . import views
from django.urls import path

urlpatterns = [
    path('', views.index, name='home'), # go home
    path('list_doc/', views.list_doc, name='list_doc'),# show list names documents
    path('new_doc/', views.new_doc, name='new_doc'),# add new document
    path('not_an_agreed_doc/', views.not_an_agreed_doc, name='not_an_agreed_doc'), # не согласованные документы
    path('login/', views.user_login, name='login'), # авторизация
    path('logout/', views.user_logout, name='logout'), # выход из профиля
    path('accounting_for_purchased_equipment/', views.add_pocup_oborud, name='afpe'),  # учет_для_покупки_оборудования
    path('accounting_of_services_and_equipment_description/', views.add_uslug_i_oborud_description, name='aosaed'), # учет_услуг_и_оборудования_описание
    path('accounting_of_services_and_equipment/', views.add_uslug_i_oborud, name='aosae'), # учет_услуг_и_оборудования
#### список ####
    path('details/', views.details_def, name='details'), # добавление деталей
    path('under_the_node/', views.choice_poduzel, name='utn'), # добавление и изменение параметров подузла
    path('unit/', views.choice_uzel, name='unit'), # добавление и изменение параметров узла
    path('assembly_unit/', views.choice_assembly_unit, name='assembly_unit'), # добавление и изменение параметров сборочной единицы
    path('object_assembly/', views.choice_object_assembly, name='object_assembly'), # добавление и изменение параметров обектной сборки
#### список ####
    path('edit_under_the_node/', views.edit_poduzel, name='edit_under_the_node'),
    path('edit_unit/', views.edit_uzel, name='test'),
    path('edit_assembly_unit/', views.edit_assembly_unit, name='edit_assembly_unit'),
    path('edit_object_assembly/', views.edit_object_assembly, name='edit_object_assembly'),
###########################
    path('report/', views.report_object_assembly, name='report'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, doctest_root=settings.MEDIA_ROOT)