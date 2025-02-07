import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalPrice: 0,
    property: null,
  });

  const [bookingStep, setBookingStep] = useState(1);
  // Step 1: Initial booking form
  // Step 2: Booking summary
  // Step 3: Payment
  // Step 4: Confirmation

  const updateBooking = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setBookingStep(prev => prev + 1);
  const prevStep = () => setBookingStep(prev => prev - 1);

  return (
    <BookingContext.Provider value={{
      bookingData,
      updateBooking,
      bookingStep,
      nextStep,
      prevStep,
      setBookingStep
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);