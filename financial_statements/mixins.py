from django.contrib.auth.mixins import UserPassesTestMixin
from django.http import HttpRequest


class ReportOwnerRequiredMixin(UserPassesTestMixin):
    request: HttpRequest

    def test_func(self) -> bool:
        if self.request.user.is_superuser:
            return True
        report = self.get_object()  # type: ignore
        return bool(self.request.user == report.user)
