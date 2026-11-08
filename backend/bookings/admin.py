from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'tool', 'renter', 'start_date', 'end_date', 'total_amount', 'status')
    list_filter = ('status', 'start_date')
