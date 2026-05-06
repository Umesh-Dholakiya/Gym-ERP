import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { inquiryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Sort inquiries by date (newest first)
  const sortedInquiries = [...inquiries].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await inquiryAPI.getAll();
      // Handle different possible response structures
      const inquiriesData = response.data.data?.inquiries || response.data.inquiries || response.data;

      console.log('Raw inquiries data:', inquiriesData); // Debug log

      // Transform the data to match our UI structure
      const transformedInquiries = Array.isArray(inquiriesData) ? inquiriesData.map(inquiry => ({
        id: inquiry._id,
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email,
        service: inquiry.service?.name || 'N/A',
        message: inquiry.message,
        preferredTime: inquiry.preferredTime,
        status: inquiry.status,
        date: new Date(inquiry.createdAt).toISOString().split('T')[0],
        followUpDate: inquiry.followUpDate,
        notes: inquiry.notes || '',
        serviceName: inquiry.service?.name || 'N/A'
      })) : [];

      setInquiries(transformedInquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      // Set empty array if API fails
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id, newStatus) => {
    try {
      await inquiryAPI.update(id, { status: newStatus });

      // Update the local state after successful API call
      setInquiries(prev => prev.map(inquiry =>
        inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
      ));

      // Also update the selected inquiry if it's the one being viewed
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => ({
          ...prev,
          status: newStatus
        }));
      }

      toast.success('Inquiry status updated successfully!');
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update inquiry status.';
      toast.error(errorMessage);

      // Optionally, refetch the data to ensure consistency
      fetchInquiries();
    }
  };

  const updateInquiryNotes = async (id, notes) => {
    try {
      // Ensure notes is a string before sending to API
      const notesString = typeof notes === 'string' ? notes : String(notes || '');

      const response = await inquiryAPI.update(id, { notes: notesString });

      // Update the local state after successful API call
      setInquiries(prev => prev.map(inquiry =>
        inquiry.id === id ? { ...inquiry, notes: response.data.data.inquiry.notes } : inquiry
      ));

      // Update the selected inquiry as well
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => ({
          ...prev,
          notes: response.data.data.inquiry.notes
        }));
      }

      toast.success('Notes updated successfully!');
    } catch (error) {
      console.error('Error updating notes:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update notes.';
      toast.error(errorMessage);
    }
  };

  const updateInquiryFollowUpDate = async (id, followUpDate) => {
    try {
      // Validate date format
      if (!followUpDate) {
        alert('Please select a valid follow-up date');
        return;
      }

      const response = await inquiryAPI.update(id, { followUpDate });

      // Update the local state after successful API call
      setInquiries(prev => prev.map(inquiry =>
        inquiry.id === id ? { ...inquiry, followUpDate: response.data.data.inquiry.followUpDate } : inquiry
      ));

      // Update the selected inquiry as well
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => ({
          ...prev,
          followUpDate: response.data.data.inquiry.followUpDate
        }));
      }

      toast.success('Follow-up date updated successfully!');
    } catch (error) {
      console.error('Error updating follow-up date:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update follow-up date.';
      toast.error(errorMessage);
    }
  };



  const filteredInquiries = sortedInquiries.filter(inquiry => {
    const matchesFilter = filter === 'all' || inquiry.status === filter;
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'follow-up':
        return 'bg-orange-100 text-orange-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (inquiry) => {
    // Ensure proper initialization of updated fields
    setSelectedInquiry({
      ...inquiry,
      updatedNotes: typeof inquiry.notes === 'string' && inquiry.notes ? inquiry.notes : '',
      updatedFollowUpDate: inquiry.followUpDate || ''
    });
    setShowDetailsModal(true);
  };

  const handleUpdateNotes = async () => {
    if (selectedInquiry && selectedInquiry.updatedNotes !== undefined) {
      // Trim whitespace and validate notes
      const trimmedNotes = typeof selectedInquiry.updatedNotes === 'string' ? selectedInquiry.updatedNotes.trim() : '';

      await updateInquiryNotes(selectedInquiry.id, trimmedNotes);
      setShowDetailsModal(false);
    }
  };

  const handleUpdateFollowUpDate = async () => {
    if (selectedInquiry && selectedInquiry.updatedFollowUpDate) {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(selectedInquiry.updatedFollowUpDate)) {
        toast.error('Please select a valid follow-up date in YYYY-MM-DD format');
        return;
      }

      await updateInquiryFollowUpDate(selectedInquiry.id, selectedInquiry.updatedFollowUpDate);
      // Close modal after successful update
      setShowDetailsModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {['all', 'new', 'contacted', 'follow-up', 'converted', 'closed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-full capitalize hover-combo ${filter === status
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Inquiry Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-up Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.preferredTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                        <div className="flex space-x-2 mt-1">
                          <a
                            href={`https://wa.me/${inquiry.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            title="WhatsApp Chat"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                          </a>
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="inline-flex items-center px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                            title="Call"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.016 15.96l-2.516.547-3.422-8.016 2.531-1.078c.328-.141.578-.422.656-.766l.328-1.547c.078-.391-.078-.797-.375-1.031l-2.016-1.5c-.203-.141-.453-.203-.703-.172l-1.406.25c-.328.047-.656.203-.891.437l-1.781 1.797-4.359-2.625 1.781-1.781c.234-.234.391-.563.437-.906l.25-1.406c.031-.25-.031-.5-.172-.703l-1.5-2.016c-.234-.297-.641-.437-1.031-.359l-1.547.328c-.344.078-.625.328-.766.656l-1.078 2.531L.547 7.967l.547 2.516c.109.5.469.906.937 1.063l15.516 4.5c.469.156.984.031 1.313-.297zm-13.5-10.5l1.5 2.016c.234.297.641.437 1.031.359l1.547-.328c.344-.078.625-.328.766-.656l1.078-2.531 4.359 2.625-1.781 1.781c-.234.234-.391.563-.437.906l-.25 1.406c-.031.25.031.5.172.703l1.5 2.016c.297.234.703.375 1.031.172l1.406-.25c.25-.031.5.031.703.172l1.781 1.797 2.516-.547c.328-.078.609-.328.703-.656l.547-2.516-15.516-4.5c-.328-.109-.703-.031-.984.203z" />
                            </svg>
                            Call
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inquiry.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inquiry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inquiry.status === 'follow-up' && inquiry.followUpDate ? new Date(inquiry.followUpDate).toLocaleDateString() : (inquiry.status === 'follow-up' ? 'No date set' : inquiry.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={inquiry.notes || ''}>
                        {inquiry.notes ? inquiry.notes.substring(0, 50) + (inquiry.notes.length > 50 ? '...' : '') : 'No notes'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleViewDetails(inquiry)}
                            className="text-gray-700 hover:text-white-900  bg-orange-500 rounded px-3 py-2 fs-6"
                          >
                            View
                          </button>
                          {/* <select chart
                            value={inquiry.status}
                            onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 mt-1"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="follow-up">Follow-up</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredInquiries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No inquiries found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-xl shadow p-6 mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredInquiries.length}</span> of{' '}
              <span className="font-medium">{inquiries.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover-combo">
                Previous
              </button>
              <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 hover-combo">
                Next
              </button>
            </div>
          </div>
        </main>

        {showDetailsModal && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Inquiry Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 hover-combo"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedInquiry.phone}</p>
                    <div className="flex space-x-2 mt-1">
                      <a
                        href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        title="WhatsApp Chat"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="inline-flex items-center px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        title="Call"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.016 15.96l-2.516.547-3.422-8.016 2.531-1.078c.328-.141.578-.422.656-.766l.328-1.547c.078-.391-.078-.797-.375-1.031l-2.016-1.5c-.203-.141-.453-.203-.703-.172l-1.406.25c-.328.047-.656.203-.891.437l-1.781 1.797-4.359-2.625 1.781-1.781c.234-.234.391-.563.437-.906l.25-1.406c.031-.25-.031-.5-.172-.703l-1.5-2.016c-.234-.297-.641-.437-1.031-.359l-1.547.328c-.344.078-.625.328-.766.656l-1.078 2.531L.547 7.967l.547 2.516c.109.5.469.906.937 1.063l15.516 4.5c.469.156.984.031 1.313-.297zm-13.5-10.5l1.5 2.016c.234.297.641.437 1.031.359l1.547-.328c.344-.078.625-.328.766-.656l1.078-2.531 4.359 2.625-1.781 1.781c-.234.234-.391.563-.437.906l-.25 1.406c-.031.25.031.5.172.703l1.5 2.016c.297.234.703.375 1.031.172l1.406-.25c.25-.031.5.031.703.172l1.781 1.797 2.516-.547c.328-.078.609-.328.703-.656l.547-2.516-15.516-4.5c-.328-.109-.703-.031-.984.203z" />
                        </svg>
                        Call
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <p className="text-gray-900">{selectedInquiry.service}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        // Update the local state immediately for UI responsiveness
                        setSelectedInquiry(prev => ({
                          ...prev,
                          status: newStatus
                        }));
                        // Then update the backend
                        updateInquiryStatus(selectedInquiry.id, newStatus);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                    <p className="text-gray-900">{selectedInquiry.preferredTime}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <p className="text-gray-900">{selectedInquiry.date}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-gray-900">{selectedInquiry.message}</p>
                  </div>
                </div>

                {selectedInquiry?.status === 'follow-up' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={selectedInquiry?.updatedFollowUpDate || ''}
                      onChange={(e) => setSelectedInquiry(prev => ({
                        ...prev,
                        updatedFollowUpDate: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={handleUpdateFollowUpDate}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover-combo"
                    >
                      Update Follow-up Date
                    </button>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows="4"
                    value={selectedInquiry?.updatedNotes || ''}
                    onChange={(e) => setSelectedInquiry(prev => ({
                      ...prev,
                      updatedNotes: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Add notes about this inquiry..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover-combo"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateNotes}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover-combo"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;