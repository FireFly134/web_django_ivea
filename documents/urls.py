from django.urls import path
from django.urls import re_path

from . import views

urlpatterns = [
    path("", views.index, name="home_doc"),  # go home
    path("list_doc/", views.list_doc_all, name="list_doc"),
    path(
        "list_documents/",
        views.list_doc_limitation,
        name="list_doc_limitation",
    ),  # show list names documents
    path("new_doc/", views.new_doc, name="new_doc"),  # add new document
    path("edit_doc/<int:doc_id>/", views.edit_doc, name="edit_doc"),
    path("list_doc/<int:doc_id>/", views.list_doc, name="doc"),
    path(
        "list_doc/change_status_doc/",
        views.change_status_doc,
        name="change_status_doc",
    ),
    path(
        "not_an_agreed_doc/", views.not_an_agreed_doc, name="not_an_agreed_doc"
    ),  # не согласованные документы
    path(
        "invoices_under_approval/",
        views.invoices_under_approval,
        name="invoices_under_approval",
    ),  # Счета на согласовании
    path(
        "jobs_and_amounts/", views.jobs_and_amounts, name="jobs_and_amounts"
    ),  # Работы и суммы в перспективе
    ###########################
    re_path(r"^log_doc/(?P<doc_id>\d+)/$", views.log_doc),
    path(
        "rss/dmitrov",
        views.RSSDmitrovListView.as_view(),
        name="dmitorv_rss",
    ),
    path(
        "rss/dmitrov/<int:rss_id>/",
        views.rss_detail_view,
        name="rss_detail",
    ),
    path(
        "rss/dmitrov/delete_rss_dmitrov_stage/<int:rss_stage_id>/",
        views.delete_rss_dmitrov_stage,
        name="delete_rss_dmitrov_stage",
    ),
    path(
        "rss/dmitrov/update_rss_files/<int:rss_id>/",
        views.update_rss_files,
        name="update_rss_files",
    ),
    path(
        "rss/dmitrov/delete_rss_file/<int:rss_id>/",
        views.delete_rss_file,
        name="delete_rss_file",
    ),
    path(
        "rss/dmitrov/update_rss_connections/<int:rss_id>/",
        views.update_rss_connections,
        name="update_rss_connections",
    ),
    path(
        "rss/dmitrov/update_rss_invoices_connections/<int:rss_id>/",
        views.update_rss_invoice_connection,
        name="update_invoices_connection",
    ),
    path(
        "tkp_table",
        views.tkp_table_view,
        name="tkp_table",
    ),
]
