from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.db.models import Q
from . models import Article, ArticleSection, Comment


def index(request):
	return HttpResponse("<h1>Article page</h1>")


def index(request):
    """
    This view displays the index page of the articles.
    It displays the latest 5 published articles.
    """
    articles = Article.objects.filter(is_published = True).order_by('-created_at')
    recent_articles = articles[:5]

    context = {
        "articles": articles,
        "recent_articles": recent_articles,
        "banner_description": "Bienvenue sur notre page d'articles !",
        "breadcrumb_separator": "/",
    }
    return render(request, "articles/index.html", context)

def article_detail(request, article_id):
    """
    This view displays the detail page of an article.
    It displays the article, the similar articles, the banner image, the comments, and the breadcrumb separator.
    """
    article = get_object_or_404(Article, pk=article_id)
    similar_articles = Article.objects.filter(
        Q(topics__in=article.topics.all()) | Q(category=article.topics.first().category if article.topics.exists() else None)
    ).exclude(pk=article.pk).distinct()[:3]
    comments = Comment.objects.filter(article=article, parent=None).order_by('date_created')

    context = {
        "article": article,
        "similar_articles": similar_articles,
        "banner_image": article.image if article.image else None,
        "comments": comments,
        "breadcrumb_separator": "/",
    }
    return render(request, "articles/article_detail.html", context)
