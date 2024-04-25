"""taskmanager URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from typing import Any

from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from .settings import DEBUG, MEDIA_ROOT, MEDIA_URL


urlpatterns: list[Any] = [
    path("admin/", admin.site.urls),
    path("", include("main.urls")),
    path("station/", include("ivea_station.urls")),
    path("employee/", include("employee_cards.urls")),
    path("counterparty/", include("employee_cards.urls")),
    path("overhead_costs/", include("overhead_costs.urls")),
    path("invoice_analysis/", include("invoice_analysis.urls")),
    path("reports/", include("financial_statements.urls")),
    path("router_table/", include("router_table.urls")),
    path("documents/", include("documents.urls")),
    path("fuel_cards/", include("fuel_cards.urls")),
    path("repair_regex/", include("repair_reg_eq.urls")),
    path(
        "accounting_of_services_and_equipment/",
        include("equip_services.urls"),
    ),
    path("file_storage/", include("file_storage.urls")),
    path("commercial_offers/", include("commercial_offers.urls")),
]

if DEBUG:
    urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
