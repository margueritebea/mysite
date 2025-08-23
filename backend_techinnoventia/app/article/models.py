from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify


User = get_user_model()

class Category(models.Model):
    """
    This model represents a category.
    It contains the name, the slug, and the description.
    """
    name = models.CharField(max_length=255, unique = True)
    slug = models.SlugField(max_length=100, unique=True, null = True, blank = True)
    description = models.TextField(null = True, blank = True)

    def __str__(self):
        return f"{self.name}: {self.description}" if self.description else self.name


class Topic(models.Model):
    """
    This model represents a topic.
    It contains the name, the category, and the slug.
    """
    name = models.CharField(max_length = 255)
    category = models.ForeignKey(Category, on_delete = models.CASCADE, related_name = "topics")
    slug = models.SlugField(max_length=100, unique=True, null = True, blank = True)

    def __str__(self):
        return f"{self.name}: {self.description}" if self.description else self.name


class Article(models.Model):
    """
    This model represents an article.
    It contains the title, the image, the introduction, the slug, the created_at, the updated_at, the author, the topics, and the is_published field.
    """
    title = models.CharField(max_length = 255)
    image = models.ImageField(null = True, blank = True, default = "img/default_article.png")
    introduction = models.TextField(null = True, blank = True)
    slug = models.SlugField(max_length=100, unique=True, null = True, blank = True)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    author = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "articles")
    topics = models.ManyToManyField(Topic, blank = True, related_name = "articles")
    is_published = models.BooleanField(default = False)

    def __str__(self):
        return f"{self.title[:50]}..." if len(self.title) > 50 else self.title


class ArticleSection(models.Model):
    """
    This model represents the different sections of an article.
    It contains the subtitle, the content, the image, and the order of the section.
    It also contains the boolean fields to indicate the status of the section.
    """
    article = models.ForeignKey(Article, on_delete = models.CASCADE, related_name = "sections")
    order = models.IntegerField(default = 1)
    subtitle = models.CharField(max_length = 255, null = True, blank = True)
    content = models.TextField(null = True, blank = True)
    image = models.ImageField(null = True, blank = True)
    is_published = models.BooleanField(default = False)
    is_featured = models.BooleanField(default = False)
    is_archived = models.BooleanField(default = False)
    is_deleted = models.BooleanField(default = False)
    is_draft = models.BooleanField(default = False)
    is_pending = models.BooleanField(default = False)
    is_approved = models.BooleanField(default = False)
    is_rejected = models.BooleanField(default = False)

    class Meta:
        unique_together = ('article', 'order')
        verbose_name = "Section"
        verbose_name_plural = "Sections"
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.subtitle)
        super().save(*args, **kwargs)

    def __str__(self):
            return f"{self.subtitle}" if self.subtitle else f"Section de {self.article.title}"



class Comment(models.Model):
    """
    This model represents a comment.
    It contains the content, the author, the article, and the parent comment.
    """
    content = models.TextField()
    author = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "comments_written")
    article = models.ForeignKey(Article, on_delete = models.CASCADE, related_name = "comments")
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.content[:80]}..." if len(self.content) > 80 else self.content



class Reactions(models.Model):
    """
    This model represents a reaction.
    It contains the author, the article, the type of reaction, and the date of the reaction.
    """
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "reactions")
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='reactions')
    type_reaction = models.CharField(
        max_length=50,
        choices=[
            ("like", "Like"),
            ("dislike", "Dislike"),
        ]
    )
    date_reaction = models.DateTimeField(auto_now = True)

    class Meta:
        unique_together = ('author', 'article', 'type_reaction')  # Empêche plusieurs réactions du même type par utilisateur/publication

    def __str__(self):
        return f"{self.author} a réagi sur {self.article} avec {self.get_type_reaction_display()}"

