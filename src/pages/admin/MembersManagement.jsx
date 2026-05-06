import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMembers,
  createMember,
  updateMember,
  deleteMember,
  fetchMemberStats,
  clearError
} from '../../store/slices/memberSlice';
import { planAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import TableCard from '../../components/admin/TableCard';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';

const MembersManagement = () => {
  const dispatch = useDispatch();
  const { members, stats, loading, error, pagination } = useSelector(state => state.members);
  const { user } = useSelector(state => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    fitnessGoals: [],
    medicalHistory: {
      conditions: [],
      medications: [],
      allergies: [],
      injuries: []
    },
    membership: {
      plan: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      paymentStatus: 'pending'
    }
  });
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);

  // Fetch data
  useEffect(() => {
    dispatch(fetchMembers({ page: currentPage, limit: 10 }));
    dispatch(fetchMemberStats());
    loadMembershipPlans();
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (error) {
      // Don't show toast here anymore, we'll show error in the UI
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadMembershipPlans = async () => {
    setPlansLoading(true);
    setPlansError(null);
    try {
      const response = await planAPI.getAll();
      // Handle the response data properly - check if it has the expected structure
      const plansData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setMembershipPlans(plansData);
      setPlansLoading(false);
    } catch (error) {
      console.error('Error loading membership plans:', error);
      setPlansError(error.message || 'Failed to load membership plans');
      setPlansLoading(false);
      // Don't show toast here anymore, we'll show error in the UI
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name.replace('address.', '')]: value
      }
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name.replace('emergencyContact.', '')]: value
      }
    }));
  };

  const handleMedicalHistoryChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [name]: value.split(',').map(item => item.trim()).filter(Boolean)
      }
    }));
  };

  const handleFitnessGoalChange = (goal) => {
    setFormData(prev => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter(g => g !== goal)
        : [...prev.fitnessGoals, goal]
    }));
  };

  const handleMembershipChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      membership: {
        ...prev.membership,
        [name.replace('membership.', '')]: value
      }
    }));
  };

  const handlePlanChange = (e) => {
    const selectedPlan = membershipPlans.find(plan => plan._id === e.target.value);
    if (selectedPlan) {
      setFormData(prev => ({
        ...prev,
        membership: {
          ...prev.membership,
          plan: selectedPlan._id
        }
      }));
    }
  };

  const calculateEndDate = (startDate, duration) => {
    const start = new Date(startDate);
    const end = new Date(start);

    if (duration.unit === 'day') {
      end.setDate(end.getDate() + duration.value);
    } else if (duration.unit === 'week') {
      end.setDate(end.getDate() + (duration.value * 7));
    } else if (duration.unit === 'month') {
      end.setMonth(end.getMonth() + duration.value);
    } else if (duration.unit === 'year') {
      end.setFullYear(end.getFullYear() + duration.value);
    }

    return end.toISOString().split('T')[0];
  };

  const handlePlanSelect = (planId) => {
    const selectedPlan = membershipPlans.find(plan => plan._id === planId);
    if (selectedPlan) {
      const endDate = calculateEndDate(formData.membership.startDate, selectedPlan.duration);
      setFormData(prev => ({
        ...prev,
        membership: {
          ...prev.membership,
          plan: planId,
          endDate: endDate
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingMember) {
        await dispatch(updateMember({ id: editingMember._id, memberData: formData })).unwrap();
        toast.success('Member updated successfully');
      } else {
        await dispatch(createMember(formData)).unwrap();
        toast.success('Member created successfully');
      }

      setShowModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India'
        },
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        fitnessGoals: [],
        medicalHistory: {
          conditions: [],
          medications: [],
          allergies: [],
          injuries: []
        },
        membership: {
          plan: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          paymentStatus: 'pending'
        }
      });
      setEditingMember(null);
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error(error.message || 'Failed to save member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      dateOfBirth: member.dateOfBirth.split('T')[0],
      gender: member.gender,
      address: member.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      emergencyContact: member.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      fitnessGoals: member.fitnessGoals || [],
      medicalHistory: member.medicalHistory || {
        conditions: [],
        medications: [],
        allergies: [],
        injuries: []
      },
      membership: {
        plan: member.membership.plan._id || member.membership.plan,
        startDate: member.membership.startDate.split('T')[0],
        endDate: member.membership.endDate.split('T')[0],
        paymentStatus: member.membership.paymentStatus
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await dispatch(deleteMember(id)).unwrap();
        toast.success('Member deleted successfully');
      } catch (error) {
        console.error('Error deleting member:', error);
        toast.error(error.message || 'Failed to delete member');
      }
    }
  };

  const filteredMembers = members.filter(member =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const fitnessGoalOptions = [
    'weight-loss',
    'muscle-gain',
    'strength',
    'endurance',
    'flexibility',
    'general-fitness'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalSteps = () => 4;

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mx-auto">

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Total Members</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalMembers}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Active Members</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeMembers}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Expired Members</h3>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.expiredMembers}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700">Pending Payments</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingPayments}</p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="bg-white rounded-xl shadow mb-6 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      dateOfBirth: '',
                      gender: '',
                      address: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: 'India'
                      },
                      emergencyContact: {
                        name: '',
                        phone: '',
                        relationship: ''
                      },
                      fitnessGoals: [],
                      medicalHistory: {
                        conditions: [],
                        medications: [],
                        allergies: [],
                        injuries: []
                      },
                      membership: {
                        plan: '',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: '',
                        paymentStatus: 'pending'
                      }
                    });
                    setShowModal(true);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Member
                </button>
              </div>
            </div>

            {/* Members Table */}
            <TableCard
              loading={loading}
              error={error}
              isEmpty={filteredMembers.length === 0 && !loading && !error}
              errorMessage={error || 'Unable to load members. Please try again.'}
              emptyMessage="No members found"
              loadingMessage="Loading members..."
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(member.dateOfBirth).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>{member.membership.plan && member.membership.plan.name ? member.membership.plan.name : 'Unknown Plan'}</div>
                            <div className="text-xs text-gray-500">
                              Ends: {new Date(member.membership.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.membership.status)}`}>
                            {member.membership.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(member)}
                            className="px-3 me-2 py-2 text-blue-600 hover:text-blue-900 mr-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
                            className="px-3 py-2 text-red-600 hover:text-red-900 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                      disabled={!pagination.hasNext}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * 10, pagination.totalMembers)}
                        </span> of{' '}
                        <span className="font-medium">{pagination.totalMembers}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={!pagination.hasPrev}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {[...Array(pagination.totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                              ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                          disabled={!pagination.hasNext}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </TableCard>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                <div className="p-6">
                  {/* Step Progress Indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {editingMember ? 'Edit Member' : 'Add New Member'}
                      </h2>
                      <span className="text-sm text-gray-500">
                        Step {currentStep} of {getTotalSteps()}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(currentStep / getTotalSteps()) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Enter last name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Enter email address"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date of Birth *
                            </label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Gender *
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Address & Emergency Contact */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Address & Emergency Contact</h3>
                        
                        {/* Address Section */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-lg font-medium text-gray-700 mb-4">Address Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Street Address
                              </label>
                              <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter street address"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter city"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                              </label>
                              <input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter state"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                ZIP Code
                              </label>
                              <input
                                type="text"
                                name="address.zipCode"
                                value={formData.address.zipCode}
                                onChange={handleAddressChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter ZIP code"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Emergency Contact Section */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Name
                              </label>
                              <input
                                type="text"
                                name="emergencyContact.name"
                                value={formData.emergencyContact.name}
                                onChange={handleEmergencyContactChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter contact name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                name="emergencyContact.phone"
                                value={formData.emergencyContact.phone}
                                onChange={handleEmergencyContactChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter phone number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Relationship
                              </label>
                              <input
                                type="text"
                                name="emergencyContact.relationship"
                                value={formData.emergencyContact.relationship}
                                onChange={handleEmergencyContactChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., Spouse, Parent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Health Information */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Health Information</h3>
                        
                        {/* Fitness Goals */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-lg font-medium text-gray-700 mb-4">Fitness Goals *</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {fitnessGoalOptions.map(goal => (
                              <label key={goal} className="flex items-center bg-white p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.fitnessGoals.includes(goal)}
                                  onChange={() => handleFitnessGoalChange(goal)}
                                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="ml-2 capitalize text-gray-700">{goal.replace('-', ' ')}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Medical History */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-lg font-medium text-gray-700 mb-4">Medical History</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Existing Conditions
                              </label>
                              <input
                                type="text"
                                name="conditions"
                                value={formData.medicalHistory.conditions.join(', ')}
                                onChange={handleMedicalHistoryChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., Diabetes, Hypertension"
                              />
                              <p className="text-xs text-gray-500 mt-1">Separate multiple conditions with commas</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Medications
                              </label>
                              <input
                                type="text"
                                name="medications"
                                value={formData.medicalHistory.medications.join(', ')}
                                onChange={handleMedicalHistoryChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., Metformin, Lisinopril"
                              />
                              <p className="text-xs text-gray-500 mt-1">Separate multiple medications with commas</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Allergies
                              </label>
                              <input
                                type="text"
                                name="allergies"
                                value={formData.medicalHistory.allergies.join(', ')}
                                onChange={handleMedicalHistoryChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., Penicillin, Peanuts"
                              />
                              <p className="text-xs text-gray-500 mt-1">Separate multiple allergies with commas</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Previous Injuries
                              </label>
                              <input
                                type="text"
                                name="injuries"
                                value={formData.medicalHistory.injuries.join(', ')}
                                onChange={handleMedicalHistoryChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., ACL tear, Shoulder dislocation"
                              />
                              <p className="text-xs text-gray-500 mt-1">Separate multiple injuries with commas</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Membership Information */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Membership Information</h3>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-lg font-medium text-gray-700 mb-4">Membership Plan Selection</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Plan *
                              </label>
                              <select
                                value={formData.membership.plan}
                                onChange={(e) => handlePlanSelect(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              >
                                <option value="">Choose a membership plan</option>
                                {Array.isArray(membershipPlans) && membershipPlans.map(plan => (
                                  <option key={plan._id} value={plan._id}>
                                    {plan.name} - ₹{plan.price}/{plan.duration.value} {plan.duration.unit}{plan.duration.value > 1 ? 's' : ''}
                                  </option>
                                ))}
                              </select>
                              {plansLoading && <p className="text-sm text-gray-500 mt-1">Loading plans...</p>}
                              {plansError && <p className="text-sm text-red-500 mt-1">{plansError}</p>}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                              </label>
                              <input
                                type="date"
                                name="membership.startDate"
                                value={formData.membership.startDate}
                                onChange={handleMembershipChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                              </label>
                              <input
                                type="date"
                                name="membership.endDate"
                                value={formData.membership.endDate}
                                onChange={handleMembershipChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                readOnly
                              />
                              <p className="text-xs text-gray-500 mt-1">Auto-calculated based on selected plan</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Status
                              </label>
                              <select
                                name="membership.paymentStatus"
                                value={formData.membership.paymentStatus}
                                onChange={handleMembershipChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              >
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                              </select>
                            </div>
                          </div>
                          
                          {/* Plan Summary */}
                          {formData.membership.plan && (
                            <div className="mt-4 p-3 bg-white rounded-lg border">
                              <h5 className="font-medium text-gray-700 mb-2">Selected Plan Summary</h5>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Plan:</span>
                                  <span className="ml-2 font-medium">
                                    {Array.isArray(membershipPlans) ? membershipPlans.find(p => p._id === formData.membership.plan)?.name : ''}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Price:</span>
                                  <span className="ml-2 font-medium">
                                    ₹{Array.isArray(membershipPlans) ? membershipPlans.find(p => p._id === formData.membership.plan)?.price : ''}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Duration:</span>
                                  <span className="ml-2">
                                    {Array.isArray(membershipPlans) ? membershipPlans.find(p => p._id === formData.membership.plan)?.duration.value : ''}{' '}
                                    {Array.isArray(membershipPlans) ? membershipPlans.find(p => p._id === formData.membership.plan)?.duration.unit : ''}
                                    {Array.isArray(membershipPlans) && membershipPlans.find(p => p._id === formData.membership.plan)?.duration.value > 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Ends on:</span>
                                  <span className="ml-2">{formData.membership.endDate}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t border-gray-200">
                      <div>
                        {currentStep > 1 && (
                          <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                          </button>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowModal(false);
                            setCurrentStep(1);
                          }}
                          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        
                        {currentStep < 4 ? (
                          <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center"
                          >
                            Next
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {editingMember ? 'Update Member' : 'Add Member'}
                          </button>
                        )}
                      </div>
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

export default MembersManagement;