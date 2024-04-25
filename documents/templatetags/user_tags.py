from typing import Any

from django import template


register = template.Library()


@register.filter("has_group")
def has_group(user: Any, group_name: Any) -> Any:
    groups = user.groups.all().values_list("name", flat=True)
    return True if group_name in groups else False
