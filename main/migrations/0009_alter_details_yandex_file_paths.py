# Generated by Django 4.2.6 on 2023-12-06 11:02

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0008_remove_details_yandex_file_path_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="details",
            name="yandex_file_paths",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.TextField(blank=True),
                blank=True,
                default=list,
                size=None,
            ),
        ),
    ]
