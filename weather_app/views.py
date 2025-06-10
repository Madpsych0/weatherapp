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
    try:
        api_key = settings.WEATHER_API_KEY
        location = request.GET.get('location', 'Kottayam')
        # Add days=7 parameter to get 7-day forecast
        forecast_url = f"https://api.weatherapi.com/v1/forecast.json?key={api_key}&q={location}&days=7&aqi=no"
        response = requests.get(forecast_url)
        
        if response.status_code == 200:
            forecast_data = response.json()            
            if 'forecast' in forecast_data and 'forecastday' in forecast_data['forecast']:
                for day in forecast_data['forecast']['forecastday']:
                    pass  # Removed debug print
                return render(request, 'weather_app/forecast.html', {
                    'forecast_data': forecast_data,
                    'location': location
                })
            else:
                error = "Invalid forecast data structure"
        else:
            error = f"Unable to fetch forecast data: {response.status_code}"
            
    except Exception as e:
        error = str(e)
    
    return render(request, 'weather_app/forecast.html', {
        'error': error,
        'location': location
    })

def history(request):
    """Weather history view"""
    default_location = "Kottayam"
    location = request.GET.get('location', default_location)
    date = request.GET.get('date')
    
    if not date:
        return render(request, 'weather_app/history.html', {
            'location': location
        })
    
    try:
        api_key = settings.WEATHER_API_KEY
        history_url = f"https://api.weatherapi.com/v1/history.json?key={api_key}&q={location}&dt={date}"
        response = requests.get(history_url)
        
        if response.status_code == 200:
            history_data = response.json()
            return render(request, 'weather_app/history.html', {
                'location': location,
                'date': date,
                'history_data': history_data
            })
        else:
            error = "Unable to fetch weather data the following data might be deleted from server or not forecasted yet. Please try again."
            
    except Exception as e:
        error = str(e)
    
    return render(request, 'weather_app/history.html', {
        'location': location,
        'date': date,
        'error': error
    })

def about(request):
    """About page view"""
    return render(request, 'weather_app/about.html')
