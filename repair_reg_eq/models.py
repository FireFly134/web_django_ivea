from django.db import models
from django.urls import reverse

from employee_cards.models import Counterparty, Employee

from router_table.models import Contract, PurchasedEquipment  # type: ignore


class RepairEquipment(models.Model):
    counterparty = models.ForeignKey(
        Counterparty,
        on_delete=models.CASCADE,
    )  # контрагент
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
    )  # договор
    equipment = models.ForeignKey(
        PurchasedEquipment,
        on_delete=models.CASCADE,
    )  # оборудование
    serial_number = models.CharField(
        max_length=120,
    )  # серийный номер
    breakdown_description = models.TextField(
        null=True,
        blank=True,
    )  # описание поломки
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
    )  # сотрудник, который сделал заключение
    conclusion_service_company = models.TextField(
        null=True,
        blank=True,
    )  # заключение
    created_date = models.DateField(
        auto_now_add=True,
    )  # дата создания записи
    sending_date = models.DateField(
        null=True,
        blank=True,
    )  # дата отправки оборудования на диагностику
    acceptance_date = models.DateField(
        null=True,
        blank=True,
    )  # дата приёмки на склад отремонтированного оборудования

    def __str__(self) -> str:
        return f"{self.equipment} - {self.created_date}"

    def get_update_url(self) -> str:
        return reverse("req_eq_update", kwargs={"rep_eq_id": self.pk})
