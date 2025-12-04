import React from 'react';
import { useParams } from 'react-router-dom';

const RegionPage = () => {
  const { region } = useParams();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10">
          Properties in {region || 'This Region'}
        </h1>
        <p className="text-center text-xl text-gray-600">
          All verified listings from {region} will appear here.
        </p>
      </div>
    </div>
  );
};

export default RegionPage;