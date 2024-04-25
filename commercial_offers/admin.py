from django.contrib import admin

from .models import ContactInformation


class ContactInformationAdmin(admin.ModelAdmin[ContactInformation]):
    list_display = (
        "fio",
        "organization",
    )
    list_display_links = ("fio",)
    search_fields = (
        "fio",
        "organization",
    )
    filter = (
        "fio",
        "organization",
    )


admin.site.register(ContactInformation, ContactInformationAdmin)
