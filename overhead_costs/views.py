from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect, render

from .forms import FileUploadForm
from .services import BankStatementService, OverheadCostsCompiler


def overhead(request: HttpRequest) -> HttpResponse:
    compiler = OverheadCostsCompiler()
    compiler.data_processing()
    context = {
        "invoices": compiler.invoices,
        "headers": compiler.headers,
        "years": compiler.year_dict,
    }

    return render(
        request,
        template_name="overhead_costs/index.html",
        context=context,
    )


@login_required
def upload_bank_statement(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = FileUploadForm(request.POST, request.FILES)
        if form.is_valid():
            BankStatementService([form.cleaned_data["file"].file]).update_db()
            return redirect("overhead_costs")
    else:
        form = FileUploadForm()
    return render(
        request, "overhead_costs/upload_bank_statement.html", {"form": form}
    )
