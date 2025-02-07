import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import experienceHeroImage from '../assets/images/experiences-image.png';

import cookingImage from '../assets/images/experiences/cooking.png';
import sunriseImage from '../assets/images/experiences/sunrise.png';
import trekImage from '../assets/images/experiences/trek.png';

// Mock data for categories
const categories = [
  {
    id: 1,
    name: 'Adventure',
    icon: '🏔️',
    description: 'Trekking, climbing, and outdoor activities'
  },
  {
    id: 2,
    name: 'Culinary',
    icon: '🍳',
    description: 'Food tours and cooking classes'
  },
  {
    id: 3,
    name: 'Cultural',
    icon: '🏛️',
    description: 'Temple visits and traditional ceremonies'
  },
  {
    id: 4,
    name: 'Photography',
    icon: '📸',
    description: 'Photo tours and workshops'
  }
];

// Mock data for featured experiences
const featuredExperiences = [
  {
    id: 1,
    title: 'Traditional Cooking Class in Kathmandu',
    category: 'Culinary',
    price: 45,
    rating: 4.8,
    reviews: 128,
    image: cookingImage,
    description: 'Learn authentic Nepali recipes from local experts'
  },
  {
    id: 2,
    title: 'Sunrise Yoga in Pokhara',
    category: 'Wellness',
    price: 30,
    rating: 4.9,
    reviews: 85,
    image: sunriseImage,
    description: 'Mountain view yoga session with expert instructor'
  },
  {
    id: 3,
    title: 'Village Trek Experience',
    category: 'Adventure',
    price: 75,
    rating: 4.7,
    reviews: 164,
    image:  trekImage,
    description: 'Guided trek through traditional mountain villages'
  }
];

function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <img
          src={experienceHeroImage}
          alt="Nepal Experiences"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <h1 className="text-5xl font-bold text-white">
              Discover Unique Experiences
            </h1>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="text-4xl mb-4">{category.icon}</span>
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 text-center">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-12">Featured Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredExperiences.map((experience) => (
              <div 
                key={experience.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-blue-600 mb-2">
                    <span>{experience.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{experience.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 w-5 h-5 fill-current" />
                      <span className="ml-1 text-sm font-medium">{experience.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({experience.reviews})</span>
                    </div>
                    <div className="text-lg font-semibold">
                      ${experience.price}
                      <span className="text-sm text-gray-500 ml-1">per person</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ExperiencesPage;