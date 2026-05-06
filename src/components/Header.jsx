import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white text-black py-3 d-none d-md-block">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-4">
                <div className="d-flex align-items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="small text-black">+91 9876 5432 90</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span className="small text-black">info@pulse.com</span>
                </div>
              </div>
            </div>
            <div className="col-md-6 text-end">
              <div className="d-flex align-items-center justify-content-end gap-3">
                <a href="#" className="text-black social-icon-hover me-2"><FaTwitter /></a>
                <a href="#" className="text-black social-icon-hover me-2"><FaFacebook /></a>
                <a href="#" className="text-black social-icon-hover me-2"><FaInstagram /></a>
                <a href="#" className="text-black social-icon-hover me-2"><FaYoutube /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-[#1a1f3a] text-white sticky top-0 z-50 shadow-lg">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark py-3">
            {/* Logo */}
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <div className=" d-flex align-items-center justify-content-center me-2" style={{width: '250px', height: '40px', fontSize: '24px', fontWeight: 'bold'}}>
              <img src="/images/white-logo.svg" alt="" />

              </div>
            </Link>
          
            {/* Mobile menu button */}
            <button
              className="navbar-toggler border-0 d-md-none"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
              style={{color: 'white'}}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-white" />
              )}
            </button>

            {/* Navigation Links */}
            <div className={`navbar-collapse ${mobileMenuOpen ? 'show d-block' : 'd-none d-md-block'}`}>
              <ul className="navbar-nav mx-auto">
                {navLinks.map((link) => (
                  <li key={link.name} className="nav-item text-white">
                    <Link
                      to={link.path}
                      className="text-decoration-none fw-700 text-white px-3 nav-link-hover"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="btn px-4 py-3 fw-bold hover-combo"
                onClick={() => setMobileMenuOpen(false)}
                style={{backgroundColor: '#DC3545', color: 'white', border: 'none'}}
              >
                GET STARTED NOW
              </Link>
            </div>  
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;