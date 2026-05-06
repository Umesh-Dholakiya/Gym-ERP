import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaHeart, FaCheckCircle, FaPlusCircle, FaSmile, FaCalendarAlt, FaUser } from 'react-icons/fa';

const AboutPage = () => {

  const blogPosts = [
    {
      title: '10 Killer Full Body Workouts You Can Do Anywhere',
      date: '12 September 2025',
      author: 'Robert Clark',
      image: '/images/blog1.jpg'
    },
    {
      title: '5 Mindset Shifts Permanent Fitness And Weight Loss',
      date: '12 September 2025',
      author: 'Robert Clark',
      image: '/images/blog2.jpg'
    },
    {
      title: 'The Ultimate Pre- And Post-Gym Nutrition Cheat Sheet',
      date: '12 September 2025',
      author: 'Robert Clark',
      image: '/images/blog3.jpg'
    },
  ];


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
          <h1 className="text-7xl md:text-7xl font-bold mb-4 anton-regular" style={{ fontSize: '130px' }}>
            <span className="text-red-600 me-3">NEWS</span><span className="text-white">STANDARD</span>
          </h1>
          <div className="text-white manrope fs-5 fw-600">
            <span className="text-white">HOME</span> <span className="mx-2">/</span> <span className="text-red-600">NEWS STANDARD</span>
          </div>
        </div>
      </div>

      {/* OUR LATEST UPDATES Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-5 anton-regular" style={{ fontSize: '64px', fontWeight: 'bold', textAlign: 'left' }}>
            <span style={{ color: '#1a1a2e' }}>OUR LATEST UPDATES</span>
            <br />
            <span style={{ color: '#ff003c' }}>FOR YOUR FITNESS</span>
          </h2>
          <div className="row g-4">
            {blogPosts.map((post, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 h-100 blog-card-hover" style={{ boxShadow: 'none' }}>
                  <div className="position-relative" style={{ height: '270px', overflow: 'hidden' }}>
                    <img src={post.image} alt={post.title} className="card-img-top h-100 w-100" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className="card-body p-0 mt-3">
                    <div className="manrope d-flex align-items-center justify-content-between mb-4" style={{ fontSize: '16px', color: '#000' }}>
                      <div className='d-flex align-items-center justify-content-between'>
                        <FaCalendarAlt className="text-danger me-2" style={{ fontSize: '16px' }} />
                        <span style={{ fontSize: '18px' }}>{post.date}</span>
                      </div>
                      <div className='d-flex align-items-center justify-content-between'>
                        <FaUser className="text-danger me-2" style={{ fontSize: '16px' }} />
                        <span style={{ fontSize: '18px' }}>{post.author}</span>
                      </div>
                    </div>
                    <h5 className="card-title fw-bold mb-4 anton-regular" style={{ color: '#1a1a2e', fontSize: '24px', lineHeight: '1.4' }}>{post.title}</h5>
                    <Link
                      to="/blog"
                      className="text-danger text-decoration-underline fw-bold hover-combo"
                      style={{ textDecoration: 'underline' }}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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

export default AboutPage;