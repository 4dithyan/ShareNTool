from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Payment
from .serializers import PaymentSerializer
from bookings.models import Booking
import uuid

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer

    @action(detail=False, methods=['post'])
    def process_dummy_payment(self, request):
        booking_id = request.data.get('booking_id')
        method = request.data.get('payment_method', 'upi')
        amount = request.data.get('amount')

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        trx = f"PAY-COLLEGE-{uuid.uuid4().hex[:8].upper()}"
        payment = Payment.objects.create(
            booking=booking,
            amount=amount or booking.total_amount,
            payment_method=method,
            transaction_id=trx,
            status='paid'
        )
        # Advance booking state to active or approved
        booking.status = 'approved'
        booking.save()

        return Response({
            'message': 'Dummy payment processed successfully!',
            'transaction_id': trx,
            'payment': PaymentSerializer(payment).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def refund_deposit(self, request, pk=None):
        payment = self.get_object()
        payment.deposit_refunded = True
        payment.save()
        return Response({'message': 'Security deposit refunded back to renter account!', 'payment': PaymentSerializer(payment).data})

