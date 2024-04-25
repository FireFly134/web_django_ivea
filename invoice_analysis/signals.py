from typing import Any

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Invoice
from .services import ContractInvoiceSaver


@receiver(post_save, sender=Invoice)
def invoice_created_callback(
    sender: Any,
    instance: Any,
    created: Any,
    **kwargs: Any,
) -> None:
    saver = ContractInvoiceSaver(instance)
    saver.save()
