from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


from main.models import (
    accounting_for_purchased_equipment as PurchasedEquipment,
)


class Contract(models.Model):
    class StatusList(models.TextChoices):
        active = "Активный", _("Активный")
        archive = "Архив", _("Архив")
        no_construction = "Нет стройки", _("Нет стройки")

    contract_id = models.IntegerField(
        null=False,
        verbose_name="ID",
    )
    contract_counterparty = models.CharField(
        max_length=200,
        null=False,
        verbose_name="Контрагент",
    )
    contract = models.CharField(
        max_length=200,
        null=False,
        verbose_name="Договор",
    )
    short_name = models.CharField(
        max_length=200,
        null=True,
        verbose_name="Короткое название",
    )
    status = models.CharField(
        max_length=15,
        choices=StatusList.choices,
        default=StatusList.no_construction,
        null=True,
    )

    def __str__(self) -> str:
        return f"{self.contract_id} | {self.contract_counterparty} |\
              {self.contract} | {self.short_name} ({self.status})"


class SimCard(models.Model):
    class StatusList(models.TextChoices):
        active = "Активный", _("Активный")
        block = "Заблокированный", _("Заблокированный")

    phone_number = models.CharField(
        max_length=10,
        null=False,
        verbose_name="Номер телефона",
    )
    contract = models.CharField(
        max_length=200,
        null=False,
        verbose_name="Договор",
    )
    fio = models.CharField(
        max_length=100,
        null=True,
        verbose_name="ФИО",
    )
    email = models.CharField(
        max_length=100,
        null=True,
        verbose_name="Эл. почта",
    )
    rate = models.CharField(
        max_length=200,
        null=True,
        verbose_name="Тариф",
    )
    serial_number = models.CharField(
        max_length=100,
        null=True,
        verbose_name="Серийный номер",
    )
    spending_threshold = models.CharField(
        max_length=200,
        null=True,
        verbose_name="Порог расходов (с НДС)",
    )
    status = models.CharField(
        max_length=200,
        choices=StatusList.choices,
        default=StatusList.active,
        verbose_name="Статус",
    )
    update_date = models.DateTimeField(
        null=True,
        verbose_name="Дата изменения",
    )
    activate_date = models.DateTimeField(
        null=True,
        verbose_name="Дата активации",
    )

    def __str__(self) -> str:
        return f"\
            +7 ({self.phone_number[0:3]})\
                  {self.phone_number[3:6]}\
-{self.phone_number[6:8]}-{self.phone_number[8:]}"


class AccrualReport(models.Model):
    phone_number = models.CharField(
        max_length=10, null=False, verbose_name="Номер телефона"
    )
    date_of_start_period = models.DateTimeField(
        null=False, verbose_name="Дата начала периода"
    )
    date_of_end_period = models.DateTimeField(
        null=False, verbose_name="Дата конца периода"
    )
    total = models.FloatField(null=False, default=0, verbose_name="Всего")

    def __str__(self) -> str:
        return f"{self.phone_number}:\
              {self.date_of_start_period} - {self.date_of_end_period}"


class Station(models.Model):
    title = models.CharField(
        max_length=100,
        null=False,
        verbose_name="Станция",
    )
    connect = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )
    power_supply = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )
    is_monitoring = models.BooleanField(
        default=False,
    )

    def __str__(self) -> str:
        return f"{self.title}"


class Router(models.Model):
    router_user_id = models.BigIntegerField(
        null=True,
        blank=True,
    )
    router = models.ForeignKey(
        PurchasedEquipment,
        on_delete=models.CASCADE,
        related_name="router",
        null=True,
        blank=True,
    )
    antenna = models.ForeignKey(
        PurchasedEquipment,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="antenna",
    )
    station = models.ForeignKey(
        Station,
        on_delete=models.CASCADE,
        null=True,
        verbose_name="Станция",
        blank=True,
    )
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
    )
    sim = models.ForeignKey(
        SimCard,
        on_delete=models.CASCADE,
        related_name="routers",
    )
    total = models.FloatField(
        null=True,
        blank=True,
    )
    note = models.CharField(
        max_length=500,
        null=True,
        blank=True,
    )
    ip_static = models.CharField(
        null=True,
        blank=True,
    )
