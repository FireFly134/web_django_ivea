# Generated by Django 4.0.5 on 2023-08-16 17:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("employee_cards", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Counterparty",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=100)),
            ],
        ),
        migrations.AlterModelOptions(
            name="employee",
            options={
                "ordering": ["id"],
                "verbose_name": "карточку сотрудника",
                "verbose_name_plural": "Карточки сотрудников",
            },
        ),
        migrations.AddField(
            model_name="employee",
            name="address",
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="employee",
            name="citizenship",
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name="employee",
            name="date_of_issue",
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name="employee",
            name="gender",
            field=models.CharField(
                choices=[("Мужской", "Мужской"), ("Женский", "Женский")],
                default="Мужской",
                max_length=10,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="employee",
            name="issuing_authority",
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="employee",
            name="photo",
            field=models.ImageField(
                blank=True, null=True, upload_to="photos/%Y/%m/%d/"
            ),
        ),
        migrations.AddField(
            model_name="employee",
            name="series_number",
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name="employee",
            name="a_key",
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name="employee",
            name="access",
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name="employee",
            name="id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="employee",
            name="user_id",
            field=models.BigIntegerField(null=True),
        ),
        migrations.AlterField(
            model_name="employee",
            name="verified",
            field=models.BooleanField(default=False, null=True),
        ),
        migrations.AddField(
            model_name="employee",
            name="organization",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="employee_cards.counterparty",
            ),
        ),
    ]
