# Generated by Django 4.2.6 on 2023-11-29 11:41

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "router_table",
            "0010_alter_router_router_alter_router_router_user_id_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="router",
            name="ip_static",
            field=models.CharField(blank=True, null=True),
        ),
    ]