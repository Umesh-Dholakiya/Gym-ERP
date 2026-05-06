import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1f3a] text-white py-5">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Company Info */}
          <div className="col-md-4">
            <div className="d-flex align-items-center mb-3">
              <div className="d-flex align-items-center justify-content-center me-2 mb-3" style={{ width: '250px', height: '50px', fontSize: '24px', fontWeight: 'bold' }}>
                <img src="/images/white-logo.svg" alt="" />
              </div>
            </div>
            <p className="text-white-50 mb-4 manrope">
              Your premier destination for fitness and wellness. Join us to transform your body and mind with world-class facilities and expert trainers.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white social-icon-hover me-2"><FaTwitter style={{ fontSize: '20px' }} /></a>
              <a href="#" className="text-white social-icon-hover me-2"><FaFacebook style={{ fontSize: '20px' }} /></a>
              <a href="#" className="text-white social-icon-hover me-2"><FaInstagram style={{ fontSize: '20px' }} /></a>
              <a href="#" className="text-white social-icon-hover me-2"><FaYoutube style={{ fontSize: '20px' }} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h5 className="fw-bold mb-3 anton-regular">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none manrope fw-600 hover-combo">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="text-white-50 text-decoration-none manrope hover-combo">About Us</Link></li>
              <li className="mb-2"><Link to="/services" className="text-white-50 text-decoration-none manrope hover-combo">Services</Link></li>
              <li className="mb-2"><Link to="/blog" className="text-white-50 text-decoration-none manrope hover-combo">Blog</Link></li>
              <li className="mb-2"><Link to="/trainers" className="text-white-50 text-decoration-none manrope hover-combo">Trainers</Link></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h5 className="fw-bold mb-3 anton-regular">Training</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/services" className="text-white-50 text-decoration-none manrope hover-combo">Personal Training</Link></li>
              <li className="mb-2"><Link to="/services" className="text-white-50 text-decoration-none manrope hover-combo">Group Classes</Link></li>
              <li className="mb-2"><Link to="/services" className="text-white-50 text-decoration-none manrope hover-combo">HIIT Workouts</Link></li>
              <li className="mb-2"><Link to="/services" className="text-white-50 text-decoration-none manrope hover-combo">CrossFit</Link></li>
              <li className="mb-2"><Link to="/services" className="text-white-50 text-decoration-none manrope hover-combo">Functional Fitness</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h5 className="fw-bold mb-3 anton-regular">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <FaMapMarkerAlt className="text-white me-2 mt-1" />
                <span className="text-white-50 manrope">Gym Address  <br /> 10/1 Some Place, Some City, 12345</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="text-white me-2" />
                <span className="text-white-50 manrope">Phone Number  <br /> +00 1234 5678</span>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <FaClock className="text-white me-2 mt-1" />
                <span className="text-white-50 manrope">Opening Hours  <br /> Mon - Sat : 08:00 - 08:00, <br /> Sun : Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-top border-secondary pt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-white-50 mb-0">
                COPYRIGHT {currentYear} PULSE. ALL RIGHT RESERVED.
              </p>
            </div>
            <div className="col-md-6 text-end">
              <button className="btn btn-danger rounded-circle hover-combo" style={{ width: '40px', height: '40px' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;