import React, { useState, useEffect } from 'react';
import InquiryForm from '../components/InquiryForm';
import { serviceAPI } from '../services/api';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Monthly Membership' },
    { id: 2, name: 'Personal Training' },
    { id: 3, name: 'Group Classes' },
    { id: 4, name: 'Free Trial Session' },
    { id: 5, name: 'Nutrition Consultation' }
  ]);

  useEffect(() => {
    const preloadServices = async () => {
      try {
        const response = await serviceAPI.getActive();
        if (response.data?.data?.services?.length > 0) {
          setServices(
            response.data.data.services.map(s => ({
              id: s._id || s.id,
              name: s.name
            }))
          );
        }
      } catch (e) {
        console.warn('Using default services');
      }
    };
    setTimeout(preloadServices, 100);
  }, []);

  return (
    <div className="bg-white text-gray-900">

      {/* ================= HERO ================= */}
     <div
        className="relative py-64 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(26, 31, 58, 0.8), rgba(26, 31, 58, 0.8)), url(./images/hero-bg.jpg)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container text-center">
          <h1 className="md:text-7xl font-bold mb-4 anton-regular" style={{ fontSize: '130px' }}>
            <span className="text-red-600 me-1">CONTACT</span> <span className="text-white">US</span>
          </h1>
          <div className="text-white manrope fs-5 fw-600">
            <span className="text-white">HOME</span> <span className="mx-2">/</span> <span className="text-red-600">CONTACT US</span>
          </div>
        </div>
      </div>

      {/* ================= INFO CARDS ================= */}
      <section className="max-w-6xl mx-auto py-16 z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 anton-regular">
            <span className="text-black">GET IN</span> <span className="text-red-600">TOUCH</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Have questions about our services? Reach out to us and our team will get back to you promptly.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <InfoCard 
            title="Email Address" 
            value="info@gymplus.com"
            icon="📧"
          />
          <InfoCard 
            title="Phone Number" 
            value="+1 (555) 123-4567"
            icon="📞"
          />
          <InfoCard
            title="Our Location"
            value="123 Fitness Avenue, Health City, HC 12345"
            icon="📍"
          />
        </div>
      </section>

      {/* ================= FORM + IMAGE ================= */}
      <section className="max-w-6xl mx-auto px-6 pt-3 pb-16">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT – FORM */}
          <div>
            <h2 className="font-extrabold mb-8 uppercase anton-regular" style={{ fontSize: '64px' }}>
              Feel Free To Ask Us <br />
              <span className="text-red-600">Anything</span>
            </h2>

            {/* 🔥 YOUR WORKING FORM */}
            <InquiryForm serviceOptions={services} />
          </div>

          {/* RIGHT – IMAGE */}
          <div className="hidden lg:block">
            <img
              src="/images/contact-man.jpg"
              alt="Gym"
              className="rounded-xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-5" style={{ backgroundColor: '#ff003c' }}>
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
              <Link
                to="/contact"
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
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const InfoCard = ({ title, value, icon, description }) => (
  <div className="bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 card-hover-lift">
    <div className="text-4xl mb-4">{icon}</div>
    <h4 className="font-bold text-xl mb-3 text-gray-900 anton-regular">{title}</h4>
    <p className="text-gray-800 font-medium mb-2 manrope">{value}</p>
  </div>
);

export default ContactPage;
