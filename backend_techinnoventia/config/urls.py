
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/article/", include("app.article.urls")),
    path("home/", include("app.home.urls")),
    # path("api/auth/", include("djoser.urls")),
    # path("api/auth/", include("djoser.urls.authtoken")),

    # path("api/forum/", include("forum.urls")),
    path("api/auth/", include("app.authentication.urls")),
]


