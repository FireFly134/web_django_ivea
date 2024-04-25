from typing import Any


def update_see_id(objects: Any) -> None:
    for i, obj in enumerate(objects):
        obj.see_id = (
            str(obj.pk)
            if obj.parent is None
            else f"{obj.parent.get_see_id()}.{i + 1}"
        )
        obj.save()

        for index, child in enumerate(obj.children.all()):
            child.see_id = f"{child.parent.get_see_id()}.{index + 1}"
            child.save()
            update_see_id(child.children.all())
