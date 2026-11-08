from rest_framework import serializers
from .models import Booking
from tools.serializers import ToolSerializer
from accounts.serializers import UserSerializer
from tools.models import Tool
from django.contrib.auth.models import User
import random

class BookingSerializer(serializers.ModelSerializer):
    tool_details = ToolSerializer(source='tool', read_only=True)
    renter_details = UserSerializer(source='renter', read_only=True)
    tool_id = serializers.PrimaryKeyRelatedField(queryset=Tool.objects.all(), source='tool', write_only=True)
    renter_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='renter', write_only=True, required=False)

    class Meta:
        model = Booking
        fields = [
            'id', 'tool', 'tool_id', 'tool_details', 'renter', 'renter_id', 'renter_details',
            'start_date', 'end_date', 'total_days', 'rent_amount', 'security_deposit',
            'total_amount', 'status', 'handover_otp', 'return_otp', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['renter', 'handover_otp', 'return_otp', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Auto generate 4-digit college dummy verification OTPs
        validated_data['handover_otp'] = str(random.randint(1000, 9999))
        validated_data['return_otp'] = str(random.randint(1000, 9999))
        return super().create(validated_data)

