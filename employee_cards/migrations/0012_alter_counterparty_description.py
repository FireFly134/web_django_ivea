# Generated by Django 4.0.5 on 2023-09-19 09:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("employee_cards", "0011_alter_counterparty_description_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="counterparty",
            name="description",
            field=models.CharField(max_length=2000, null=True),
        ),
    ]
