import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { FaDumbbell, FaHeart, FaUser, FaStopwatch, FaMapMarkerAlt, FaPhone, FaClock, FaCalendarAlt, FaBriefcase, FaHeartbeat, FaTint } from 'react-icons/fa';
import { serviceAPI } from '../services/api';
import api from '../services/api';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Monthly');
  const [activeDay, setActiveDay] = useState('Monday');
  const statsRef = useRef(null);

  // Define stats data
  const stats = [
    { start: 0, end: 30, label: 'Members', suffix: 'K' },
    { start: 0, end: 40, label: 'Classes', suffix: '+' },
    { start: 0, end: 80, label: 'Trainers', suffix: '' },
    { start: 0, end: 30, label: 'Awards', suffix: '+' },
  ];

  // Initialize animated stats state
  const [animatedStats, setAnimatedStats] = useState(stats.map(stat => ({ ...stat, current: stat.start })));

  const [homeTrainers, setHomeTrainers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch services
        const servicesResponse = await serviceAPI.getAll();
        const servicesData = servicesResponse?.data?.data?.services || servicesResponse?.data?.services || [];
        const activeServices = Array.isArray(servicesData)
          ? servicesData.filter(service => service.isActive !== false)
          : [];
        setServices(activeServices);
        
        // Fetch trainers
        const trainersResponse = await api.get('/trainers/public');
        const trainersData = trainersResponse?.data?.data || [];
        setHomeTrainers(trainersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setServices([]);
        setHomeTrainers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000; // 2 seconds
          const frameDuration = 1000 / 60; // ~60fps
          const totalFrames = Math.round(duration / frameDuration);
          
          const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
          
          let frame = 0;
          const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuart(frame / totalFrames);
            
            const updatedStats = stats.map((stat) => {
              const current = stat.start + (stat.end - stat.start) * progress;
              return {
                ...stat,
                current: stat.end >= 1000 ? Math.floor(current / 1000) * 1000 : Math.floor(current) // Round large numbers
              };
            });
            
            setAnimatedStats(updatedStats);
            
            if (frame === totalFrames) {
              clearInterval(counter);
              // Set final values
              setAnimatedStats(stats.map(stat => ({ ...stat, current: stat.end })));
            }
          }, frameDuration);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (observer && statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const trainers = [
    { name: 'Alex Morgan', title: 'Certified Personal Trainer', image: '/images/trainer1.jpg' },
    { name: 'Fred Morgan', title: 'Certified Personal Trainer', image: '/images/trainer2.jpg' },
    { name: 'David Rossue', title: 'Certified Personal Trainer', image: '/images/trainer3.jpg' },
    { name: 'John Roy', title: 'Certified Personal Trainer', image: '/images/trainer4.jpg' },
    { name: 'Michelle Lewin', title: 'Certified Personal Trainer', image: '/images/trainer5.jpg' },
    { name: 'Ulisses Jr', title: 'Certified Personal Trainer', image: '/images/trainer6.jpg' },
  ];

  const serviceCards = [
    {
      title: 'Gym & Fitness Training',
      image: '/images/service1.jpg',
      icon: <FaUser />
    },
    {
      title: 'Personal Trainer',
      image: '/images/service2.jpg',
      icon: <FaUser />
    },
    {
      title: 'Health & Fitness Coach',
      image: '/images/service3.jpg',
      icon: <FaDumbbell />
    },
  ];

  const classes = [
    { name: 'Andrew Levine', time: '10:00 - 11:00', trainer: 'Marisa Smith' },
    { name: 'Pilates', time: '10:00 - 11:00', trainer: 'Marisa Smith' },
    { name: 'Zumba', time: '10:00 - 11:00', trainer: 'Marisa Smith' },
    { name: 'Boxing', time: '10:00 - 11:00', trainer: 'Marisa Smith' },
  ];

  const classesSchedule = [
    { name: 'Weight Lifting', time: '10:00am - 11:00pm', trainer: 'Mahiran Islam' },
    { name: 'Fitness', time: '10:00am - 11:00pm', trainer: 'Mahiran Islam' },
    { name: 'Running', time: '10:00am - 11:00pm', trainer: 'Mahiran Islam' },
    { name: 'Running', time: '10:00am - 11:00pm', trainer: 'Mahiran Islam' },
  ];

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

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="position-relative" style={{ background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/images/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '30vh' }}>
        <div className="container position-relative" style={{ zIndex: 10, paddingTop: '200px', paddingBottom: '200px' }}>
          <div className="row align-items-center">
            <div className="col-lg-12 text-white text-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-2 fw-bold mb-4 anton-regular">
                  <span className="text-white">Beast Mode</span> <span className="text-danger">On</span>
                </h1>
                <p className="lead mb-4 manrope">
                  Transform your body and mind with our world-class fitness facilities, expert trainers, and personalized programs designed to help you reach your goals.
                </p>
                <Link to="/contact" className="btn btn-danger btn-lg px-5 py-3 fw-bold manrope hover-combo">
                  JOIN US TODAY
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={statsRef} className="bg-danger text-white py-5 anton-regular">
        <div className="container">
          <div className="row text-center">
            {animatedStats.map((stat, index) => (
              <div key={index} className="col-6 col-md-3 mb-3 mb-md-0">
                <div className="display-4 fw-bold stat-number-hover">
                  {Math.floor(stat.current)}{stat.suffix}
                </div>
                <div className="fs-5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transform Your Body and Mind Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="position-relative">
                <img src="/images/transform.jpg" alt="Transform" className="img-fluid" />
                <div className="position-absolute" style={{ left: '-20px', bottom: '-20px', width: '100px', height: '100px', borderLeft: '5px solid #dc2626', borderBottom: '5px solid #dc2626' }}></div>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="display-4 fw-bold mb-4">
                <span className="text-danger anton-regular">TRANSFORM YOUR</span> <span className="text-black anton-regular">BODY AND MIND</span>
              </h2>
              <p className="lead mb-4 text-muted manrope">
                Experience world-class fitness facilities, expert trainers, and personalized programs designed to help you reach your goals. Join thousands of satisfied members who have achieved their fitness goals with us.
              </p>
              <div className="mb-4">
                <div className="d-flex align-items-start mb-3">
                  <FaDumbbell className="text-danger me-3" style={{ fontSize: '24px', marginTop: '5px' }} />
                  <div>
                    <h5 className="fw-bold manrope text-danger" style={{ fontSize: '18px' }}>WEIGHT LOSS</h5>
                    <p className="text-muted mb-0 manrope">Comprehensive weight loss programs tailored to your needs</p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <FaHeart className="text-danger me-3" style={{ fontSize: '24px', marginTop: '5px' }} />
                  <div>
                    <h5 className="fw-bold manrope text-danger" style={{ fontSize: '18px' }}>HEALTHY LIFE</h5>
                    <p className="text-muted mb-0 manrope">Achieve a healthier lifestyle with our expert guidance</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="btn btn-danger btn-lg px-5 py-3 fw-bold manrope hover-combo">
                ABOUT US
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Service You Get From Pulse Section */}
      <section className="py-5" style={{ backgroundColor: '#0d1430', paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center mb-5" style={{ marginBottom: '60px' }}>
            <h2 className="text-white mb-2 anton-regular" style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: '1.1' }}>
              <span className="text-danger" style={{ fontSize: '64px', fontWeight: 'bold' }}>WHAT SERVICE</span>
              <span className="text-white" style={{ fontSize: '64px' }}> YOU GET</span>
            </h2>
            <h3 className="text-white mt-2" style={{ fontSize: '64px', fontWeight: 'bold' }}>
              FROM PULSE
            </h3>
          </div>
          <div className="row g-4 mb-5">
            {serviceCards.map((service, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 h-100 service-card-hover" style={{ overflow: 'hidden', borderRadius: '0', backgroundColor: 'transparent' }}>
                  <div className="position-relative" style={{ height: '600px', overflow: 'hidden' }}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="card-img-top h-100 w-100"
                      style={{ objectFit: 'cover' }}
                    />
                    {/* White Caption Box at Bottom */}
                    <div
                      className="position-absolute w-100"
                      style={{
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        padding: '20px 25px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div className="text-dark" style={{ fontSize: '24px', lineHeight: '1', color: '#000' }}>
                        {service.icon}
                      </div>
                      <h4 className="card-title fw-bold mb-0 text-dark" style={{ fontSize: '18px', fontWeight: '600', color: '#000' }}>
                        {service.title}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link
              to="/services"
              className="btn btn-lg fw-bold d-inline-flex align-items-center gap-2 manrope hover-combo"
              style={{
                backgroundColor: '#ff003c',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '4px',
                border: 'none',
                fontSize: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textDecoration: 'none'
              }}
            >
              ALL PROGRAMS
              <ArrowRightIcon className="h-5 w-5" style={{ width: '20px', height: '20px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Expert Trainers Section - Updated to match 2nd image */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4 anton-regular" style={{ fontSize: '64px', fontWeight: 'bold', letterSpacing: '1px', color: '#1a1a2e' }}>
            OUR EXPERT TRAINERS
          </h2>
          <div className="row g-4">
            {homeTrainers.map((trainer, index) => (
              <div key={trainer._id || index} className="col-md-4 col-lg-4 mb-4">
                <div className="card border-0 trainer-card-hover" style={{ backgroundColor: 'transparent' }}>
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
                      <h5 className="card-title fw-bold mb-1 anton-regular" style={{ color: '#1a1a2e', fontSize: '24px' }}>{trainer.firstName} {trainer.lastName}</h5>
                      <p className="card-text mb-3 manrope" style={{ color: '#666', fontSize: '18px' }}>{trainer.specialization?.join(', ') || 'Certified Personal Trainer'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section - Updated to match 8th image */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4 anton-regular" style={{ fontSize: '64px', fontWeight: 'bold' }}>
            <span style={{ color: '#1a1a2e' }}>WHAT GET FROM FITNER</span>
            <br />
            <span style={{ color: '#ff003c', fontSize: '64px' }}>MEMBERSHIP</span>
          </h2>
          <div className="mb-4 d-flex gap-2 flex-wrap">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className="day-btn-hover"
                style={{
                  padding: '20px 53px',
                  border: activeDay === day ? 'none' : '2px dotted #1a1a2e',
                  backgroundColor: activeDay === day ? '#ff003c' : 'white',
                  color: activeDay === day ? 'white' : '#1a1a2e',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="table-responsive" style={{ backgroundColor: '#F4F4F9' }}>
            <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
              <tbody>
                {classesSchedule.map((cls, index) => (
                  <tr key={index} >
                    <td style={{ padding: '30px 20px', border: '1px solid #EDEADE', backgroundColor: 'transparent' }}>
                      <div className='manrope' style={{ color: '#011e3c', fontSize: '16px', marginBottom: '5px' }}>Class Name</div>
                      <div className='anton-regular' style={{ color: '#000', fontWeight: '600', fontSize: '20px' }}>{cls.name}</div>
                    </td>
                    <td style={{ padding: '30px 20px', border: '1px solid #EDEADE', backgroundColor: 'transparent' }}>
                      <div className='manrope text-center' style={{ color: '#1a1a2e', fontSize: '16px', marginBottom: '5px' }}>Time</div>
                      <div className='anton-regular text-center' style={{ color: '#000', fontWeight: '600', fontSize: '20px' }}>{cls.time}</div>
                    </td>
                    <td style={{ padding: '30px 20px', border: '1px solid #EDEADE', backgroundColor: 'transparent' }}>
                      <div className='manrope text-center' style={{ color: '#1a1a2e', fontSize: '16px', marginBottom: '5px' }}>Trainer</div>
                      <div className='anton-regular text-center' style={{ color: '#000', fontWeight: '600', fontSize: '20px' }}>{cls.trainer}</div>
                    </td>
                    <td style={{ padding: '30px 20px', border: '1px solid #EDEADE', textAlign: 'center', backgroundColor: 'transparent' }}>
                      <Link
                        to="/contact"
                        className="btn hover-combo"
                        style={{
                          backgroundColor: 'white',
                          color: '#1a1a2e',
                          border: '2px solid #1a1a2e',
                          padding: '20px 28px',
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          borderRadius: '4px'
                        }}
                      >
                        GET STARTED →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Choose Section - Updated to match 9th image */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="position-relative">
                <img src="/images/why-choose.png" alt="Why Choose" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="mb-4" style={{ fontSize: '64px', fontWeight: 'bold' }}>
                <span className='anton-regular' style={{ color: '#1a1a2e' }}>WHY CHOOSE TO JOINING</span>
                <br />
                <span className='anton-regular' style={{ color: '#ff003c' }}>OUR GYM</span>
              </h2>
              <p className="mb-4 manrope" style={{ color: '#000', fontSize: '16px', lineHeight: '1.8' }}>
                Joining Our Gym Isn't Just About Exercise—It's About Transformation. With Modern Equipment, Experienced Trainers, And A Supportive Environment, We Help You Push Past Limits And Discover Your True Potential. Here, You'll Gain More Than Physical Strength; You'll Build Confidence, Improve Your Lifestyle
              </p>
              <div className="row mb-4">
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <FaDumbbell className="text-danger me-3" style={{ fontSize: '50px' }} />
                    <span style={{ color: '#1a1a2e', fontWeight: 'bold' }}>FREE FITNESS TRAINING</span>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <FaHeartbeat className="text-danger me-3" style={{ fontSize: '50px' }} />
                    <span style={{ color: '#1a1a2e', fontWeight: 'bold' }}>MODERN GYM EQUIPMENT</span>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <FaBriefcase className="text-danger me-3" style={{ fontSize: '50px' }} />
                    <span style={{ color: '#1a1a2e', fontWeight: 'bold' }}>GYM BAG EQUIPMENTS</span>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <FaTint className="text-danger me-3" style={{ fontSize: '50px' }} />
                    <span style={{ color: '#1a1a2e', fontWeight: 'bold' }}>FRESH BOTTLE WATER</span>
                  </div>
                </div>
              </div>
              <Link
                to="/about"
                className="btn btn-lg fw-bold hover-combo"
                style={{
                  backgroundColor: '#ff003c',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: '4px',
                  textDecoration: 'none'
                }}
              >
                VIEW MORE →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section - Updated to match 11th image */}
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

      {/* CTA Banner - Updated to match 12th image */}
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

export default HomePage;