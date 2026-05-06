import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiryStats } from '../../store/slices/inquirySlice';
import { fetchServiceStats } from '../../store/slices/serviceSlice';

const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const { stats: inquiryStats, loading: inquiryLoading, error } = useSelector(state => state.inquiries);
  const { stats: serviceStats, loading: serviceLoading } = useSelector(state => state.services);
  
  const [stats, setStats] = useState({
    totalInquiries: 0,
    totalServices: 0,
    activeMembers: 0,
    revenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let debounceTimer;
    
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchInquiryStats()),
          dispatch(fetchServiceStats())
        ]);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      }
    };
    
    // Debounce the initial fetch
    debounceTimer = setTimeout(fetchData, 500);
    
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    // Combine data from both inquiry and service stats
    const combinedLoading = inquiryLoading || serviceLoading;
      
    if (!combinedLoading) {
      // Calculate total inquiries - accessing the correct data structure from Redux
      const totalInquiries = inquiryStats?.total || 0;
        
      setStats({
        totalInquiries,
        totalServices: serviceStats?.total || serviceStats?.count || serviceStats?.length || 0,
        activeMembers: inquiryStats.new || 0,  // Using new inquiries as active members for now
        revenue: inquiryStats.convertedRevenue || (inquiryStats.converted ? inquiryStats.converted * 100 : 0)  // Use actual revenue if available, otherwise assume $100 per conversion
      });
            
      // Generate chart data from real stats if available
      if (inquiryStats.weeklyData && inquiryStats.weeklyData.length > 0) {
        setChartData(inquiryStats.weeklyData);
      } else {
        // Generate chart data based on inquiryStats.recent if weeklyData is not available
        if (inquiryStats.recent && inquiryStats.recent.length > 0) {
          // Group inquiries by day of week
          const dayMap = {};
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                
          // Initialize all days with 0
          days.forEach(day => {
            dayMap[day] = { day, inquiries: 0, revenue: 0 };
          });
                
          // Count inquiries by day
          inquiryStats.recent.forEach(inquiry => {
            const date = new Date(inquiry.createdAt || inquiry.date);
            const day = days[date.getDay()];
            if (dayMap[day]) {
              dayMap[day].inquiries += 1;
              // Assuming some revenue per inquiry
              dayMap[day].revenue += 50; // Adjust as needed
            }
          });
                
          setChartData(days.map(day => dayMap[day]));
        } else {
          // Fallback to sample data if no real data available
          const sampleDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          setChartData(
            sampleDays.map((day, index) => ({
              day,
              inquiries: Math.floor(Math.random() * 15),
              revenue: Math.floor(Math.random() * 2000)
            }))
          );
        }
      }
        
      setLoading(false);
    }
  }, [inquiryStats, serviceStats, inquiryLoading, serviceLoading]);

  // Calculate percentage changes
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
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

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-red-500 text-center">
              <p className="text-lg font-medium">Error loading analytics data</p>
              <p className="text-sm">{error}</p>
            </div>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Inquiries</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Active Members</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Services</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-orange-100">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
                  <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Inquiries Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Inquiries</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {chartData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="text-xs text-gray-600 mb-1">{day.day}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-md"
                      style={{ height: `${(day.inquiries / Math.max(...chartData.map(d => d.inquiries || 1))) * 200}px` }}
                    ></div>
                    <div className="text-xs text-gray-800 mt-1">{day.inquiries}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Revenue</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {chartData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="text-xs text-gray-600 mb-1">{day.day}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md"
                      style={{ height: `${(day.revenue / Math.max(...chartData.map(d => d.revenue || 1))) * 200}px` }}
                    ></div>
                    <div className="text-xs text-gray-800 mt-1">${Math.round(day.revenue).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>        
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;