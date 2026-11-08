from django.db import models
from django.contrib.auth.models import User
from tools.models import Tool

BOOKING_STATUS = [
    ('pending', 'Pending Approval'),
    ('approved', 'Approved / Awaiting Payment'),
    ('active', 'Active (Tool Handed Over)'),
    ('returned', 'Returned & Completed'),
    ('cancelled', 'Cancelled'),
]

class Booking(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, related_name='bookings')
    renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rentals')
    start_date = models.DateField()
    end_date = models.DateField()
    total_days = models.PositiveIntegerField(default=1)
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default='pending')
    handover_otp = models.CharField(max_length=6, default='4921')
    return_otp = models.CharField(max_length=6, default='8273')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.tool.title} by {self.renter.username} ({self.status})"

