from django.db import models
from django.utils import timezone

class WeatherSearch(models.Model):
    """Model to store user weather searches"""
    location = models.CharField(max_length=100)
    search_time = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.location} - {self.search_time.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        ordering = ['-search_time']
        verbose_name_plural = "Weather Searches"

