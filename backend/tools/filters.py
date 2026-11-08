import django_filters
from django.db.models import Q
from .models import Tool

class ToolFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price_per_day", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price_per_day", lookup_expr='lte')
    city = django_filters.CharFilter(field_name="city", lookup_expr='icontains')
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Tool
        fields = ['category', 'city', 'condition', 'is_available']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(locality__icontains=value) |
            Q(brand__icontains=value)
        )
