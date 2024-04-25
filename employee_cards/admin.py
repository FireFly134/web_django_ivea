from django.contrib import admin

from .models import Counterparty, CounterpartyAliases, Employee


class Employee_admin(admin.ModelAdmin[Employee]):
    list_display = (
        "id",
        "name",
        "family_name",
        "verified",
        "position_at_work",
    )
    list_display_links = ("name",)
    search_fields = (
        "name",
        "family_name",
        "position_at_work",
    )
    filter = (
        "name",
        "family_name",
        "position_at_work",
    )


admin.site.register(Employee, Employee_admin)
admin.site.register(Counterparty)
admin.site.register(CounterpartyAliases)
