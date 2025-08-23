from django.contrib import admin

from .models import Article, ArticleSection, Category, Topic, Comment, Reactions

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    """
    Article model admin
    """
    list_display = ("title", "author", "created_at")
    list_filter = ("created_at", "author")
    search_fields = ("title", "author__username")
    ordering = ("-created_at",)

@admin.register(ArticleSection)
class ArticleSectionAdmin(admin.ModelAdmin):
    """
    Article section model admin
    """
    list_display = ("article", "order", "subtitle")
    list_filter = ("article", "order")
    search_fields = ("article__title", "subtitle")
    ordering = ("article", "order")

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Category model admin
    """
    list_display = ("name", "description")
    search_fields = ("name", "description")

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    """
    Topic model admin
    """
    list_display = ("name", "category")
    search_fields = ("name", "category__name")

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """
    Comment model admin
    """
    list_display = ("content", "author", "article", "created_at")
    list_filter = ("article", "created_at")
    search_fields = ("content", "author__username", "article__title")

@admin.register(Reactions)
class ReactionsAdmin(admin.ModelAdmin):
    """
    Reactions model admin
    """
    list_display = ("author", "article", "type_reaction", "date_reaction")
    list_filter = ("author", "article", "type_reaction")
    search_fields = ("author__username", "article__title", "type_reaction")
    ordering = ("-date_reaction",)