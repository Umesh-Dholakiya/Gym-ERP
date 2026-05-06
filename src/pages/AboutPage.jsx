import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaHeart, FaCheckCircle, FaPlusCircle, FaSmile, FaCalendarAlt, FaUser } from 'react-icons/fa';

const AboutPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const membershipBenefits = [
    {
      image: "./images/11.svg",
      title: "Motivation",
      description:
        "Unlock your full potential and embrace the power of fitness motivation with us. At Flexify, we understand that the journey to a healthier."
    },
    {
      image: "./images/12.svg",
      title: "Friendly Staff",
      description:
        "Our welcoming staff is always ready to help you achieve your fitness goals with a smile."
    },
    {
      image: "./images/13.svg",
      title: "Support",
      description:
        "Get 24/7 support from our team to ensure you have everything you need for success."
    },
    {
      image: "./images/14.svg",
      title: "Certified Trainers",
      description:
        "Work with certified professionals who are dedicated to your fitness journey."
    }
  ];

  const trainers = [
    { name: 'Alex Morgan', title: 'Certified Personal Trainer', image: '/images/trainer1.jpg' },
    { name: 'Fred Morgan', title: 'Certified Personal Trainer', image: '/images/trainer2.jpg' },
    { name: 'David Rossue', title: 'Certified Personal Trainer', image: '/images/trainer3.jpg' },
    { name: 'John Roy', title: 'Certified Personal Trainer', image: '/images/trainer4.jpg' },
    { name: 'Michelle Lewin', title: 'Certified Personal Trainer', image: '/images/trainer5.jpg' },
    { name: 'Ulisses Jr', title: 'Certified Personal Trainer', image: '/images/trainer6.jpg' },
  ];

  const faqs = [
    {
      question: 'What classes does Vamosia offer?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    },
    {
      question: 'How do I become a member?',
      answer: 'You can become a member by visiting our gym or contacting us through our website. We offer various membership plans to suit your needs.'
    },
    {
      question: 'What are the gym hours?',
      answer: 'Our gym is open Monday to Saturday from 8:00 AM to 8:00 PM. We are closed on Sundays.'
    },
    {
      question: 'Do you offer personal training?',
      answer: 'Yes, we have certified personal trainers available for one-on-one sessions. Contact us to schedule a consultation.'
    }
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
            <span className="text-red-600">ABOUT</span> <span className="text-white">US</span>
          </h1>
          <div className="text-white manrope fs-5 fw-600">
            <span className="text-white">HOME</span> <span className="mx-2">/</span> <span className="text-red-600">ABOUT</span>
          </div>
        </div>
      </div>

      {/* FROM PASSION TO POWER Section */}
      <div className="py-16 bg-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 position-relative pb-2">
              <div className="position-absolute start-0 top-0 bg-red-600" style={{ width: '5px', height: '100%' }}></div>
              <div className="position-absolute bottom-0 start-0 bg-red-600" style={{ width: '100%', height: '5px' }}></div>
              <img
                src="/images/transform.jpg"
                alt="Gym Trainer"
                className="w-100 h-auto"
                style={{ paddingLeft: '5px', paddingBottom: '5px' }}
              />
            </div>
            <div className="col-md-6 ps-5">
              <h2 className="font-bold mb-4 anton-regular" style={{ fontSize: '64px' }}>
                <span className="text-red-600 me-2">FROM PASSION</span>
                <span className="text-[#1a1f3a]">TO <br /> POWER THE PULSE JOURNEY</span>
              </h2>
              <p className="text-gray-600 mb-4 manrope">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Pulse Gym offers world-class strength training, balance exercises, and modern equipment to help you achieve your fitness goals.
              </p>
              <p className="text-[#1a1f3a] fw-bold text-uppercase mb-4 manrope" style={{ fontSize: '18px' }}>
                FEEL THE BEAT OF YOUR GOALS AT PULSE GYM <br /> POWER UP YOUR BODY SHARPEN YOUR MIND, AND <br /> TRAIN HARDER THAN EVER.
              </p>
              <button className="btn btn-danger text-white fw-500 text-uppercase px-5 py-3 fs-5 rounded hover-combo">
                ABOUT US →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT GET FROM FITNER MEMBERSHIP Section */}
      <div className="py-16 bg-[#1a1f3a]">
        <div className="container">
          <h2
            className="text-left font-bold mb-12 anton-regular"
            style={{ fontSize: "64px" }}
          >
            <span className="text-white">WHAT GET FROM FITNER</span>
            <br />
            <span className="text-red-600">MEMBERSHIP</span>
          </h2>

          <div className="row g-4">
            {membershipBenefits.map((benefit, index) => (
              <div key={index} className="col-md-6">
                <div className="bg-white p-4 rounded shadow h-100">

                  {/* IMAGE */}
                  <div className="mb-3">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-14 h-14"
                    />
                  </div>

                  <h3 className="text-[#1a1f3a] fw-bold mb-3 anton-regular">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 w-99 manrope" style={{ fontSize: '18px' }}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* OUR EXPERT TRAINERS Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4 anton-regular" style={{ fontSize: '64px', fontWeight: 'bold', letterSpacing: '1px', color: '#1a1a2e' }}>
            OUR EXPERT TRAINERS
          </h2>
          <div className="row g-4">
            {trainers.map((trainer, index) => (
              <div key={index} className="col-md-4 col-lg-4 mb-4">
                <div className="card border-0 trainer-card-hover" style={{ backgroundColor: 'transparent' }}>
                  <div className="position-relative" style={{ height: '520px', overflow: 'hidden', border: '2px solid #1a1a2e' }}>
                    <img src={trainer.image} alt={trainer.name} className="h-100 w-100" style={{ objectFit: 'cover' }} />
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
                      <h5 className="card-title fw-bold mb-1 anton-regular" style={{ color: '#1a1a2e', fontSize: '24px' }}>{trainer.name}</h5>
                      <p className="card-text mb-3 manrope" style={{ color: '#666', fontSize: '18px' }}>{trainer.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container">
          <h2 className="text-left font-bold text-black mb-5 anton-regular" style={{ fontSize: '60px' }}>FREQUENTLY ASKED QUESTIONS</h2>
          <div className="row justify-content-center">
            <div className="col-md-12">
              {faqs.map((faq, index) => {
                const isActive = openFaq === index;

                return (
                  <div key={index} className="mb-3">
                    <button
                      className={`w-100 fw-bold text-uppercase p-4 d-flex justify-content-between align-items-center border-0 hover-combo ${isActive
                        ? "bg-red-600 text-white"
                        : "bg-[#f3f3f3] text-[#0b1d39]"
                        }`}
                      onClick={() => setOpenFaq(isActive ? -1 : index)}
                    >
                      <span className="anton-regular fs-3">
                        {faq.question}
                      </span>

                      {isActive ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>

                    {/* ANSWER */}
                    {isActive && (
                      <div className="bg-red-600 text-white manrope p-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
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
                <div className="card border-0 h-100" style={{ boxShadow: 'none' }}>
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