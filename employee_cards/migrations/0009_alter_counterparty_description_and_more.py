# Generated by Django 4.0.5 on 2023-09-19 08:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "employee_cards",
            "0008_counterparty_date_time_counterparty_description_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="counterparty",
            name="description",
            field=models.CharField(max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name="counterparty",
            name="group_k",
            field=models.CharField(
                choices=[
                    ("Поставщики", "Поставщики"),
                    ("Государственные органы", "Государственные органы"),
                    ("Покупатели", "Покупатели"),
                    ("Проблемные поставщики", "Проблемные поставщики"),
                ],
                default="",
                max_length=300,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="counterparty",
            name="tel",
            field=models.CharField(max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name="counterparty",
            name="trade_name",
            field=models.CharField(max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name="counterparty",
            name="type_k",
            field=models.CharField(
                choices=[
                    ("Юридическое лицо", "Юридическое лицо"),
                    ("Физическое лицо", "Физическое лицо"),
                ],
                default="",
                max_length=300,
                null=True,
            ),
        ),
    ]