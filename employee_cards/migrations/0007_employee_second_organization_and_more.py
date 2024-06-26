# Generated by Django 4.0.5 on 2023-09-01 15:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("employee_cards", "0006_employee_is_dismissed"),
    ]

    operations = [
        migrations.AddField(
            model_name="employee",
            name="second_organization",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="second_organization",
                to="employee_cards.counterparty",
            ),
        ),
        migrations.AlterField(
            model_name="employee",
            name="organization",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="organization",
                to="employee_cards.counterparty",
            ),
        ),
    ]
