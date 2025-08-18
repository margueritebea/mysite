from django.urls import path
from . import views

app_name = "app.article"

urlpatterns = [
    path("", views.index, name = "index"),

    # path('articles/', views.index, name='article_list'),
    path('<int:article_id>/', views.article_detail, name='article_detail'),
    # ... autres URLs
]

