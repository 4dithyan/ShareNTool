from rest_framework import serializers
from .models import Tool
from accounts.serializers import UserSerializer
from django.contrib.auth.models import User

class ToolSerializer(serializers.ModelSerializer):
    owner_details = UserSerializer(source='owner', read_only=True)
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='owner', write_only=True, required=False
    )

    class Meta:
        model = Tool
        fields = [
            'id', 'owner', 'owner_id', 'owner_details', 'title', 'category',
            'description', 'price_per_day', 'security_deposit', 'city',
            'locality', 'condition', 'image_url', 'is_available', 'brand',
            'rules_and_safety', 'created_at', 'updated_at'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']
