# Generated by Django 4.2.6 on 2023-10-25 14:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("repair_reg_eq", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="repairequipment",
            name="acceptance_date",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="repairequipment",
            name="breakdown_description",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="repairequipment",
            name="conclusion_service_company",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="repairequipment",
            name="sending_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
