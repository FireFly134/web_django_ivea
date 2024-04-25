# Generated by Django 4.2.6 on 2024-03-03 16:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("documents", "0007_rssdmitrovstage"),
    ]

    operations = [
        migrations.AddField(
            model_name="rssdmitrovstage",
            name="basic_materials_total_cost",
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name="rssdmitrovstage",
            name="smr_total_cost",
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name="rssdmitrovstage",
            name="total_total_cost",
            field=models.FloatField(null=True),
        ),
    ]