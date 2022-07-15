from django.contrib import admin
from .models import *

# class TeamAdmin(admin.ModelAdmin):
#     search_fields = ('description',)
#     filter_horizontal = ('services',)
class details_admin(admin.ModelAdmin):
    list_display = ('name', 'link',)
    list_display_links = ('name',)
    search_fields = ('link', )
    filter = ('name', 'link',)
# class under_the_node_admin(admin.ModelAdmin):
#     list_display = ('id','name',)
#     list_display_links = ('name',)
#     search_fields = ('name',)
#     filter_horizontal = ('purchased', 'details',)
# class unit_admin(admin.ModelAdmin):
#     list_display = ('id', 'name',)
#     list_display_links = ('name',)
#     search_fields = ('name',)
#     filter_horizontal = ('purchased', 'under_the_node', 'details',)
# class assembly_unit_admin(admin.ModelAdmin):
#     list_display = ('id','name',)
#     list_display_links = ('name',)
#     search_fields = ('name',)
#     filter_horizontal = ('purchased', 'unit', 'under_the_node', 'details',)
# class object_assembly_admin(admin.ModelAdmin):
#     list_display = ('id', 'name',)
#     list_display_links = ('name',)
#     search_fields = ('name',)
#     filter_horizontal = ('assembly_unit', 'purchased',)

# admin.site.register(under_the_node, under_the_node_admin)
admin.site.register(accounting_for_purchased_equipment)
admin.site.register(accounting_of_services_and_equipment)
# admin.site.register(accounting_of_services_and_equipment_description, TeamAdmin)
admin.site.register(details, details_admin)
# admin.site.register(unit, unit_admin)
# admin.site.register(assembly_unit, assembly_unit_admin)
# admin.site.register(object_assembly, object_assembly_admin)