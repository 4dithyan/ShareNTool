from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import SecurityVerification, DamageReport
from .serializers import SecurityVerificationSerializer, DamageReportSerializer
from bookings.models import Booking

class SecurityViewSet(viewsets.ModelViewSet):
    queryset = SecurityVerification.objects.all().order_by('-timestamp')
    serializer_class = SecurityVerificationSerializer

    @action(detail=False, methods=['post'])
    def verify_handover(self, request):
        booking_id = request.data.get('booking_id')
        otp = str(request.data.get('otp', '')).strip()

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        # Allow matching booking OTP or dummy master code 1234
        if otp == booking.handover_otp or otp == '1234':
            booking.status = 'active'
            booking.save()
            verify = SecurityVerification.objects.create(
                booking=booking,
                verification_type='handover',
                otp_entered=otp,
                is_verified=True,
                notes='Tool successfully handed over to renter.'
            )
            return Response({
                'success': True,
                'message': 'Handover Verified! Tool marked as ACTIVE rental.',
                'verification': SecurityVerificationSerializer(verify).data
            })
        return Response({'success': False, 'error': f'Incorrect OTP. Correct demo OTP is {booking.handover_otp}'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def verify_return(self, request):
        booking_id = request.data.get('booking_id')
        otp = str(request.data.get('otp', '')).strip()

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        if otp == booking.return_otp or otp == '1234':
            booking.status = 'returned'
            booking.tool.is_available = True
            booking.tool.save()
            booking.save()
            verify = SecurityVerification.objects.create(
                booking=booking,
                verification_type='return',
                otp_entered=otp,
                is_verified=True,
                notes='Tool securely returned to owner in good order. Security deposit unlocked.'
            )
            return Response({
                'success': True,
                'message': 'Return verified! Booking marked as RETURNED. Security deposit returned.',
                'verification': SecurityVerificationSerializer(verify).data
            })
        return Response({'success': False, 'error': f'Incorrect OTP. Correct demo OTP is {booking.return_otp}'}, status=status.HTTP_400_BAD_REQUEST)

class DamageReportViewSet(viewsets.ModelViewSet):
    queryset = DamageReport.objects.all().order_by('-created_at')
    serializer_class = DamageReportSerializer

    def perform_create(self, serializer):
        user_id = self.request.data.get('reported_by_id')
        if user_id:
            user = User.objects.filter(id=user_id).first()
        elif self.request.user and self.request.user.is_authenticated:
            user = self.request.user
        else:
            user = User.objects.first()
        serializer.save(reported_by=user)

