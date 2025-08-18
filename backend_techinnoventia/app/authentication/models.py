from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse


CUSTOM_USER = settings.AUTH_USER_MODEL

class User(AbstractUser):

    avatar = models.CharField(max_length=255,blank=True,null=True,
        default='https://exemple.com/chemin/vers/image-par-defaut.jpg'
        )
    slug = models.SlugField(blank = True, null = True, unique = True)
    def __str__(self):
        return f"{self.username}: {self.email}" if self.email else self.username

    def get_absolute_url(self):
        return reverse("app.authentication:users", kwargs = {"slug": self.slug})

    def save(self, *args, **kwargs):
        if not self.slug:
            slug_name = self.username or self.get_full_name()
            super().save(*args, **kwargs)
            self.slug = slugify(f"{slug_name}_{self.id}")
        super().save(*args, **kwargs)


class Profil(models.Model):
    user = models.OneToOneField(CUSTOM_USER, on_delete = models.CASCADE, related_name = "profil")
    image = models.ImageField(upload_to="profils/", blank = True, null = True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null = True, blank = True)

    ROLE_CHOICE = [("user", "Default User"), ("eleve", "Eleve"), ]
    role = models.CharField(max_length = 20, choices = ROLE_CHOICE, default = "user")

    def __str__(self):
        return f"profil of: {self.user.username}"
