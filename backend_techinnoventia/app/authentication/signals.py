from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import Profil


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def manage_user_profil(sender, instance, created, **kwargs):
    """
    Automatically create a profile when a new user is created.
    Ensure profile always exists.
    """
    if created:
        Profil.objects.create(user=instance)
    else:
        # Keep the profile in sync if it already exists
        if hasattr(instance, "profil"):
            instance.profil.save()
        else:
            Profil.objects.create(user=instance)
