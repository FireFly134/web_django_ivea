# Generated by Django 4.2.6 on 2024-01-16 15:22

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("overhead_costs", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="MonthTotal",
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
                ("year", models.IntegerField(unique=True)),
                ("month", models.IntegerField()),
                ("total", models.FloatField()),
            ],
        ),
    ]
