from django.db import models
from django.urls import reverse

from employee_cards.models import Employee


class ServiceParams(models.Model):
    card_number = models.CharField(max_length=100)
    service = models.CharField(max_length=100)
    count = models.FloatField()
    total = models.FloatField()
    start_period = models.DateTimeField()
    end_period = models.DateTimeField()

    def __str__(self) -> str:
        return f"{self.card_number}"


class FuelCard(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    services = models.ManyToManyField(ServiceParams)

    def get_update_url(self) -> str:
        return reverse("fuel_cards_update", kwargs={"fuel_card_id": self.pk})
