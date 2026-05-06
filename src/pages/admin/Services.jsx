import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { serviceAPI } from '../../services/api';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    features: [''],
    category: 'membership',
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceAPI.getAll();
      const servicesData = response.data.data.services;

      // Transform the data to match our UI structure
      const transformedServices = servicesData.map(service => ({
        id: service._id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        features: service.features,
        category: service.category,
        isActive: service.isActive
      }));

      setServices(transformedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Set empty array if API fails
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeatureField = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingService) {
      // Update existing service
      try {
        const response = await serviceAPI.update(editingService.id, {
          ...formData,
          price: parseFloat(formData.price)
        });

        // Update the service in the local state
        setServices(prev => prev.map(service =>
          service.id === editingService.id
            ? { ...response.data.data.service, id: editingService.id }
            : service
        ));

        alert('Service updated successfully!');
      } catch (error) {
        console.error('Error updating service:', error);
        alert('Failed to update service. Please try again.');
      }
    } else {
      // Add new service
      try {
        const response = await serviceAPI.create({
          ...formData,
          price: parseFloat(formData.price)
        });

        // Add the new service to the local state
        setServices(prev => [...prev, {
          ...response.data.data.service,
          id: response.data.data.service._id
        }]);

        alert('Service created successfully!');
      } catch (error) {
        console.error('Error creating service:', error);
        alert('Failed to create service. Please try again.');
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      features: [''],
      category: 'membership',
      isActive: true
    });
    setEditingService(null);
    setShowModal(false);
  };

  const editService = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration,
      features: [...service.features],
      category: service.category,
      isActive: service.isActive
    });
    setEditingService(service);
    setShowModal(true);
  };

  const deleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceAPI.delete(id);
        setServices(prev => prev.filter(service => service.id !== id));
        alert('Service deleted successfully!');
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  const toggleServiceStatus = async (id) => {
    const service = services.find(s => s.id === id);
    const newStatus = !service.isActive;

    try {
      const response = await serviceAPI.update(id, {
        ...service,
        isActive: newStatus
      });

      setServices(prev => prev.map(s =>
        s.id === id ? { ...response.data.data.service, id: s.id } : s
      ));

      alert(`Service ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status. Please try again.');
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex h-screen bg-gray-100">
  //       {/* <Sidebar /> */}
  //       <div className="flex-1 flex flex-col overflow-hidden">
  //         {/* <Header /> */}
  //         <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  //         </main>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 ">
          <div className='flex justify-between items-center border-b-2 border-gray-200 mb-6'>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Service Management</h1>
              <p className="text-gray-600">Manage gym services and membership plans</p>
            </div>

            {/* Add Service Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover-combo"
              >
                + Add New Service
              </button>
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {service.features.map((feature, idx) => (
                            <span key={idx} className="inline-block bg-gray-100 text-gray-700 rounded px-2 py-1 mr-2 mb-1 text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${service.price} <span className="text-gray-500">/{service.duration}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {service.category.replace('-', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editService(service)}
                            className="px-3 me-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-xs hover-combo"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleServiceStatus(service.id)}
                            className={`px-3 py-2 me-2 rounded transition-colors duration-200 text-xs hover-combo ${service.isActive
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                          >
                            {service.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteService(service.id)}
                            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 text-xs hover-combo"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add/Edit Service Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white-800 mb-4">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="membership">Membership</option>
                          <option value="personal-training">Personal Training</option>
                          <option value="group-class">Group Class</option>
                          <option value="special-offer">Special Offer</option>
                          <option value="facility-access">Facility Access</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex mb-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder={`Feature ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeFeatureField(index)}
                            className="bg-red-500 text-white px-3 rounded-r-lg hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeatureField}
                        className="text-orange-500 text-sm font-medium hover-combo"
                      >
                        + Add Feature
                      </button>
                    </div>

                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active Service</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover-combo hover-combo"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover-combo hover-combo"
                      >
                        {editingService ? 'Update Service' : 'Add Service'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminServices;