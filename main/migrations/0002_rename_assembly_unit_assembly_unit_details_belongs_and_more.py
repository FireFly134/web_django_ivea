# Generated by Django 4.0.5 on 2022-07-13 12:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="assembly_unit_details",
            old_name="assembly_unit",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="assembly_unit_details",
            old_name="details",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="assembly_unit_purchased",
            old_name="assembly_unit",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="assembly_unit_purchased",
            old_name="purchased",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="assembly_unit_under_the_node",
            old_name="assembly_unit",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="assembly_unit_under_the_node",
            old_name="under_the_node",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="assembly_unit_unit",
            old_name="assembly_unit",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="assembly_unit_unit",
            old_name="unit",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="object_assembly_assembly_unit",
            old_name="object_assembly",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="object_assembly_assembly_unit",
            old_name="assembly_unit",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="object_assembly_purchased",
            old_name="object_assembly",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="object_assembly_purchased",
            old_name="purchased",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="unit_details",
            old_name="unit",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="unit_details",
            old_name="details",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="unit_purchased",
            old_name="unit",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="unit_purchased",
            old_name="purchased",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="unit_under_the_node",
            old_name="unit",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="unit_under_the_node",
            old_name="under_the_node",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="utn_details",
            old_name="under_the_node",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="utn_details",
            old_name="details",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="utn_purchased",
            old_name="under_the_node",
            new_name="belongs",
        ),
        migrations.RenameField(
            model_name="utn_purchased",
            old_name="purchased",
            new_name="name",
        ),
        migrations.AlterField(
            model_name="details",
            name="name",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                primary_key=True,
                related_name="name_purchased",
                serialize=False,
                to="main.accounting_for_purchased_equipment",
                verbose_name="Наименование детали",
            ),
        ),
    ]
