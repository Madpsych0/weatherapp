from django.urls import path
from . import views

urlpatterns = [
    path('', views.forecast, name='forecast'),
    path('history/', views.history, name='history'),
    path('about/', views.about, name='about'),
]
