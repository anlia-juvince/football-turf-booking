import { api } from "./client";

export const getTurf = () => api.get("/turf").then((r) => r.data);

export const getSlots = (date: string) =>
  api.get(`/turf/slots`, { params: { date } }).then((r) => r.data);