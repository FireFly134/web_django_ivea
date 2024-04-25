from django.contrib.postgres.fields import ArrayField
from django.db import models


# Модель услуг и оборудования
class accounting_of_services_and_equipment(models.Model):
    name = models.CharField(
        max_length=200, verbose_name="Наименование", db_index=True
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Услуги и оборудования"
        verbose_name_plural = "Услуги и оборудования"
        # ordering = ['']


# Модель расшифровка
class accounting_of_services_and_equipment_description(models.Model):
    description = models.CharField(
        max_length=500, verbose_name="Описание", db_index=True
    )
    services = models.ManyToManyField(  # type: ignore
        "accounting_of_services_and_equipment",
        verbose_name="Услуги и оборудования",
        blank=True,
    )

    def __str__(self) -> str:
        return self.description

    class Meta:
        verbose_name = "расшифровку услуг или оборудования"
        verbose_name_plural = "Расшифровки услуг или оборудования"
        # ordering = ['']


# Модель покупное оборудование
class accounting_for_purchased_equipment(models.Model):
    name = models.CharField(
        max_length=200, verbose_name="Наименование", db_index=True
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Покупное оборудование"
        verbose_name_plural = "Покупные оборудования"
        # ordering = ['']


# Модель Детали
class details(models.Model):
    name = models.OneToOneField(
        "accounting_for_purchased_equipment",
        verbose_name="Наименование детали",
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="name_purchased",
    )
    link = models.CharField(
        max_length=200,
        verbose_name="Ссылка на чертёж",
        blank=True,
    )
    yandex_file_paths = ArrayField(
        models.TextField(
            blank=True,
        ),
        blank=True,
        default=list,
    )

    def __str__(self) -> str:
        return self.name.name

    class Meta:
        verbose_name = "деталь"
        verbose_name_plural = "детали"


# Модель проектного оборудования
class ProjectEquipment(models.Model):
    name = models.CharField()

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "проектное оборудование"
        verbose_name_plural = "проектное оборудование"


# ПОДУЗЕЛ
# Модель подузел
class under_the_node(models.Model):
    name = models.CharField(
        max_length=200, verbose_name="Наименование", db_index=True
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Подузел"
        verbose_name_plural = "Подузлы"
        # ordering = ['']


# Модель соединитель подузел и покупное оборудование
class utn_purchased(models.Model):
    belongs = models.ForeignKey(
        "under_the_node",
        on_delete=models.PROTECT,
        db_index=True,
    )
    name = models.ForeignKey(
        "accounting_for_purchased_equipment",
        on_delete=models.PROTECT,
        verbose_name="Выбор покупного оборудования",
    )
    quantity = models.FloatField(
        verbose_name="Количество покупного оборудования(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель  соединитель подузел и детали
class utn_details(models.Model):
    belongs = models.ForeignKey(
        "under_the_node",
        on_delete=models.PROTECT,
        db_index=True,
    )
    name = models.ForeignKey(
        "details",
        on_delete=models.PROTECT,
        verbose_name="Выбор деталей",
    )
    quantity = models.FloatField(
        verbose_name="Количество деталей(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# ПОДУЗЕЛ КОНЕЦ


# УЗЕЛ
# Модель узел
class unit(models.Model):
    name = models.CharField(
        max_length=200, verbose_name="Наименование", db_index=True
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Узел"
        verbose_name_plural = "Узлы"
        # ordering = ['']


# Модель соединитель узел и покупное оборудование
class unit_purchased(models.Model):
    belongs = models.ForeignKey(
        "unit",
        on_delete=models.PROTECT,
        db_index=True,
    )
    name = models.ForeignKey(
        "accounting_for_purchased_equipment",
        on_delete=models.PROTECT,
        verbose_name="Выбор покупного оборудования",
    )
    quantity = models.FloatField(
        verbose_name="Количество покупного оборудования(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель узел и детали
class unit_details(models.Model):
    belongs = models.ForeignKey(
        "unit",
        on_delete=models.PROTECT,
        db_index=True,
    )
    name = models.ForeignKey(
        "details",
        on_delete=models.PROTECT,
        verbose_name="Выбор деталей",
    )
    quantity = models.FloatField(
        verbose_name="Количество деталей(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель узел и подузел
class unit_under_the_node(models.Model):
    belongs = models.ForeignKey(
        "unit",
        on_delete=models.PROTECT,
        db_index=True,
    )
    name = models.ForeignKey(
        "under_the_node",
        on_delete=models.PROTECT,
        verbose_name="Выбор подузла",
    )
    quantity = models.FloatField(
        verbose_name="Количество подузлов(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# УЗЕЛ КОНЕЦ


# СБОРОЧНАЯ ЕДИНИЦА
# Модель сборочная единица
class assembly_unit(models.Model):
    name = models.CharField(
        max_length=200, verbose_name="Наименование", db_index=True
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "Сборочная единица"
        verbose_name_plural = "Сборочные единицы"
        # ordering = ['']


# Модель соединитель сборочная единица и покупное оборудование
class assembly_unit_purchased(models.Model):
    belongs = models.ForeignKey(
        "assembly_unit",
        on_delete=models.PROTECT,
        db_index=True,
    )
    name = models.ForeignKey(
        "accounting_for_purchased_equipment",
        on_delete=models.PROTECT,
        verbose_name="Выбор покупного оборудования",
    )
    quantity = models.FloatField(
        verbose_name="Количество покупного оборудования(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель сборочная единица и детали
class assembly_unit_details(models.Model):
    belongs = models.ForeignKey(
        "assembly_unit",
        on_delete=models.PROTECT,
        db_index=True,
    )
    name = models.ForeignKey(
        "details",
        on_delete=models.PROTECT,
        verbose_name="Выбор деталей",
    )
    quantity = models.FloatField(
        verbose_name="Количество деталей(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель сборочная единица и подузел
class assembly_unit_under_the_node(models.Model):
    belongs = models.ForeignKey(
        "assembly_unit",
        on_delete=models.PROTECT,
        db_index=True,
    )
    name = models.ForeignKey(
        "under_the_node",
        on_delete=models.PROTECT,
        verbose_name="Выбор подузла",
    )
    quantity = models.FloatField(
        verbose_name="Количество подузлов(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель сборочная единица и узел
class assembly_unit_unit(models.Model):
    belongs = models.ForeignKey(
        "assembly_unit",
        on_delete=models.PROTECT,
        db_index=True,
    )
    name = models.ForeignKey(
        "unit",
        on_delete=models.PROTECT,
        verbose_name="Выбор узла",
    )
    quantity = models.FloatField(
        verbose_name="Количество узлов(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# СБОРОЧНАЯ ЕДИНИЦА КОНЕЦ


# ОБЕКТНАЯ СБОРКА
# Модель соединитель объектная сборка и покупное оборудование
class object_assembly_purchased(models.Model):
    belongs = models.IntegerField(
        "object_assembly",
        db_index=True,
    )
    name = models.ForeignKey(
        "accounting_for_purchased_equipment",
        on_delete=models.PROTECT,
        verbose_name="Выбор покупного оборудования",
    )
    quantity = models.FloatField(
        verbose_name="Количество покупного оборудования(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель обектная сборка и сборочная единица
class object_assembly_assembly_unit(models.Model):
    belongs = models.IntegerField(
        "object_assembly",
        db_index=True,
    )
    name = models.ForeignKey(
        "assembly_unit",
        on_delete=models.PROTECT,
        verbose_name="Выбор сборочной единицы",
    )
    quantity = models.FloatField(
        verbose_name="Количество сборочных единиц(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель обектная сборка и подузлы
class object_assembly_under_the_node(models.Model):
    belongs = models.IntegerField(
        "object_assembly",
        db_index=True,
    )
    name = models.ForeignKey(
        "under_the_node",
        on_delete=models.PROTECT,
        verbose_name="Выбор подузла",
    )
    quantity = models.FloatField(
        verbose_name="Количество подузлов(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель обектная сборка и узлы
class object_assembly_unit(models.Model):
    belongs = models.IntegerField(
        "object_assembly",
        db_index=True,
    )
    name = models.ForeignKey(
        "unit",
        on_delete=models.PROTECT,
        verbose_name="Выбор узла",
    )
    quantity = models.FloatField(
        verbose_name="Количество узлов(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель объектная сборка и детали
class object_assembly_details(models.Model):
    belongs = models.IntegerField(
        "object_assembly",
        db_index=True,
    )
    name = models.ForeignKey(
        "details",
        on_delete=models.PROTECT,
        verbose_name="Выбор сборочной единицы",
    )
    quantity = models.FloatField(
        verbose_name="Количество сборочных единиц(шт.)",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# Модель соединитель объектная сборка и проектное оборудование
class object_assembly_project_equipment(models.Model):
    belongs = models.IntegerField(
        "object_assembly",
        db_index=True,
    )
    name = models.ForeignKey(
        "ProjectEquipment",
        on_delete=models.PROTECT,
        verbose_name="Выбор проектного оборудования",
        related_name="project_equipments",
    )
    quantity = models.FloatField(
        verbose_name="Количество",
    )
    unit = models.CharField(
        default="шт",
        verbose_name="Единица измерения",
    )


# ОБЕКТНАЯ СБОРКА КОНЕЦ
class ContractStatus(models.Model):
    contract_id = models.IntegerField()
    open_date = models.DateTimeField()
    close_date = models.DateTimeField(null=True)
