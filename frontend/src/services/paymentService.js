import api from './api';

export const paymentService = {
  processDummyPayment: async (paymentData) => {
    const response = await api.post('/payments/process_dummy_payment/', paymentData);
    return response.data;
  },
  refundDeposit: async (paymentId) => {
    const response = await api.post(`/payments/${paymentId}/refund_deposit/`);
    return response.data;
  },
  getAllPayments: async () => {
    const response = await api.get('/payments/');
    return response.data;
  }
};

