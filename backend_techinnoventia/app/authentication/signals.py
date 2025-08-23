from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

from . models import Profil, User

@receiver(post_save, sender = settings.AUTH_USER_MODEL)
def create_user_profil(sender, instance, created, **kwargs):
    if created:
        # Create related profile only once, at user creation time
        Profil.objects.create(user=instance)

@receiver(post_save, sender = settings.AUTH_USER_MODEL)
def save_user_profil(sender, instance, created=False, **kwargs):
    # If a profile exists, keep it in sync; otherwise, do nothing here
    try:
        profil = instance.profil
    except Profil.DoesNotExist:
        return
    profil.save()
