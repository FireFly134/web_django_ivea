# Generated by Django 4.0.5 on 2023-09-11 09:37

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "router_table",
            "0006_station_alter_router_antenna_alter_router_router_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="contract",
            name="status",
            field=models.CharField(
                choices=[
                    ("Активный", "Активный"),
                    ("Архив", "Архив"),
                    ("Нет стройки", "Нет стройки"),
                ],
                default="Нет стройки",
                max_length=15,
                null=True,
            ),
        ),
    ]