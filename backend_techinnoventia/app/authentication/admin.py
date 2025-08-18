from django.contrib import admin

from . models import Profil, User


@admin.register(User)
class USerAdmin(admin.ModelAdmin):

    list_display = ["username", "email", "last_name", "is_active", "last_login"]
    list_filter = ("email",)
    search_fileds = ("email", "username")
    ordering = ("username",)
    # list_per_page = 15

    # class Meta:
    #     verbose_name = "User"
    #     verbose_name_plural = "Users"

@admin.register(Profil)
class ProfilAdmin(admin.ModelAdmin):
    pass


