from django.contrib import admin
from .models import Tool

@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'category', 'price_per_day', 'city', 'is_available', 'created_at')
    list_filter = ('category', 'city', 'is_available')
    search_fields = ('title', 'description', 'city', 'locality')

