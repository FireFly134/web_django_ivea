from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="home_station"),  # go home Station
    path("check/", views.check_station, name="check"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, doctest_root=settings.MEDIA_ROOT)
