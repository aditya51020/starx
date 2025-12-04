import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-8">Contact Us</h1>
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <p className="text-2xl mb-6">Get in touch</p>
          <p className="text-lg text-gray-700">Phone: +91 98765 43210</p>
          <p className="text-lg text-gray-700">Email: hello@starxrealty.in</p>
          <p className="text-lg text-gray-700 mt-6">We reply within 2 hours!</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;