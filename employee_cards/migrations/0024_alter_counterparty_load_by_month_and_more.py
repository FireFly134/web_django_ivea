# Generated by Django 4.2.6 on 2023-11-15 17:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("employee_cards", "0023_alter_pricechangelog_counterparty"),
    ]

    operations = [
        migrations.AlterField(
            model_name="counterparty",
            name="load_by_month",
            field=models.FloatField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name="counterparty",
            name="standard_deviation",
            field=models.FloatField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name="counterparty",
            name="total",
            field=models.FloatField(default=0),
        ),
    ]