from django.urls import path
from . import views

app_name = "app.home"

urlpatterns = [
   path("", views.index, name = "index"),
]

