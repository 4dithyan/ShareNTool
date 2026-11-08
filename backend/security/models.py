from django.db import models
from django.contrib.auth.models import User
from bookings.models import Booking

VERIFY_TYPES = [
    ('handover', 'Handover to Renter'),
    ('return', 'Return to Owner'),
]

class SecurityVerification(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='security_checks')
    verification_type = models.CharField(max_length=20, choices=VERIFY_TYPES)
    otp_entered = models.CharField(max_length=10)
    is_verified = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.verification_type} verification for Booking #{self.booking_id} ({self.is_verified})"

class DamageReport(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='damage_reports')
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    issue_title = models.CharField(max_length=200)
    description = models.TextField()
    damage_fee_requested = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, default='under_review') # under_review, resolved, deducted
    evidence_image_url = models.CharField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Damage Report #{self.id} for Booking #{self.booking_id}"

