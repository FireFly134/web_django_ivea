from django.apps import AppConfig


class InvoiceAnalysisConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "invoice_analysis"

    def ready(self) -> None:
        from .signals import invoice_created_callback  # noqa
