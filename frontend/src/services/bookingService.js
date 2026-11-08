import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
  },
  getMyRentals: async (userId) => {
    const response = await api.get('/bookings/my_rentals/', {
      params: userId ? { userId } : {}
    });
    return response.data;
  },
  getOwnerBookings: async (userId) => {
    const response = await api.get('/bookings/owner_bookings/', {
      params: userId ? { userId } : {}
    });
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.post(`/bookings/${id}/update_status/`, { status });
    return response.data;
  },
  verifyHandover: async (bookingId, otp) => {
    const response = await api.post('/security/verify/verify_handover/', { booking_id: bookingId, otp });
    return response.data;
  },
  verifyReturn: async (bookingId, otp) => {
    const response = await api.post('/security/verify/verify_return/', { booking_id: bookingId, otp });
    return response.data;
  },
  reportDamage: async (damageData) => {
    const response = await api.post('/security/damage-reports/', damageData);
    return response.data;
  },
  getDamageReports: async () => {
    const response = await api.get('/security/damage-reports/');
    return response.data;
  }
};

