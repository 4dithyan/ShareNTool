from rest_framework import serializers
from .models import SecurityVerification, DamageReport
from accounts.serializers import UserSerializer

class SecurityVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityVerification
        fields = '__all__'

class DamageReportSerializer(serializers.ModelSerializer):
    reporter_details = UserSerializer(source='reported_by', read_only=True)

    class Meta:
        model = DamageReport
        fields = [
            'id', 'booking', 'reported_by', 'reporter_details', 'issue_title',
            'description', 'damage_fee_requested', 'status', 'evidence_image_url',
            'created_at'
        ]
        read_only_fields = ['reported_by', 'created_at']

