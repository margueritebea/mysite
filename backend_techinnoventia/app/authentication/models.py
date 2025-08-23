from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse


CUSTOM_USER = settings.AUTH_USER_MODEL

class User(AbstractUser):
    """
    This model represents a user.
    It contains the avatar, the slug, the username, the email, and the password.
    """
    avatar = models.CharField(max_length=255,blank=True,null=True,
        default='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG0mU1hiNmdzqNKOq2N5c6qIxkFmeKNAhvfw&s'
        )
    slug = models.SlugField(blank = True, null = True, unique = True)
    def __str__(self):
        return f"{self.username}: {self.email}" if self.email else self.username

    def get_absolute_url(self):
        return reverse("app.authentication:users", kwargs = {"slug": self.slug})

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        if is_new:
            # Initial save to get an ID for slug generation
            super().save(*args, **kwargs)
            if not self.slug:
                slug_name = self.username or self.get_full_name()
                self.slug = slugify(f"{slug_name}_{self.id}")
            super().save(update_fields=["slug"])
            return
        if not self.slug:
            slug_name = self.username or self.get_full_name()
            self.slug = slugify(f"{slug_name}_{self.id}")
        super().save(*args, **kwargs)


class Profil(models.Model):
    """
    This model represents a profil.
    It contains the user, the image, the phone, the bio, the birth_date, and the role.
    """
    user = models.OneToOneField(CUSTOM_USER, on_delete = models.CASCADE, related_name = "profil")
    image = models.ImageField(upload_to="profils/", blank = True, null = True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null = True, blank = True)

    ROLE_CHOICE = [("user", "Default User"), ("eleve", "Eleve"), ("admin", "Admin"), ("moderator", "Moderator"), ("superadmin", "Superadmin")]
    role = models.CharField(max_length = 20, choices = ROLE_CHOICE, default = "user")
    slug = models.SlugField(blank=True, null=True, unique=True)

    def __str__(self):
        """
        This method returns the string representation of the profil.
        """ 
        return f"profil of: {self.user.username}"

    def save(self, *args, **kwargs):
        if not self.pk:
            super().save(*args, **kwargs)
            if not self.slug:
                self.slug = slugify(f"{self.user.username}_{self.id}")
            super().save(update_fields=["slug"])
            return
        if not self.slug:
            self.slug = slugify(f"{self.user.username}_{self.id}")
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        """
        Return the absolute URL for the current user's profile endpoint.
        """
        return reverse("app.authentication:user_profil")
