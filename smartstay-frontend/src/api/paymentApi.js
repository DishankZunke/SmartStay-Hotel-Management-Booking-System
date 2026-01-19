import api from "./api";

// Create Razorpay order
export const createOrder = async (bookingId) => {
  const res = await api.post(`/api/payments/create-order/${bookingId}`);
  return res.data; // Razorpay order object
};

// Verify payment
export const verifyPayment = async (data) => {
  const res = await api.post("/api/payments/verify", data);
  return res.data;
};
