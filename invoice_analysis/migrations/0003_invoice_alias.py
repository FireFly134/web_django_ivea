# Generated by Django 4.2.6 on 2023-12-01 00:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("invoice_analysis", "0002_alter_invoice_counterparty"),
    ]

    operations = [
        migrations.AddField(
            model_name="invoice",
            name="alias",
            field=models.CharField(blank=True, null=True),
        ),
    ]
