import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { clearError, createTrainer, deleteTrainer, fetchTrainers, fetchTrainerStats, updateTrainer } from '../../store/slices/trainerSlice';
import { trainerAPI } from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import TableCard from '../../components/admin/TableCard';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';

const TrainersManagement = () => {
    const dispatch = useDispatch();
    const { trainers, stats, loading, error, pagination } = useSelector(state => state.trainers);
    const { user } = useSelector(state => state.auth);

    const [showModal, setShowModal] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        specialization: [],
        certifications: [],
        experience: {
            years: 0,
            previousGyms: []
        },
        availability: {
            monday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
            tuesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
            wednesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
            thursday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
            friday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
            saturday: { startTime: '09:00', endTime: '17:00', isAvailable: false },
            sunday: { startTime: '09:00', endTime: '17:00', isAvailable: false }
        },
        hourlyRate: '',
        commissionRate: 10,
        bio: '',
        photo: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Fetch data
    useEffect(() => {
        dispatch(fetchTrainers({ page: currentPage, limit: 10 }));
        dispatch(fetchTrainerStats());
    }, [dispatch, currentPage]);

    useEffect(() => {
        if (error) {
            // Don't show toast here anymore, we'll show error in the UI
            dispatch(clearError());
        }
    }, [error, dispatch]);

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

    const handleSpecializationChange = (spec) => {
        setFormData(prev => ({
            ...prev,
            specialization: prev.specialization.includes(spec)
                ? prev.specialization.filter(s => s !== spec)
                : [...prev.specialization, spec]
        }));
    };

    const handleCertificationChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.map((cert, i) =>
                i === index ? { ...cert, [field]: value } : cert
            )
        }));
    };

    const addCertification = () => {
        setFormData(prev => ({
            ...prev,
            certifications: [...prev.certifications, {
                name: '',
                issuingOrganization: '',
                issueDate: '',
                expiryDate: '',
                certificateNumber: ''
            }]
        }));
    };

    const removeCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    const handleAvailabilityChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: {
                    ...prev.availability[day],
                    [field]: value
                }
            }
        }));
    };

    const handlePreviousGymChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            experience: {
                ...prev.experience,
                previousGyms: prev.experience.previousGyms.map((gym, i) =>
                    i === index ? { ...gym, [field]: value } : gym
                )
            }
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setPhotoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        // Reset file input
        const fileInput = document.getElementById('photo-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

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

    const getTotalSteps = () => 4;

    const addPreviousGym = () => {
        setFormData(prev => ({
            ...prev,
            experience: {
                ...prev.experience,
                previousGyms: [...prev.experience.previousGyms, {
                    gymName: '',
                    position: '',
                    startDate: '',
                    endDate: ''
                }]
            }
        }));
    };

    const removePreviousGym = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: {
                ...prev.experience,
                previousGyms: prev.experience.previousGyms.filter((_, i) => i !== index)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingTrainer) {
                // Use the photo-enabled update method
                if (photoFile) {
                    await trainerAPI.updateWithPhoto(editingTrainer._id, formData, photoFile);
                } else {
                    await dispatch(updateTrainer({ id: editingTrainer._id, trainerData: formData })).unwrap();
                }
                toast.success('Trainer updated successfully');
            } else {
                // Use the photo-enabled create method
                if (photoFile) {
                    await trainerAPI.createWithPhoto(formData, photoFile);
                } else {
                    await dispatch(createTrainer(formData)).unwrap();
                }
                toast.success('Trainer created successfully');
            }

            setShowModal(false);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                gender: '',
                specialization: [],
                certifications: [],
                experience: {
                    years: 0,
                    previousGyms: []
                },
                availability: {
                    monday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                    tuesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                    wednesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                    thursday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                    friday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                    saturday: { startTime: '09:00', endTime: '17:00', isAvailable: false },
                    sunday: { startTime: '09:00', endTime: '17:00', isAvailable: false }
                },
                hourlyRate: '',
                commissionRate: 10,
                bio: '',
                photo: ''
            });
            setEditingTrainer(null);
            setPhotoFile(null);
            setPhotoPreview(null);
        } catch (error) {
            console.error('Error saving trainer:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to save trainer');
        }
    };

    const handleEdit = (trainer) => {
        setEditingTrainer(trainer);
        setFormData({
            firstName: trainer.firstName,
            lastName: trainer.lastName,
            email: trainer.email,
            phone: trainer.phone,
            dateOfBirth: trainer.dateOfBirth.split('T')[0],
            gender: trainer.gender,
            specialization: trainer.specialization || [],
            certifications: trainer.certifications || [],
            experience: trainer.experience || { years: 0, previousGyms: [] },
            availability: trainer.availability || {
                monday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                tuesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                wednesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                thursday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                friday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                saturday: { startTime: '09:00', endTime: '17:00', isAvailable: false },
                sunday: { startTime: '09:00', endTime: '17:00', isAvailable: false }
            },
            hourlyRate: trainer.hourlyRate,
            commissionRate: trainer.commissionRate,
            bio: trainer.bio || '',
            photo: trainer.photo || ''
        });
        // Set photo preview if trainer has a photo
        if (trainer.photo) {
            setPhotoPreview(`${window.location.origin}${trainer.photo}`);
        } else {
            setPhotoPreview(null);
        }
        setPhotoFile(null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to deactivate this trainer?')) {
            try {
                await dispatch(deleteTrainer(id)).unwrap();
                toast.success('Trainer deactivated successfully');
            } catch (error) {
                console.error('Error deactivating trainer:', error);
                toast.error(error.message || 'Failed to deactivate trainer');
            }
        }
    };

    const filteredTrainers = trainers.filter(trainer =>
        trainer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.phone.includes(searchTerm) ||
        trainer.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const specializationOptions = [
        'strength-training',
        'cardio',
        'yoga',
        'crossfit',
        'bodybuilding',
        'functional-fitness',
        'sports-conditioning',
        'weight-loss',
        'rehabilitation',
        'nutrition'
    ];

    const getAvailabilityStatus = (availability) => {
        const days = Object.keys(availability);
        const availableDays = days.filter(day => availability[day].isAvailable);
        return `${availableDays.length}/7 days`;
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-xl shadow p-6">
                                    <h3 className="text-lg font-semibold text-gray-700">Total Trainers</h3>
                                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalTrainers}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow p-6">
                                    <h3 className="text-lg font-semibold text-gray-700">Avg Experience</h3>
                                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.averageExperience?.toFixed(1) || 0} yrs</p>
                                </div>
                                <div className="bg-white rounded-xl shadow p-6">
                                    <h3 className="text-lg font-semibold text-gray-700">Most Popular Spec</h3>
                                    <p className="text-3xl font-bold text-purple-600 mt-2">
                                        {stats.specializationDistribution[0]?.name || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="bg-white rounded-xl shadow mb-6 p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search trainers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingTrainer(null);
                                        setFormData({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            phone: '',
                                            dateOfBirth: '',
                                            gender: '',
                                            specialization: [],
                                            certifications: [],
                                            experience: {
                                                years: 0,
                                                previousGyms: []
                                            },
                                            availability: {
                                                monday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                                                tuesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                                                wednesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                                                thursday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                                                friday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
                                                saturday: { startTime: '09:00', endTime: '17:00', isAvailable: false },
                                                sunday: { startTime: '09:00', endTime: '17:00', isAvailable: false }
                                            },
                                            hourlyRate: '',
                                            commissionRate: 10,
                                            bio: '',
                                            photo: ''
                                        });
                                        setShowModal(true);
                                    }}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Add Trainer
                                </button>
                            </div>
                        </div>

                        {/* Trainers Table */}
                        <TableCard
                            loading={loading}
                            error={error}
                            isEmpty={filteredTrainers.length === 0 && !loading && !error}
                            errorMessage={error || 'Unable to load trainers. Please try again.'}
                            emptyMessage="No trainers found"
                            loadingMessage="Loading trainers..."
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specializations</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTrainers.map((trainer) => (
                                            <tr key={trainer._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {trainer.photo ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={`${import.meta.env.VITE_API_BASE_URL || '/api'}${trainer.photo}`}
                                                                    alt={`${trainer.firstName} ${trainer.lastName}`}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <span className="text-gray-500 font-medium">
                                                                        {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {trainer.firstName} {trainer.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {trainer.gender}, {trainer.age || 'N/A'} years
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {trainer.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-1">
                                                        {trainer.specialization.slice(0, 3).map(spec => (
                                                            <span key={spec} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {spec.replace('-', ' ')}
                                                            </span>
                                                        ))}
                                                        {trainer.specialization.length > 3 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                +{trainer.specialization.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {trainer.experience && trainer.experience.years ? trainer.experience.years : 0} years
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {getAvailabilityStatus(trainer.availability)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(trainer)}
                                                        className="px-3 me-2 py-2 text-blue-600 hover:text-blue-900 mr-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(trainer._id)}
                                                        className="px-3 me-2 py-2 text-red-600 hover:text-red-900 bg-red-500 text-white rounded hover:bg-red-600">
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
                                                    {Math.min(currentPage * 10, pagination.totalTrainers)}
                                                </span> of{' '}
                                                <span className="font-medium">{pagination.totalTrainers}</span> results
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

                        {/* Modal */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                                    <div className="p-6">
                                        {/* Step Progress Indicator */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-2xl font-bold text-gray-800">
                                                    {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
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
                                            {/* Step 1: Basic Information */}
                                            {currentStep === 1 && (
                                                <div className="space-y-6">
                                                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
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
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Hourly Rate *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="hourlyRate"
                                                                value={formData.hourlyRate}
                                                                onChange={handleInputChange}
                                                                required
                                                                min="0"
                                                                step="0.01"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Commission Rate (%)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="commissionRate"
                                                                value={formData.commissionRate}
                                                                onChange={handleInputChange}
                                                                min="0"
                                                                max="100"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 2: Professional Details */}
                                            {currentStep === 2 && (
                                                <div className="space-y-6">
                                                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Professional Details</h3>
                                                    
                                                    {/* Specializations */}
                                                    <div>
                                                        <h4 className="text-lg font-medium text-gray-700 mb-4">Specializations *</h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {specializationOptions.map(spec => (
                                                                <label key={spec} className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={formData.specialization.includes(spec)}
                                                                        onChange={() => handleSpecializationChange(spec)}
                                                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                                    />
                                                                    <span className="ml-2 capitalize text-gray-700">{spec.replace('-', ' ')}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Photo Upload */}
                                                    <div>
                                                        <h4 className="text-lg font-medium text-gray-700 mb-4">Profile Photo</h4>
                                                        <div className="flex items-start gap-4">
                                                            {/* Photo Preview */}
                                                            {photoPreview && (
                                                                <div className="relative">
                                                                    <img
                                                                        src={photoPreview}
                                                                        alt="Preview"
                                                                        className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={removePhoto}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Upload Area */}
                                                            <div className="flex-1">
                                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                                                                    <input
                                                                        id="photo-upload"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={handlePhotoChange}
                                                                        className="hidden"
                                                                    />
                                                                    <label
                                                                        htmlFor="photo-upload"
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <div className="flex flex-col items-center">
                                                                            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                            <p className="text-gray-600 mb-1">Click to upload photo</p>
                                                                            <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                                {photoFile && (
                                                                    <p className="text-sm text-green-600 mt-2">
                                                                        Selected: {photoFile.name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Bio */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Bio
                                                        </label>
                                                        <textarea
                                                            name="bio"
                                                            value={formData.bio}
                                                            onChange={handleInputChange}
                                                            rows="4"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                            placeholder="Enter trainer bio..."
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 3: Certifications & Experience */}
                                            {currentStep === 3 && (
                                                <div className="space-y-6">
                                                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Certifications & Experience</h3>
                                                                                                
                                                    {/* Certifications */}
                                                    <div>
                                                        <h4 className="text-lg font-medium text-gray-700 mb-4">Certifications</h4>
                                                        {formData.certifications.map((cert, index) => (
                                                            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Certification Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={cert.name}
                                                                            onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                            placeholder="e.g., Certified Personal Trainer"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Issuing Organization
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={cert.issuingOrganization}
                                                                            onChange={(e) => handleCertificationChange(index, 'issuingOrganization', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                            placeholder="e.g., ACSM, NASM"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Issue Date
                                                                        </label>
                                                                        <input
                                                                            type="date"
                                                                            value={cert.issueDate}
                                                                            onChange={(e) => handleCertificationChange(index, 'issueDate', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Expiry Date
                                                                        </label>
                                                                        <input
                                                                            type="date"
                                                                            value={cert.expiryDate}
                                                                            onChange={(e) => handleCertificationChange(index, 'expiryDate', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                        />
                                                                    </div>
                                                                    <div className="md:col-span-2">
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Certificate Number
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={cert.certificateNumber}
                                                                            onChange={(e) => handleCertificationChange(index, 'certificateNumber', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                            placeholder="Certificate ID or Number"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeCertification(index)}
                                                                    className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                                                                >
                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Remove Certification
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={addCertification}
                                                            className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                            Add Certification
                                                        </button>
                                                    </div>
                                            
                                                    {/* Experience */}
                                                    <div>
                                                        <h4 className="text-lg font-medium text-gray-700 mb-4">Work Experience</h4>
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Years of Experience
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="experience.years"
                                                                value={formData.experience.years}
                                                                onChange={handleInputChange}
                                                                min="0"
                                                                className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                placeholder="Years"
                                                            />
                                                        </div>
                                            
                                                        <h5 className="text-md font-medium text-gray-700 mb-3">Previous Gyms</h5>
                                                        {formData.experience.previousGyms.map((gym, index) => (
                                                            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Gym Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={gym.gymName}
                                                                            onChange={(e) => handlePreviousGymChange(index, 'gymName', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                            placeholder="Gym name"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Position
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={gym.position}
                                                                            onChange={(e) => handlePreviousGymChange(index, 'position', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                            placeholder="e.g., Senior Trainer"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            Start Date
                                                                        </label>
                                                                        <input
                                                                            type="date"
                                                                            value={gym.startDate}
                                                                            onChange={(e) => handlePreviousGymChange(index, 'startDate', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                            End Date
                                                                        </label>
                                                                        <input
                                                                            type="date"
                                                                            value={gym.endDate}
                                                                            onChange={(e) => handlePreviousGymChange(index, 'endDate', e.target.value)}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removePreviousGym(index)}
                                                                    className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                                                                >
                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Remove Gym
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={addPreviousGym}
                                                            className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                            Add Previous Gym
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Step 4: Availability */}
                                            {currentStep === 4 && (
                                                <div className="space-y-6">
                                                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Weekly Availability</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {Object.entries(formData.availability).map(([day, availability]) => (
                                                            <div key={day} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h4 className="text-md font-medium text-gray-700 capitalize">{day}</h4>
                                                                    <label className="flex items-center bg-white px-3 py-1 rounded-lg">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={availability.isAvailable}
                                                                            onChange={(e) => handleAvailabilityChange(day, 'isAvailable', e.target.checked)}
                                                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                                        />
                                                                        <span className="ml-2 text-sm">Available</span>
                                                                    </label>
                                                                </div>
                                                                {availability.isAvailable && (
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                Start Time
                                                                            </label>
                                                                            <input
                                                                                type="time"
                                                                                value={availability.startTime}
                                                                                onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                                End Time
                                                                            </label>
                                                                            <input
                                                                                type="time"
                                                                                value={availability.endTime}
                                                                                onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {!availability.isAvailable && (
                                                                    <p className="text-sm text-gray-500 italic">Not available on {day}s</p>
                                                                )}
                                                            </div>
                                                        ))}
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
                                                            {editingTrainer ? 'Update Trainer' : 'Add Trainer'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TrainersManagement;