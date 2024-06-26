# Generated by Django 4.0.5 on 2023-09-28 14:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("equip_services", "0002_subserviceorequipmentunit_name_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="accounting_of_services_and_equipment",
            name="parent",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="children",
                to="equip_services.accounting_of_services_and_equipment",
            ),
        ),
        migrations.AddField(
            model_name="accounting_of_services_and_equipment",
            name="sub_level",
            field=models.IntegerField(default=0),
        ),
        migrations.DeleteModel(
            name="SubServiceOrEquipmentUnit",
        ),
    ]
