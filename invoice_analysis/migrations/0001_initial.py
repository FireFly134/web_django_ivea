# Generated by Django 4.2.6 on 2023-11-30 23:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("employee_cards", "0025_alter_counterparty_total"),
    ]

    operations = [
        migrations.CreateModel(
            name="Invoice",
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
                ("date", models.DateTimeField()),
                ("number", models.CharField()),
                ("sum", models.DecimalField(decimal_places=2, max_digits=20)),
                ("pp_created", models.CharField(blank=True, null=True)),
                (
                    "payment_status",
                    models.CharField(
                        choices=[
                            ("Оплачен", "Оплачен"),
                            ("Не оплачен", "Не оплачен"),
                        ],
                        default="Не оплачен",
                    ),
                ),
                (
                    "entrance",
                    models.CharField(
                        choices=[
                            ("Получен", "Получен"),
                            ("Не получен", "Не получен"),
                        ],
                        default="Не получен",
                    ),
                ),
                ("date_of_the_incoming_document", models.DateField()),
                ("incoming_document_number", models.CharField()),
                (
                    "comment",
                    models.CharField(blank=True, default="", null=True),
                ),
                ("nomenclature", models.TextField()),
                ("amount", models.FloatField()),
                ("unit", models.CharField()),
                (
                    "price",
                    models.DecimalField(decimal_places=2, max_digits=20),
                ),
                (
                    "second_sum",
                    models.DecimalField(decimal_places=2, max_digits=20),
                ),
                ("vat_percent", models.IntegerField(blank=True, null=True)),
                (
                    "vat",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=20, null=True
                    ),
                ),
                (
                    "total",
                    models.DecimalField(decimal_places=2, max_digits=20),
                ),
                ("info", models.CharField()),
                (
                    "counterparty",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="employee_cards.counterparty",
                    ),
                ),
            ],
        ),
    ]
