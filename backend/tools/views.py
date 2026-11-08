from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from .models import Tool
from .serializers import ToolSerializer
from .filters import ToolFilter

class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all().order_by('-created_at')
    serializer_class = ToolSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ToolFilter

    def perform_create(self, serializer):
        # Allow passing user_id or fallback to request.user or first user for dummy demo convenience
        owner_id = self.request.data.get('owner_id')
        if owner_id:
            try:
                owner = User.objects.get(id=owner_id)
            except User.DoesNotExist:
                owner = self.request.user if self.request.user.is_authenticated else User.objects.first()
        elif self.request.user and self.request.user.is_authenticated:
            owner = self.request.user
        else:
            owner = User.objects.first()
        serializer.save(owner=owner)

    @action(detail=False, methods=['get'])
    def my_tools(self, request):
        user_id = request.query_params.get('userId')
        if user_id:
            tools = Tool.objects.filter(owner_id=user_id).order_by('-created_at')
        elif request.user.is_authenticated:
            tools = Tool.objects.filter(owner=request.user).order_by('-created_at')
        else:
            tools = Tool.objects.all().order_by('-created_at')[:3]
        serializer = self.get_serializer(tools, many=True)
        return Response(serializer.data)

