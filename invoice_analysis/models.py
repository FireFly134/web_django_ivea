from django.db import models

from employee_cards.models import Counterparty


class Invoice(models.Model):
    date = models.DateTimeField()
    number = models.CharField()
    counterparty = models.ForeignKey(
        Counterparty,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    sum = models.DecimalField(
        max_digits=20,
        decimal_places=2,
    )
    pp_created = models.CharField(
        null=True,
        blank=True,
    )
    payment_status = models.CharField(
        null=True,
        blank=True,
    )
    payment = models.CharField(
        null=True,
        blank=True,
    )
    entrance = models.CharField(
        null=True,
        blank=True,
    )
    date_of_the_incoming_document = models.DateField()
    incoming_document_number = models.CharField()
    comment = models.CharField(
        null=True,
        default="",
        blank=True,
    )
    nomenclature = models.TextField()
    amount = models.FloatField()
    unit = models.CharField()
    price = models.DecimalField(
        max_digits=20,
        decimal_places=2,
    )
    second_sum = models.DecimalField(
        max_digits=20,
        decimal_places=2,
    )
    vat_percent = models.IntegerField(
        null=True,
        blank=True,
    )
    vat = models.DecimalField(
        max_digits=20,
        decimal_places=2,
        null=True,
        blank=True,
    )
    total = models.DecimalField(
        max_digits=20,
        decimal_places=2,
    )
    info = models.CharField(
        null=True,
        blank=True,
    )

    alias = models.CharField(
        null=True,
        blank=True,
    )


class ContractInvoice(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)

    contract_id = models.IntegerField(null=False)

    amount = models.FloatField(default=1)
    second_sum = models.DecimalField(
        max_digits=20,
        decimal_places=2,
    )
    vat = models.DecimalField(
        max_digits=20,
        decimal_places=2,
        null=True,
        blank=True,
    )
    total = models.DecimalField(
        max_digits=20,
        decimal_places=2,
    )
