from django.contrib import admin

from .models import (
    accounting_for_purchased_equipment,
    accounting_of_services_and_equipment,
    details,
)


class details_admin(admin.ModelAdmin[details]):
    list_display = (
        "name",
        "link",
    )
    list_display_links = ("name",)
    search_fields = ("link",)
    filter = (
        "name",
        "link",
    )


class accounting_for_purchased_equipment_admin(
    admin.ModelAdmin[accounting_for_purchased_equipment]
):
    search_fields = ("name",)


admin.site.register(
    accounting_for_purchased_equipment,
    accounting_for_purchased_equipment_admin,
)
admin.site.register(accounting_of_services_and_equipment)
admin.site.register(details, details_admin)
