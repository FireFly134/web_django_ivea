# Generated by Django 4.2.6 on 2024-01-16 15:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("overhead_costs", "0002_monthtotal"),
    ]

    operations = [
        migrations.AlterField(
            model_name="monthtotal",
            name="year",
            field=models.IntegerField(),
        ),
    ]
