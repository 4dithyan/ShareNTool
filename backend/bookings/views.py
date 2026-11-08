from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        renter_id = self.request.data.get('renter_id')
        if renter_id:
            try:
                renter = User.objects.get(id=renter_id)
            except User.DoesNotExist:
                renter = self.request.user if self.request.user.is_authenticated else User.objects.first()
        elif self.request.user and self.request.user.is_authenticated:
            renter = self.request.user
        else:
            renter = User.objects.first()
        serializer.save(renter=renter)

    @action(detail=False, methods=['get'])
    def my_rentals(self, request):
        user_id = request.query_params.get('userId')
        if user_id:
            bookings = Booking.objects.filter(renter_id=user_id).order_by('-created_at')
        elif request.user.is_authenticated:
            bookings = Booking.objects.filter(renter=request.user).order_by('-created_at')
        else:
            bookings = Booking.objects.all().order_by('-created_at')
        return Response(self.get_serializer(bookings, many=True).data)

    @action(detail=False, methods=['get'])
    def owner_bookings(self, request):
        user_id = request.query_params.get('userId')
        if user_id:
            bookings = Booking.objects.filter(tool__owner_id=user_id).order_by('-created_at')
        elif request.user.is_authenticated:
            bookings = Booking.objects.filter(tool__owner=request.user).order_by('-created_at')
        else:
            bookings = Booking.objects.all().order_by('-created_at')
        return Response(self.get_serializer(bookings, many=True).data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            booking.status = new_status
            booking.save()
            return Response({'message': f'Status updated to {new_status}', 'booking': self.get_serializer(booking).data})
        return Response({'error': 'No status provided'}, status=status.HTTP_400_BAD_REQUEST)

