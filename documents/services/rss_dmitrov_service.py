from typing import Any

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render

from invoice_analysis.models import ContractInvoice

from ..models import RSSDmitrov, RSSDmitrovStage


class RSSDmitrovService:
    def __init__(self, rss_id: int) -> None:
        self.rss = RSSDmitrov.objects.get(pk=rss_id)

    @staticmethod
    def delete_rss_dmitrov_stage(
        rss_stage_id: int,
    ) -> JsonResponse:
        RSSDmitrovStage.objects.filter(pk=rss_stage_id).delete()
        return JsonResponse({"success": True})

    def add_rss_group(
        self,
        new_rss_id: int,
    ) -> None:
        adding_rss = RSSDmitrov.objects.get(id=new_rss_id)

        for rss in self.rss.related_rss.all():
            rss.related_rss.add(adding_rss)

        self.rss.related_rss.add(adding_rss)

        self.rss.save()

    @staticmethod
    def delete_all_existing_yandex_path(
        path: str,
        key: str,
    ) -> None:
        all_rss = RSSDmitrov.objects.all()

        for rss in all_rss:
            current_paths = getattr(rss, key)
            if path in current_paths:
                current_paths.remove(path)
                setattr(rss, key, current_paths)
                rss.save()

    @staticmethod
    def update_rss_yandex_paths(
        rss: RSSDmitrov,
        key: str,
        paths: Any,
        save: bool = False,
    ) -> None:
        if hasattr(rss, key):
            current_paths = getattr(rss, key)
            if not isinstance(current_paths, list):
                raise ValueError("Ошибка ключа папки!")
            current_paths.extend(paths)
            setattr(rss, key, current_paths)
            if save:
                rss.save()
        else:
            raise ValueError("Ошибка ключа папки!")

    def update_invoice_connection(self, invoice_id: int) -> JsonResponse:
        if invoice_id in self.rss.connected_invoices_id_array:
            self.rss.connected_invoices_id_array.remove(invoice_id)
        else:
            self.rss.connected_invoices_id_array.append(invoice_id)

        self.rss.save()

        return JsonResponse(
            {
                "success": True,
                "message": "Обновлено",
            }
        )

    def render_detail_page(self, request: HttpRequest) -> HttpResponse:
        context = {
            "rss": self.rss,
            "all_rss": RSSDmitrov.objects.all().exclude(id=self.rss.id),
            "invoices": ContractInvoice.objects.filter(contract_id=260),
        }

        return render(request, "rss/rss_detail.html", context)

    def update_stage(self, data: dict[str, str]) -> JsonResponse:
        validate_status = self.__validate_data(data)

        if validate_status:
            return validate_status

        self.rss.submitted_for_approval = self.__get_checkbox_stauts(
            data,
            "submitted_for_approval",
        )
        self.rss.approved_by_supervision = self.__get_checkbox_stauts(
            data,
            "approved_by_supervision",
        )
        self.rss.originals_is_signed = self.__get_checkbox_stauts(
            data,
            "originals_is_signed",
        )
        self.rss.ks_pto_flag = self.__get_checkbox_stauts(
            data,
            "ks_pto_flag",
        )
        self.rss.ks_ivea_flag = self.__get_checkbox_stauts(
            data,
            "ks_ivea_flag",
        )
        self.rss.ks_ps_flag = self.__get_checkbox_stauts(
            data,
            "ks_ps_flag",
        )

        self.__update_existing_stages(data)

        if data["volume"] != "":
            self.__create_stage(data)

        try:
            self.__check_and_update_new_volume(data)
        except ValueError:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Проверьте формат фактического объёма",
                }
            )

        if self.__check_additional_is_required():
            self.rss.additional_is_required = True
        else:
            self.rss.additional_is_required = False

        self.__save_rss()

        return JsonResponse({"success": True})

    def __save_rss(self) -> None:
        self.rss.save()

    def __get_checkbox_stauts(
        self,
        data: dict[str, str],
        key: str,
    ) -> bool:
        return True if data.get(key, "") == "on" else False

    def __check_and_update_new_volume(
        self,
        data: dict[str, str],
    ) -> None:
        if data["new_volume"] != "":
            new_volume = float(data["new_volume"])
            self.rss.new_volume = new_volume
        else:
            self.rss.new_volume = None
            self.rss.basic_materials_total_cost = self.rss.volume * (
                self.rss.basic_materials_unit_cost
                if self.rss.basic_materials_unit_cost
                else 0
            )
            self.rss.smr_total_cost = self.rss.volume * (
                self.rss.smr_unit_cost if self.rss.smr_unit_cost else 0
            )
            self.rss.total_total_cost = self.rss.volume * (
                self.rss.total_unit_cost if self.rss.total_unit_cost else 0
            )

    def __validate_data(
        self,
        data: dict[str, str],
    ) -> JsonResponse | None:
        for stage in self.rss.stages.all():
            try:
                volume = float(data.get(f"{stage.id}_volume", ""))
                if volume <= 0:
                    return JsonResponse(
                        {
                            "success": False,
                            "message": "Значение объёма должно быть больше 0.",
                        }
                    )
            except ValueError:
                return JsonResponse(
                    {
                        "success": False,
                        "message": "Неверный формат объёма в одном из этапов.",
                    }
                )
        return None

    def __update_existing_stages(self, data: dict[str, str]) -> None:
        for stage in self.rss.stages.all():
            stage.application_submitted = self.__get_checkbox_stauts(
                data, f"{stage.id}_application_submitted"
            )
            stage.counterparty_offer = self.__get_checkbox_stauts(
                data, f"{stage.id}_counterparty_offer"
            )
            stage.has_distribution_letter = self.__get_checkbox_stauts(
                data, f"{stage.id}_has_distribution_letter"
            )
            stage.product_on_object = self.__get_checkbox_stauts(
                data, f"{stage.id}_product_on_object"
            )
            stage.volume = float(data[f"{stage.id}_volume"])

            if data[f"{stage.id}_work_name"] != "":
                stage.work_name = data[f"{stage.id}_work_name"]
            else:
                stage.work_name = None

            try:
                stage.unit_material_cost = float(
                    data[f"{stage.id}_unit_material_cost"]
                )
            except ValueError:
                stage.unit_material_cost = (
                    self.rss.basic_materials_unit_cost
                    if self.rss.basic_materials_unit_cost
                    else 0
                )

            stage.unit_smr_cost = (
                self.rss.smr_unit_cost if self.rss.smr_unit_cost else 0
            )

            stage.basic_materials_total_cost = (
                stage.volume * stage.unit_material_cost
            )
            stage.smr_total_cost = stage.volume * stage.unit_smr_cost
            stage.total_total_cost = (
                stage.basic_materials_total_cost + stage.smr_total_cost
            )

            stage.save()

    def __check_additional_is_required(self) -> bool:
        return sum(
            [
                stage.total_total_cost
                for stage in self.rss.stages.all()
                if stage.total_total_cost
            ]
        ) > (self.rss.total_total_cost if self.rss.total_total_cost else 0)

    def __create_stage(
        self,
        data: dict[str, str],
    ) -> None:
        application_submitted = self.__get_checkbox_stauts(
            data, "application_submitted"
        )
        counterparty_offer = self.__get_checkbox_stauts(
            data, "counterparty_offer"
        )
        has_distribution_letter = self.__get_checkbox_stauts(
            data, "has_distribution_letter"
        )
        product_on_object = self.__get_checkbox_stauts(
            data, "product_on_object"
        )
        volume = float(data["volume"])

        if data["work_name"] != "":
            work_name = data["work_name"]
        else:
            work_name = None

        if data["unit_material_cost"] == "":
            basic_materials_total_cost = (
                volume * self.rss.basic_materials_unit_cost
                if self.rss.basic_materials_unit_cost
                else None
            )
            unit_material_cost = (
                self.rss.basic_materials_unit_cost
                if self.rss.basic_materials_unit_cost
                else 0
            )
        else:
            unit_material_cost = float(data["unit_material_cost"])
            basic_materials_total_cost = volume * unit_material_cost

        smr_total_cost = (
            volume * self.rss.smr_unit_cost if self.rss.smr_unit_cost else None
        )
        unit_smr_cost = self.rss.smr_unit_cost if self.rss.smr_unit_cost else 0

        total_total_cost = (
            basic_materials_total_cost if basic_materials_total_cost else 0
        ) + (smr_total_cost if smr_total_cost else 0)

        RSSDmitrovStage.objects.create(
            rss_dmitrov_row=self.rss,
            work_name=work_name,
            volume=volume,
            basic_materials_total_cost=basic_materials_total_cost,
            smr_total_cost=smr_total_cost,
            total_total_cost=total_total_cost,
            application_submitted=application_submitted,
            counterparty_offer=counterparty_offer,
            has_distribution_letter=has_distribution_letter,
            product_on_object=product_on_object,
            unit_material_cost=unit_material_cost,
            unit_smr_cost=unit_smr_cost,
        )
