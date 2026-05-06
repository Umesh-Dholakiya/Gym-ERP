import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainerAPI } from '../services/api';
import api from '../services/api';

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        // Use public endpoint for website
        const response = await api.get('/trainers/public');
        setTrainers(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trainers:', err);
        setError(err.message || 'Failed to fetch trainers');
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-dark">Loading trainers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-danger">Error loading trainers</h3>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

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
            <span className="text-red-600">OUR</span> <span className="text-white">TRAINERS</span>
          </h1>
          <div className="text-white manrope fs-5 fw-600">
            <span className="text-white">HOME</span> <span className="mx-2">/</span> <span className="text-red-600">TRAINERS</span>
          </div>
        </div>
      </div>

      {/* OUR EXPERT TRAINERS Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4 anton-regular" style={{ fontSize: '64px', fontWeight: 'bold', letterSpacing: '1px', color: '#1a1a2e' }}>
            OUR EXPERT TRAINERS
          </h2>
          
          {trainers.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted">No trainers available at the moment</h4>
              <p className="text-muted">Please check back later</p>
            </div>
          ) : (
            <div className="row g-4">
              {trainers.map((trainer) => (
                <div key={trainer._id} className="col-md-4 col-lg-4 mb-4">
                  <div className="card border-0" style={{ backgroundColor: 'transparent' }}>
                    <div className="position-relative" style={{ height: '520px', overflow: 'hidden', border: '2px solid #1a1a2e' }}>
                      <img 
                        src={trainer.photo ? `${window.location.origin}${trainer.photo}` : '/images/trainer1.jpg'} 
                        alt={`${trainer.firstName} ${trainer.lastName}`} 
                        className="h-100 w-100" 
                        style={{ objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.src = '/images/trainer1.jpg';
                        }}
                      />
                      {/* White Overlay Box */}
                      <div
                        className="position-absolute w-100"
                        style={{
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'white',
                          padding: '20px',
                          transform: 'translateY(20px)'
                        }}
                      >
                        <h5 className="card-title fw-bold mb-1 anton-regular" style={{ color: '#1a1a2e', fontSize: '24px' }}>
                          {trainer.firstName} {trainer.lastName}
                        </h5>
                        <p className="card-text mb-2 manrope" style={{ color: '#666', fontSize: '16px' }}>
                          {trainer.specialization?.map(spec => spec.replace('-', ' ')).join(', ') || 'Certified Personal Trainer'}
                        </p>
                        <p className="card-text mb-3 manrope" style={{ color: '#666', fontSize: '14px' }}>
                          Experience: {trainer.experience?.years || 0} years
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                className="btn btn-lg fw-600"
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

export default TrainersPage;