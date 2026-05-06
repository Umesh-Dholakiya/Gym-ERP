import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../services/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceAPI.getActive();
      setServices(response.data.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Set empty array if API fails
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'membership', name: 'Memberships' },
    { id: 'personal-training', name: 'Personal Training' },
    { id: 'group-class', name: 'Group Classes' },
    { id: 'special-offer', name: 'Special Offers' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <div
        className="relative py-64 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(26, 31, 58, 0.8), rgba(26, 31, 58, 0.8)), url(./images/hero-bg.jpg)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container text-center">
          <h1 className="md:text-7xl font-bold mb-4 anton-regular" style={{ fontSize: '130px' }}>
            <span className="text-red-600 me-1">OUR</span> <span className="text-white">SERVICES</span>
          </h1>
          <div className="text-white manrope fs-5 fw-600">
            <span className="text-white">HOME</span> <span className="mx-2">/</span> <span className="text-red-600">SERVICES</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <p className="text-xl text-gray-600 max-w-2xl mx-auto manrope">
            Choose from our premium fitness services designed to help you achieve your goals
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 hover-combo ${selectedCategory === category.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 card-hover-lift border border-gray-200"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 anton-regular">{service.name}</h3>
                    <span className="text-2xl font-bold text-red-600">${service.price}</span>
                  </div>
                  <p className="text-gray-600 mb-6 manrope">{service.description}</p>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 anton-regular text-gray-900">Features</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center manrope">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 anton-regular text-gray-900">Benefits</h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center manrope">
                          <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
      {/* CTA Section */}
      <div className="py-5" style={{ backgroundColor: '#ff003c' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="mb-0 anton-regular" style={{ fontSize: '74px', fontWeight: 'bold' }}>
                <span style={{ color: '#1a1a2e' }}>FOCUS ON YOUR FITNESS</span>
                <br />
                <span style={{ color: 'white' }}>NOT YOUR LOSS</span>
              </h2>
            </div>
            <div className="col-lg-4 text-end">
              <a
                href="/contact"
                className="btn btn-lg fw-600 hover-combo"
                style={{
                  backgroundColor: 'white',
                  color: '#1a1a2e',
                  padding: '15px 40px',
                  borderRadius: '4px',
                  textDecoration: 'none'
                }}
              >
                JOIN US TODAY →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;