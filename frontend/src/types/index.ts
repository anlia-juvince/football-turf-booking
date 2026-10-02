export type Turf = {
  id: number;
  name: string;
  city: string;
  address: string;
  price_per_hour: number;
  open_time: string;
  close_time: string;
  images: string[];
  amenities: string[];
};

export type Slot = {
  start_time: string;
  end_time: string;
  price: number;
  status: "available" | "booked";
};

export type Booking = {
  id: number;
  booking_code: string;
  name: string;
  phone: string;
  date: string;
  start_time: string;
  end_time: string;
  hours: number;
  amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
};