import { api } from "./client";

const getKey = () => sessionStorage.getItem("admin_key") || "";

const adminHeaders = () => ({ "x-admin-key": getKey() });

export const getAdminBookings = (date: string) =>
  api
    .get("/admin/bookings", { params: { date }, headers: adminHeaders() })
    .then((r) => r.data);

export const getAdminSummary = (date: string) =>
  api
    .get("/admin/summary", { params: { date }, headers: adminHeaders() })
    .then((r) => r.data);

export const markCollected = (code: string) =>
  api
    .post(`/admin/bookings/${code}/mark-collected`, {}, { headers: adminHeaders() })
    .then((r) => r.data);

export const adminCancel = (code: string) =>
  api
    .post(`/admin/bookings/${code}/cancel`, {}, { headers: adminHeaders() })
    .then((r) => r.data);