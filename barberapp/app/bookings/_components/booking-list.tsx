"use client";

import { Booking } from "@prisma/client";


interface BookingListProps {
    booking: Booking
}

const BookingList = ({booking}: BookingListProps) => {
  return ( 
    <div>
        <h2>{booking.id}</h2>
    </div>
  );
};

export default BookingList;