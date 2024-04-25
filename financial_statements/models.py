from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse


class Report(models.Model):
    date = models.DateTimeField(
        null=True,
        verbose_name="Дата",
        blank=True,
    )
    title = models.CharField(
        max_length=30,
        null=False,
        verbose_name="Наименование",
    )
    total = models.FloatField(
        null=True,
        verbose_name="Сумма",
        blank=True,
    )
    checkbox = models.BooleanField(
        null=False,
        verbose_name="Чек",
    )
    note = models.CharField(
        max_length=300,
        null=True,
        verbose_name="Примечание",
        blank=True,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
    )
    mileage = models.FloatField(
        null=True,
        verbose_name="Пробег",
        blank=True,
    )

    created = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания",
    )
    updated = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата изменения",
    )

    def get_edit_url(self) -> str:
        return reverse("report_edit", kwargs={"report_id": self.id})

    def get_delete_url(self) -> str:
        return reverse("report_delete", kwargs={"report_id": self.id})
