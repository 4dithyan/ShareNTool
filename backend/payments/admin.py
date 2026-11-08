from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'booking', 'amount', 'payment_method', 'status', 'deposit_refunded', 'created_at')
    list_filter = ('payment_method', 'status', 'deposit_refunded')

