from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
def index(request):

	res_data = {"message": "hello", "data": {"list": [list(range(5,30,2))], "dico": {"username": "bea"}}}
	return JsonResponse(res_data)
