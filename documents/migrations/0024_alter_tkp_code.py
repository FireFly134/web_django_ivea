# Generated by Django 4.2.6 on 2024-04-03 10:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("documents", "0023_tkp"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tkp",
            name="code",
            field=models.CharField(null=True),
        ),
    ]
