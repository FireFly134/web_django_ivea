# Generated by Django 4.2.6 on 2023-10-24 10:59

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("employee_cards", "0012_alter_counterparty_description"),
    ]

    operations = [
        migrations.AlterField(
            model_name="counterparty",
            name="inn",
            field=models.CharField(max_length=50),
        ),
    ]