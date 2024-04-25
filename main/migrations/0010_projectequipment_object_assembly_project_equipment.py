# Generated by Django 4.2.6 on 2023-12-12 20:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0009_alter_details_yandex_file_paths"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProjectEquipment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="name_purchased_equipment",
                        to="main.accounting_for_purchased_equipment",
                        verbose_name="Наименование проектного оборудования",
                    ),
                ),
            ],
            options={
                "verbose_name": "проектное оборудование",
                "verbose_name_plural": "проектное оборудование",
            },
        ),
        migrations.CreateModel(
            name="object_assembly_project_equipment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "belongs",
                    models.IntegerField(
                        db_index=True, verbose_name="object_assembly"
                    ),
                ),
                ("quantity", models.IntegerField(verbose_name="Количество")),
                (
                    "name",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="project_equipments",
                        to="main.projectequipment",
                        verbose_name="Выбор проектного оборудования",
                    ),
                ),
            ],
        ),
    ]