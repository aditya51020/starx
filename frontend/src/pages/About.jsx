import React from 'react';
import Meta from '../components/Meta';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Meta
        title="About StarX Properties (StarX Buildtech) - Trusted Real Estate Consultants"
        description="StarX Properties (operating under StarX Buildtech) is a trusted real estate firm in Ghaziabad. We are widely searched as Starx, Star X, and Starx Properties."
        keywords="StarX Buildtech, StarX Properties, Star X Real Estate, Property Consultants Ghaziabad, Buy Property Indirapuram"
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">
          About StarX Properties (StarX Buildtech)
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <span className="font-bold text-[#D4AF37]">StarX Properties</span>, operating under <span className="font-bold text-gray-900">StarX Buildtech</span>, is a trusted real estate and property consultancy firm based in Ghaziabad, Uttar Pradesh. We are widely searched and recognized as <strong>Starx</strong>, <strong>Star X</strong>, and <strong>Starx Properties</strong> by our clients.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            With a strong local presence in Indirapuram, Vaishali, Vasundhara and nearby areas, StarX Properties specializes in residential and commercial property buying, selling, leasing, and investment consulting. Our focus is on transparent deals, genuine properties, and long-term client relationships.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Over the years, <strong>StarX Buildtech / StarX Properties</strong> has helped hundreds of clients find the right homes, plots, and commercial spaces with complete legal clarity and professional guidance. Our experienced team ensures smooth documentation, site visits, and end-to-end support throughout the property transaction.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed font-semibold bg-[#FFFDF0] p-4 rounded-lg border border-[#D4AF37]/20">
            If you are searching for Starx Properties Ghaziabad, Star X real estate, or Starx Buildtech, you are at the right place.
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