import React, { useState } from 'react';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1534438327276-14e53004980b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Modern Gym Equipment',
      category: 'equipment'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Group Fitness Class',
      category: 'classes'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1549060206-45b73e6feeb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Personal Training Session',
      category: 'training'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1571019614242-c5c6fc46e35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Cardio Area',
      category: 'equipment'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1530149884831-2b6de0b9b4e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Free Weights Section',
      category: 'equipment'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Functional Training Zone',
      category: 'training'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'classes', name: 'Classes' },
    { id: 'training', name: 'Training' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(image => image.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Take a tour of our facility and see our equipment and amenities.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 hover-combo ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer gallery-image-hover"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300"
              />
              <div className="p-4 bg-gray-800">
                <h3 className="text-lg font-semibold">{image.alt}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full">
              <button
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
                <h3 className="text-xl font-semibold">{selectedImage.alt}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Facility Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Facility Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-orange-500 text-4xl mb-4">🏋️</div>
              <h3 className="text-xl font-semibold mb-4">Strength Training</h3>
              <p className="text-gray-300">
                State-of-the-art strength training equipment including free weights, machines, and functional training tools.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-orange-500 text-4xl mb-4">🏃‍♂️</div>
              <h3 className="text-xl font-semibold mb-4">Cardio Zone</h3>
              <p className="text-gray-300">
                Extensive cardio equipment including treadmills, ellipticals, bikes, and rowing machines.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <div className="text-orange-500 text-4xl mb-4">🧘</div>
              <h3 className="text-xl font-semibold mb-4">Group Classes</h3>
              <p className="text-gray-300">
                Multiple studios for yoga, pilates, spin classes, and other group fitness activities.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Visit Our Facility</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience our premium facilities firsthand with a complimentary tour and fitness assessment.
          </p>
          <a
            href="/contact"
            className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold inline-block transition-colors duration-300 hover-combo"
          >
            Schedule Tour
          </a>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;