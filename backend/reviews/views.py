from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        tool_id = self.request.query_params.get('tool_id')
        if tool_id:
            qs = qs.filter(tool_id=tool_id)
        return qs

    def perform_create(self, serializer):
        user_id = self.request.data.get('user_id')
        if user_id:
            user = User.objects.filter(id=user_id).first()
        elif self.request.user and self.request.user.is_authenticated:
            user = self.request.user
        else:
            user = User.objects.first()
        serializer.save(user=user)

