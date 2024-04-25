from django.db import models

from equip_services.models import (
    accounting_of_services_and_equipment as ServicesEquipment,
)


class ContactInformation(models.Model):
    fio = models.CharField(
        max_length=200,
        verbose_name="ФИО",
    )
    tel = models.CharField(
        max_length=200,
        verbose_name="Номер телефон",
    )
    organization = models.CharField(
        max_length=200,
        verbose_name="Название организации",
    )
    mail = models.CharField(
        max_length=200,
        verbose_name="Почта",
    )

    def __str__(self) -> str:
        if self.organization != "":
            return f"{self.fio} - {self.organization}"
        else:
            return f"{self.fio}"

    class Meta:
        verbose_name = "контактная информация о заказчике"
        verbose_name_plural = "контактную информацию о заказчике"
        # ordering = ['']


class ContactInformationToServicesEquipment(models.Model):
    contact_information = models.ForeignKey(
        ContactInformation, on_delete=models.CASCADE
    )

    npp = models.IntegerField(
        null=True,
        blank=True,
    )
    work_name = models.CharField(
        null=True,
        blank=True,
    )
    services_equipment = models.ManyToManyField(ServicesEquipment)
    unit_of_measurement = models.CharField(
        null=True,
        blank=True,
    )
    cost_with_vat = models.FloatField(
        null=True,
        blank=True,
    )
