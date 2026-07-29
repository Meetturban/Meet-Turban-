import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBooking } from '@backend/services/bookingService';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    altMobile: ''
  });

  const [eventDetails, setEventDetails] = useState({
    venue: '',
    city: 'Jaipur',
    eventDate: '',
    eventTime: '10:00'
  });

  const [selectedServices, setSelectedServices] = useState(() => {
    try {
      const saved = localStorage.getItem('safa_cart_services');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [submittedBooking, setSubmittedBooking] = useState(null);

  // Sync selected services to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('safa_cart_services', JSON.stringify(selectedServices));
    } catch (e) {}
  }, [selectedServices]);

  // Sync user details if user logs in
  useEffect(() => {
    if (user) {
      setCustomerDetails(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        mobile: prev.mobile || user.mobile || ''
      }));
    }
  }, [user]);

  // Service cart controls
  const addService = (service) => {
    setSelectedServices(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeService = (serviceId) => {
    setSelectedServices(prev => prev.filter(item => item.id !== serviceId));
  };

  const updateServiceQuantity = (serviceId, newQty) => {
    if (newQty <= 0) {
      removeService(serviceId);
      return;
    }
    setSelectedServices(prev =>
      prev.map(item => item.id === serviceId ? { ...item, quantity: newQty } : item)
    );
  };

  // Financial calculations
  const totalAmount = selectedServices.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const advanceRequired = Math.round(totalAmount * 0.20);
  const outstandingAmount = totalAmount - advanceRequired;

  // Submit complete booking
  const submitBooking = async () => {
    const payload = {
      customerId: user?.id || null,
      customerName: customerDetails.name,
      customerMobile: customerDetails.mobile,
      customerAltMobile: customerDetails.altMobile,
      venue: eventDetails.venue,
      city: eventDetails.city,
      eventDate: eventDetails.eventDate,
      eventTime: eventDetails.eventTime,
      services: selectedServices
    };

    const res = await createBooking(payload);
    if (res.success) {
      setSubmittedBooking(res.booking);
      return res.booking;
    }
    return null;
  };

  const resetBooking = () => {
    setStep(1);
    setEventDetails({ venue: '', city: 'Jaipur', eventDate: '', eventTime: '10:00' });
    setSelectedServices([]);
    try {
      localStorage.removeItem('safa_cart_services');
    } catch (e) {}
    setSubmittedBooking(null);
  };

  return (
    <BookingContext.Provider value={{
      step,
      setStep,
      customerDetails,
      setCustomerDetails,
      eventDetails,
      setEventDetails,
      selectedServices,
      addService,
      removeService,
      updateServiceQuantity,
      totalAmount,
      advanceRequired,
      outstandingAmount,
      submitBooking,
      submittedBooking,
      resetBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
