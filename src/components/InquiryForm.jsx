import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { inquiryAPI, serviceAPI } from '../services/api';

const InquiryForm = ({ serviceOptions: propServiceOptions = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serviceOptions, setServiceOptions] = useState(propServiceOptions);
  const [servicesLoading, setServicesLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Use provided services or load default ones immediately
  useEffect(() => {
    if (propServiceOptions && propServiceOptions.length > 0) {
      setServiceOptions(propServiceOptions);
    } else {
      // Set loading state
      setServicesLoading(true);
      
      // Fetch real services
      fetchServices().catch(() => {
        // If API fails, set default services as fallback
        setServiceOptions([
          { id: '1', name: 'Monthly Membership' },
          { id: '2', name: 'Personal Training' },
          { id: '3', name: 'Group Classes' },
          { id: '4', name: 'Free Trial Session' },
          { id: '5', name: 'Nutrition Consultation' }
        ]);
        setServicesLoading(false);
      });
    }
  }, [propServiceOptions]);

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getActive();
      const services = response.data.data.services.map(service => ({
        id: service._id,
        name: service.name
      }));
      setServiceOptions(services);
      setServicesLoading(false);
      return Promise.resolve();
    } catch (error) {
      console.warn('Could not fetch services, using defaults:', error);
      // Re-throw to be handled by the caller
      setServicesLoading(false);
      return Promise.reject(error);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      if (!data.service) {
        toast.error('Please select a service');
        setIsLoading(false);
        return;
      }
      
      // Check if the selected service is a temporary ID (numeric string)
      if (/^\d+$/.test(data.service)) {
        toast.error('Services are still loading. Please wait a moment and try again.');
        setIsLoading(false);
        return;
      }

      const response = await inquiryAPI.create({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        service: data.service,
        message: data.message.trim(),
        preferredTime: data.preferredTime
      });
      
      if (response.data.status === 'success') {
        toast.success('✓ Inquiry submitted successfully! We\'ll get back to you soon.');
        reset();
      } else {
        toast.error(response.data.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      
      if (!error.response) {
        toast.error('Network error: Unable to connect to server. Please check if the server is running on port 5000.');
      } else if (error.response.status === 0) {
        toast.error('Network error: Please check your internet connection and server status.');
      } else {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errors?.[0]?.message ||
                           error.message || 
                           'Failed to submit inquiry. Please try again.';
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = [
    'Morning (9AM - 12PM)',
    'Afternoon (12PM - 4PM)',
    'Evening (4PM - 7PM)',
    'Night (7PM - 10PM)'
  ];

  return (
    <div className="border border-white">
      <h3 className="text-2xl font-bold mb-6 text-left text-black anton-regular">Book Your Free Trial</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-black mb-2">Full Name *</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-orange-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-black mb-2">Phone Number *</label>
            <input
              type="tel"
              {...register('phone', { 
                required: 'Phone is required',
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              className="w-full px-4 py-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="text-orange-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-black mb-2">Email Address *</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email'
                }
              })}
              className="w-full px-4 py-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-orange-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-black mb-2">Service Interest *</label>
            {servicesLoading ? (
              <div className="w-full px-4 py-3 bg-gray-200 border border-black rounded-lg text-gray-500 flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading services...
              </div>
            ) : (
              <select
                {...register('service', { required: 'Please select a service' })}
                className="w-full px-4 py-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                disabled={servicesLoading}
              >
                <option value="">Select a service</option>
                {serviceOptions.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            )}
            {errors.service && <p className="text-orange-500 text-sm mt-1">{errors.service.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-black mb-2">Preferred Time to Call *</label>
          <select
            {...register('preferredTime', { required: 'Please select a time slot' })}
            className="w-full px-4 py-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>
          {errors.preferredTime && <p className="text-orange-500 text-sm mt-1">{errors.preferredTime.message}</p>}
        </div>

        <div>
          <label className="block text-black mb-2">Message</label>
          <textarea
            rows={4}
            {...register('message', { 
              required: 'Message is required',
              maxLength: {
                value: 1000,
                message: 'Message cannot exceed 1000 characters'
              }
            })}
            className="w-full px-4 py-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            placeholder="Tell us about your fitness goals and any specific requirements..."
          ></textarea>
          {errors.message && <p className="text-orange-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading || servicesLoading}
          className={`w-full bg-red-500 fs-5 hover:bg-red-600 text-white py-4 rounded-lg font-semibold transition-colors duration-300 ${
            (isLoading || servicesLoading) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {(isLoading || servicesLoading) ? 'Processing...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;