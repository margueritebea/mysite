from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.urls import reverse


class User(AbstractUser):
    """
    Custom User model extending AbstractUser.
    Includes avatar and slug.
    """
    avatar = models.ImageField(
        upload_to="avatars/", blank=True, null=True,
        default="avatars/default.png"
    )
    slug = models.SlugField(blank=True, null=True, unique=True)

    def __str__(self):
        return f"{self.username} ({self.email})" if self.email else self.username

    def get_absolute_url(self):
        return reverse("app.authentication:user_detail", kwargs={"slug": self.slug})

    def save(self, *args, **kwargs):
        if not self.slug:
            slug_name = self.username or self.get_full_name()
            self.slug = slugify(f"{slug_name}_{self.id or ''}")
        super().save(*args, **kwargs)


class Profil(models.Model):
    """
    User profile model linked to a User.
    Stores additional info like bio, phone, role, etc.
    """
    ROLE_CHOICES = [
        ("user", "Default User"),
        # ("eleve", "Eleve"),
        ("admin", "Admin"),
        ("moderator", "Moderator"),
        ("superadmin", "Superadmin"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profil")
    image = models.ImageField(upload_to="profils/", blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")

    def __str__(self):
        return f"Profil of {self.user.username}"

    def get_absolute_url(self):
        return reverse("app.authentication:user_profil", kwargs={"slug": self.user.slug})
