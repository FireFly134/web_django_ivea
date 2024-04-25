# Generated by Django 4.2.6 on 2024-02-28 07:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("documents", "0004_rssdmitrov_additional_attributes"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="rssdmitrov",
            name="additional_attributes",
        ),
        migrations.AddField(
            model_name="rssdmitrov",
            name="submitted_for_approval",
            field=models.BooleanField(default=False),
        ),
    ]
