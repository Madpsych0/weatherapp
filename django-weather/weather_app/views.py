import json
import requests
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.http import require_http_methods
from .models import WeatherSearch

def get_weather_data(location):
    """Helper function to fetch weather data from WeatherAPI.com"""
    api_key = settings.WEATHER_API_KEY
    current_url = f"https://api.weatherapi.com/v1/current.json?key={api_key}&q={location}&aqi=no"
    forecast_url = f"https://api.weatherapi.com/v1/forecast.json?key={api_key}&q={location}&days=3&aqi=no&alerts=no"
    
    try:
        current_response = requests.get(current_url)
        current_data = current_response.json()
        
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()
        
        # Save the search to database
        WeatherSearch.objects.create(location=location)
        
        return {
            'current': current_data,
            'forecast': forecast_data,
            'error': None
        }
    except Exception as e:
        return {
            'current': None,
            'forecast': None,
            'error': str(e)
        }

def forecast(request):
    """Detailed forecast view"""
    default_location = "Kottayam"
    location = request.GET.get('location', default_location)
    
    # Get 7-day forecast
    api_key = settings.WEATHER_API_KEY
    forecast_url = f"https://api.weatherapi.com/v1/forecast.json?key={api_key}&q={location}&days=7&aqi=no&alerts=yes"
    
    try:
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()
        error = None
    except Exception as e:
        forecast_data = None
        error = str(e)
    
    context = {
        'forecast_data': forecast_data,
        'location': location,
        'error': error,
    }
    
    return render(request, 'weather_app/forecast.html', context)

def history(request):
    """Weather history view"""
    default_location = "Kottayam"
    location = request.GET.get('location', default_location)
    date = request.GET.get('date', '')
    
    history_data = None
    error = None
    
    if date:
        # Get historical weather data
        api_key = settings.WEATHER_API_KEY
        history_url = f"https://api.weatherapi.com/v1/history.json?key={api_key}&q={location}&dt={date}"
        
        try:
            history_response = requests.get(history_url)
            history_data = history_response.json()
        except Exception as e:
            error = str(e)
    
    context = {
        'history_data': history_data,
        'location': location,
        'date': date,
        'error': error,
    }
    
    return render(request, 'weather_app/history.html', context)

def about(request):
    """About page view"""
    return render(request, 'weather_app/about.html')
