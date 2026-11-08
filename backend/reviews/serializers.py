from rest_framework import serializers
from .models import Review
from accounts.serializers import UserSerializer
from tools.models import Tool
from django.contrib.auth.models import User

class ReviewSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    tool_id = serializers.PrimaryKeyRelatedField(queryset=Tool.objects.all(), source='tool', write_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True, required=False)

    class Meta:
        model = Review
        fields = ['id', 'tool', 'tool_id', 'user', 'user_id', 'user_details', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

