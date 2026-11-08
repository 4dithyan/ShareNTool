from django.db import models
from django.contrib.auth.models import User

TOOL_CATEGORIES = [
    ('power-tools', 'Power Tools (Drills, Saws)'),
    ('cleaning', 'Cleaning & Vacuum (Wet/Dry, Steamers)'),
    ('ladders-scaffolding', 'Ladders & Heights'),
    ('gardening', 'Gardening & Lawn Care'),
    ('hand-tools', 'Hand Tools & Toolkits'),
    ('painting', 'Painting & Decorating'),
    ('automotive', 'Automotive Tools'),
    ('plumbing', 'Plumbing & Pipe Tools'),
    ('others', 'Other Household Equipment'),
]

TOOL_CONDITION = [
    ('brand_new', 'Brand New / Like New'),
    ('good', 'Good Working Condition'),
    ('fair', 'Fair / Heavy Duty'),
]

class Tool(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tools')
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=TOOL_CATEGORIES, default='power-tools')
    description = models.TextField()
    price_per_day = models.DecimalField(max_digits=8, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=8, decimal_places=2, default=500.00)
    city = models.CharField(max_length=100, default='New Delhi')
    locality = models.CharField(max_length=150, default='Connaught Place')
    condition = models.CharField(max_length=20, choices=TOOL_CONDITION, default='good')
    image_url = models.CharField(
        max_length=500,
        default='https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    )
    is_available = models.BooleanField(default=True)
    brand = models.CharField(max_length=100, blank=True, default='Bosch')
    rules_and_safety = models.TextField(blank=True, default='Please wear safety goggles. Clean tool after use.')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (₹{self.price_per_day}/day)"

