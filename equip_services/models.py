from django.db import models
from django.urls import reverse


# Модель услуг и оборудования
class accounting_of_services_and_equipment(models.Model):
    name = models.CharField(
        max_length=200, verbose_name="Наименование", db_index=True
    )
    parent = models.ForeignKey(
        "accounting_of_services_and_equipment",
        null=True,
        on_delete=models.CASCADE,
        related_name="children",
    )
    sub_level = models.IntegerField(default=0)
    see_id = models.CharField(max_length=20, default="")

    class Meta:
        verbose_name = "Услуги и оборудования"
        verbose_name_plural = "Услуги и оборудования"

    def __str__(self) -> str:
        return self.name

    def get_see_id(self) -> str:
        if self.parent:
            return self.see_id
        return str(self.pk)

    def get_subcreate_url(self) -> str:
        return reverse("create_sub", kwargs={"obj_id": self.pk})

    def get_delete_url(self) -> str:
        return reverse("delete_sub", kwargs={"sub_id": self.pk})
