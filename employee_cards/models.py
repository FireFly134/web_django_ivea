from typing import Any

from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class Counterparty(models.Model):
    """Контрагент"""

    class GroupKList(models.TextChoices):
        suppliers = "Поставщики", _("Поставщики")
        government_agencies = "Государственные органы", _(
            "Государственные органы"
        )
        buyers = "Покупатели", _("Покупатели")
        problematic_suppliers = "Проблемные поставщики", _(
            "Проблемные поставщики"
        )

    class TypeKList(models.TextChoices):
        legal_entity = "Юридическое лицо", _("Юридическое лицо")
        natural_person = "Физическое лицо", _("Физическое лицо")

    title = models.CharField(
        max_length=301,
    )
    inn = models.CharField(
        max_length=50,
    )
    group_k = models.CharField(
        max_length=302,
        null=True,
        choices=GroupKList.choices,
        default="",
    )
    type_k = models.CharField(
        max_length=303,
        null=True,
        choices=TypeKList.choices,
        default="",
    )
    trade_name = models.CharField(
        max_length=304,
        null=True,
        blank=True,
    )
    description = models.CharField(
        max_length=2000,
        null=True,
        blank=True,
    )
    url = models.URLField(
        null=True,
        blank=True,
    )
    tel = models.CharField(
        max_length=2000,
        null=True,
        blank=True,
    )
    date_time = models.DateTimeField(
        null=True,
        auto_now_add=True,
    )
    total = models.FloatField(
        blank=True,
        default=0,
    )
    standard_deviation = models.FloatField(
        blank=True,
        default=0,
    )
    load_by_month = models.FloatField(
        blank=True,
        default=0,
    )

    def get_absolute_url(self) -> str:
        return reverse(
            "counterparty_detail", kwargs={"counterparty_id": self.pk}
        )

    def get_update_url(self) -> str:
        return reverse(
            "counterparty_update", kwargs={"counterparty_id": self.pk}
        )

    def __str__(self) -> str:
        return self.title


class CounterpartyAliases(models.Model):
    alias = models.CharField()
    counterparty = models.ForeignKey(
        Counterparty,
        on_delete=models.CASCADE,
        related_name="aliases",
    )


class CounterpartyInvoice(models.Model):
    counterparty = models.ForeignKey(
        Counterparty,
        on_delete=models.CASCADE,
        related_name="invoices",
    )
    date = models.DateField()
    nomenclature = models.TextField(default="")
    total = models.FloatField()

    def __str__(self) -> str:
        return f"{self.nomenclature}: {self.total}"


class PriceChangeLog(models.Model):
    """Изменение цены по номенклатуре"""

    min_price = models.FloatField()
    max_price = models.FloatField()
    amount = models.IntegerField(default=1)
    nomenclature = models.TextField(default="")
    counterparty = models.ForeignKey(
        Counterparty, on_delete=models.CASCADE, related_name="changing_logs"
    )


def custom_path(instance: Any, filename: Any) -> str:
    employee_id = 0
    if instance.id is not None:
        employee_id = instance.id
    else:
        if Employee.objects.all().order_by("id").exists():
            employee = Employee.objects.all().order_by("id").last()
            if employee:
                employee_id = employee.id + 1

    return f'photos/photo_EmployeeID_{employee_id}.{filename.split(".")[-1]}'


class Employee(models.Model):
    """Сотрудник"""

    class GenderList(models.TextChoices):
        male = "Мужской", _("Мужской")
        female = "Женский", _("Женский")

    class EmployeeType(models.TextChoices):
        main = "Основная работа", _("Основная работа")
        piecework = "Сдельно", _("Сдельно")
        part_time = "Частичная занятость", _("Частичная занятость")

    class Meta:
        ordering = ["family_name"]
        verbose_name = "карточку сотрудника"
        verbose_name_plural = "Карточки сотрудников"

    id = models.AutoField(primary_key=True)
    a_key = models.CharField(max_length=20, null=True)
    user_id = models.BigIntegerField(null=True)
    name = models.CharField(
        max_length=100,
    )
    family_name = models.CharField(
        max_length=100,
    )
    access = models.IntegerField(default=0, null=True)
    tel = models.CharField(
        max_length=20,
        null=True,
        blank=True,
    )
    birthday = models.DateTimeField(
        null=True,
        blank=True,
    )
    verified = models.BooleanField(
        default=False,
        null=True,
        blank=True,
    )
    position_at_work = models.CharField(
        max_length=150,
        null=True,
        blank=True,
    )
    gender = models.CharField(
        max_length=10,
        choices=GenderList.choices,
        default=GenderList.male,
        null=True,
    )
    citizenship = models.CharField(
        max_length=50,
        null=True,
        blank=True,
    )
    photo = models.ImageField(
        upload_to=custom_path,
        null=True,
        blank=True,
    )
    mail = models.EmailField(
        null=True,
        blank=True,
    )

    # Паспортные данные
    series_number = models.CharField(
        max_length=20,
        null=True,
        blank=True,
    )
    issuing_authority = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )
    date_of_issue = models.DateTimeField(
        null=True,
        blank=True,
    )
    address = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )

    # Зарплата и кадры
    organization = models.ForeignKey(
        Counterparty,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="organization",
    )
    second_organization = models.ForeignKey(
        Counterparty,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="second_organization",
    )
    work_type = models.CharField(
        max_length=20, choices=EmployeeType.choices, default=EmployeeType.main
    )
    is_dismissed = models.BooleanField(default=False, null=True)

    def get_edit_url(self) -> str:
        return reverse("card_edit", kwargs={"employee_id": self.id})

    def __str__(self) -> str:
        position_at_work = (
            "Должность не указана"
            if not self.position_at_work
            else self.position_at_work
        )
        return f"{self.family_name} {self.name}, {position_at_work}"
