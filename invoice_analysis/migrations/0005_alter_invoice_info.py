# Generated by Django 4.2.6 on 2023-12-01 00:40

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "invoice_analysis",
            "0004_invoice_payment_alter_invoice_entrance_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="invoice",
            name="info",
            field=models.CharField(blank=True, null=True),
        ),
    ]