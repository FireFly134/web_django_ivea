# Generated by Django 4.0.5 on 2023-09-15 08:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("employee_cards", "0007_employee_second_organization_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="ServiceParams",
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
                ("card_number", models.CharField(max_length=100)),
                ("service", models.CharField(max_length=100)),
                ("count", models.FloatField()),
                ("total", models.FloatField()),
                ("start_period", models.DateTimeField()),
                ("end_period", models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name="FuelCard",
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
                ("card_number", models.CharField(max_length=100)),
                (
                    "employee",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="employee_cards.employee",
                    ),
                ),
                (
                    "services",
                    models.ManyToManyField(to="fuel_cards.serviceparams"),
                ),
            ],
        ),
    ]
