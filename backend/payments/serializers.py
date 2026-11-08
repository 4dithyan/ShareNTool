from rest_framework import serializers
from .models import Payment
from bookings.serializers import BookingSerializer
import uuid

class PaymentSerializer(serializers.ModelSerializer):
    booking_details = BookingSerializer(source='booking', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_details', 'amount', 'payment_method',
            'transaction_id', 'status', 'deposit_refunded', 'created_at'
        ]
        read_only_fields = ['transaction_id', 'created_at']

    def create(self, validated_data):
        if 'transaction_id' not in validated_data or not validated_data['transaction_id']:
            validated_data['transaction_id'] = f"SNT-{uuid.uuid4().hex[:10].upper()}"
        return super().create(validated_data)

