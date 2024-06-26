# Generated by Django 4.0.5 on 2023-09-19 08:39

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("employee_cards", "0007_employee_second_organization_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="counterparty",
            name="date_time",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name="counterparty",
            name="description",
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
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
                max_length=100,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="counterparty",
            name="inn",
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name="counterparty",
            name="tel",
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name="counterparty",
            name="total",
            field=models.FloatField(default=0, null=True),
        ),
        migrations.AddField(
            model_name="counterparty",
            name="trade_name",
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="counterparty",
            name="type_k",
            field=models.CharField(
                choices=[
                    ("Юридическое лицо", "Юридическое лицо"),
                    ("Физическое лицо", "Физическое лицо"),
                ],
                default="",
                max_length=50,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="counterparty",
            name="url",
            field=models.URLField(null=True),
        ),
    ]
