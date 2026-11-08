from django.db import models
from bookings.models import Booking

PAYMENT_METHODS = [
    ('upi', 'UPI (Google Pay / PhonePe / Paytm)'),
    ('card', 'Debit / Credit Card (Dummy)'),
    ('netbanking', 'Net Banking (Demo Gateway)'),
    ('cash_on_pickup', 'Pay Cash on Handover'),
]

PAYMENT_STATUS = [
    ('pending', 'Pending'),
    ('paid', 'Paid (Escrow Secured)'),
    ('refunded', 'Refunded / Deposit Returned'),
    ('failed', 'Failed'),
]

class Payment(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHODS, default='upi')
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='paid')
    deposit_refunded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment #{self.transaction_id} - ₹{self.amount} ({self.status})"
