from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SecurityViewSet, DamageReportViewSet

router = DefaultRouter()
router.register(r'verify', SecurityViewSet, basename='security-verify')
router.register(r'damage-reports', DamageReportViewSet, basename='damage-reports')

urlpatterns = [
    path('', include(router.urls)),
]

