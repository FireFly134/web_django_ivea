# Generated by Django 4.2.6 on 2024-02-27 16:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("documents", "0003_alter_rssdmitrov_npp"),
    ]

    operations = [
        migrations.AddField(
            model_name="rssdmitrov",
            name="additional_attributes",
            field=models.JSONField(default=dict),
        ),
    ]