from django.contrib import admin
from .models import WeatherSearch

@admin.register(WeatherSearch)
class WeatherSearchAdmin(admin.ModelAdmin):
    list_display = ('location', 'search_time')
    search_fields = ('location',)
    list_filter = ('search_time',)
