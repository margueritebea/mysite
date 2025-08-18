from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null = True, blank = True)

    def __str__(self):
        return f"{self.name}: {self.description}" if self.description else self.name


class Topic(models.Model):
    name = models.CharField(max_length = 255)
    category = models.ForeignKey(Category, on_delete = models.CASCADE, related_name = "topics")

    def __str__(self):
        return f"{self.name}: {self.description}" if self.description else self.name


class Article(models.Model):

    title = models.CharField(max_length = 255)
    image = models.ImageField(null = True, blank = True, default = "img/default_article.png")
    introduction = models.TextField(null = True, blank = True)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    author = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "articles")
    topics = models.ManyToManyField(Topic, blank = True, related_name = "articles")

    def __str__(self):
        return f"{self.title[:50]}..." if len(self.title) > 50 else self.title


class ArticleSection(models.Model):
    """docstring for ArticleSection.
        ceci corespomd au differentes section d'un article
    """
    article = models.ForeignKey(Article, on_delete = models.CASCADE, related_name = "sections")
    order = models.IntegerField(default = 1)
    subtitle = models.CharField(max_length = 255, null = True, blank = True)
    content = models.TextField(null = True, blank = True)
    image = models.ImageField(null = True, blank = True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
            return f"{self.subtitle}" if self.subtitle else f"Section de {self.article.title}"



class Comment(models.Model):
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

