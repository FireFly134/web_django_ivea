from typing import Any

from django.core.management.base import BaseCommand

from documents.service_for_doc_list import upgrade_db

from employee_cards.services import CounterpartiesDBService

from global_utils import DownloadManager

from invoice_analysis.services import InvoiceSaver

from main.utils import pull_contract_status_db

from overhead_costs.services import OverheadCostsCompiler

from router_table.utils import router_depends_update


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> None:
        InvoiceSaver(
            DownloadManager().download(
                [
                    "/test_schet/Scheta.csv",
                    "/test_schet2/Scheta.csv",
                ],
            )
        ).save()

        overhead_compiler = OverheadCostsCompiler()
        overhead_compiler.data_processing()
        overhead_compiler.year_dict

        CounterpartiesDBService().update_counterparties_in_db()

        pull_contract_status_db()

        router_depends_update()

        upgrade_db()
