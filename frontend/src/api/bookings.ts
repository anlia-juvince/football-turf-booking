import { api } from "./client";

export const createBooking = (data: {
  name: string;
  phone: string;
  date: string;
  start_time: string;
  hours: number;
  payment_method: "upi" | "cod";
}) => api.post("/bookings", data).then((r) => r.data);

export const getBooking = (code: string) =>
  api.get(`/bookings/${code}`).then((r) => r.data);

export const getBookingsByPhone = (phone: string) =>
  api.get(`/bookings/by-phone`, { params: { phone } }).then((r) => r.data);

export const markPaid = (code: string) =>
  api.post(`/bookings/${code}/mark-paid`).then((r) => r.data);

export const cancelBooking = (code: string) =>
  api.post(`/bookings/${code}/cancel`).then((r) => r.data);