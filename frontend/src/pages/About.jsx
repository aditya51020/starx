import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">
          About StarX Realty
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Welcome to <span className="font-semibold text-blue-600">StarX Realty</span> – 
            one of the fastest-growing and most trusted real estate platforms in Ghaziabad.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our mission is simple: to provide genuine, verified, and up-to-date property listings 
            in prime locations such as Vasundhara, Indirapuram, Vaishali, Noida Extension, 
            Sector-63, and surrounding areas.
          </p>

          <div className="my-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                100% verified property listings
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                Direct owner deals – no brokerage fees
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                Real-time updates with high-quality photos
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                Location-based search (Vasundhara, Indirapuram, Sector-63, etc.)
              </li>
            </ul>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            Whether you are looking to buy your dream home, sell your property, rent it out, 
            or invest in the best opportunities – StarX Realty is with you every step of the way.
          </p>

          <div className="mt-10 text-center">
            <p className="text-xl font-semibold text-gray-800">
              Your Trust. Our Responsibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// This line is mandatory – this is what fixes the "does not provide an export named 'default'" error
export default About;