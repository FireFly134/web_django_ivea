from typing import Any

from django.db import models


class BankState(models.Model):
    doc_number = models.BigIntegerField(verbose_name="Номер документа")
    doc_date = models.DateField(verbose_name="Дата документа")
    operation_date = models.DateField(verbose_name="Дата операции")
    name = models.CharField(verbose_name="Наименование")
    account = models.CharField(verbose_name="Счёт")
    inn = models.CharField(verbose_name="ИНН Контрагента")
    bank = models.CharField(verbose_name="Банк")
    debiting_sum = models.FloatField(
        null=True, verbose_name="Дебет (Списание) сумма"
    )
    credit_sum = models.FloatField(
        null=True, verbose_name="Кредит (Поступление) сумма"
    )
    appointment = models.TextField(
        verbose_name="Основание операции (назначение платежа)"
    )

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.pk,
            "Дата": self.doc_date,
            "Контрагент": self.name,
            "Номенклатура": self.appointment,
            "Всего": self.debiting_sum,
            "ИНН": self.inn,
        }


class MonthTotal(models.Model):
    year = models.IntegerField()
    month = models.IntegerField()
    total = models.FloatField()
