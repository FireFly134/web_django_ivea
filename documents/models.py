from typing import Any

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.urls import reverse


class RSSDmitrov(models.Model):
    contract_id = models.IntegerField()

    npp = models.CharField()
    code = models.CharField()
    parent_work_name = models.CharField()
    work_name = models.CharField()
    unit = models.CharField()
    accounting_method = models.CharField(null=True)
    material_consumption_rate = models.FloatField(null=True)
    volume = models.FloatField()
    new_volume = models.FloatField(null=True)

    basic_materials_unit_cost = models.FloatField(null=True)
    smr_unit_cost = models.FloatField(null=True)
    total_unit_cost = models.FloatField(null=True)

    basic_materials_total_cost = models.FloatField(null=True)
    smr_total_cost = models.FloatField(null=True)
    total_total_cost = models.FloatField(null=True)

    note = models.TextField(null=True)

    submitted_for_approval = models.BooleanField(default=False)
    approved_by_supervision = models.BooleanField(default=False)
    originals_is_signed = models.BooleanField(default=False)
    additional_is_required = models.BooleanField(default=False)
    ks_pto_flag = models.BooleanField(default=False)
    ks_ivea_flag = models.BooleanField(default=False)
    ks_ps_flag = models.BooleanField(default=False)

    connected_invoices_id_array = ArrayField(
        models.BigIntegerField(),
        blank=True,
        default=list,
    )

    submitted_for_approval_file_paths = ArrayField(
        models.TextField(
            blank=True,
        ),
        blank=True,
        default=list,
    )
    originals_is_signed_file_paths = ArrayField(
        models.TextField(
            blank=True,
        ),
        blank=True,
        default=list,
    )

    distribution_letter_file_paths = ArrayField(
        models.TextField(
            blank=True,
        ),
        blank=True,
        default=list,
    )
    product_on_object_file_paths = ArrayField(
        models.TextField(
            blank=True,
        ),
        blank=True,
        default=list,
    )

    pto_ivea_file_paths = ArrayField(
        models.TextField(
            blank=True,
        ),
        blank=True,
        default=list,
    )

    related_rss = models.ManyToManyField("self", blank=True)

    def __str__(self) -> str:
        return f"RSS Dmitrov - {self.npp}"

    def save(self, *args: Any, **kwargs: Any) -> None:
        super().save(*args, **kwargs)
        if self.related_rss.exists():
            first_path = self.submitted_for_approval_file_paths
            second_path = self.originals_is_signed_file_paths
            third_path = self.pto_ivea_file_paths
            self.related_rss.update(
                submitted_for_approval=self.submitted_for_approval,
                approved_by_supervision=self.approved_by_supervision,
                originals_is_signed=self.originals_is_signed,
                ks_pto_flag=self.ks_pto_flag,
                ks_ivea_flag=self.ks_ivea_flag,
                ks_ps_flag=self.ks_ps_flag,
                submitted_for_approval_file_paths=first_path,
                originals_is_signed_file_paths=second_path,
                pto_ivea_file_paths=third_path,
            )

    def get_absolute_url(self) -> str:
        return reverse("rss_detail", kwargs={"rss_id": self.pk})

    def get_upload_files_url(self) -> str:
        return reverse("update_rss_files", kwargs={"rss_id": self.pk})

    def get_update_invoices_connection_url(self) -> str:
        return reverse(
            "update_invoices_connection", kwargs={"rss_id": self.pk}
        )


class RSSDmitrovStage(models.Model):
    rss_dmitrov_row = models.ForeignKey(
        RSSDmitrov, on_delete=models.CASCADE, related_name="stages"
    )

    work_name = models.CharField(null=True)
    volume = models.FloatField()

    unit_material_cost = models.FloatField(null=True)
    unit_smr_cost = models.FloatField(null=True)

    basic_materials_total_cost = models.FloatField(null=True)
    smr_total_cost = models.FloatField(null=True)
    total_total_cost = models.FloatField(null=True)

    application_submitted = models.BooleanField(default=False)
    counterparty_offer = models.BooleanField(default=False)
    has_distribution_letter = models.BooleanField(default=False)
    product_on_object = models.BooleanField(default=False)

    def get_delete_url(self) -> str:
        return reverse(
            "delete_rss_dmitrov_stage", kwargs={"rss_stage_id": self.pk}
        )


class TKP(models.Model):
    parent_costs_name = models.CharField()
    npp = models.CharField()
    code = models.CharField(null=True)
    costs_name = models.CharField()
    contractor_comment = models.CharField(null=True)
    unit = models.CharField(null=True)
    consumption_coefficient = models.FloatField(null=True)
    amount = models.FloatField(null=True)
    material_unit_cost = models.FloatField(null=True)
    smr_unit_cost = models.FloatField(null=True)
    price = models.FloatField(null=True)
    material_total_cost = models.FloatField(null=True)
    smr_total_cost = models.FloatField(null=True)
    total_cost = models.FloatField(null=True)
