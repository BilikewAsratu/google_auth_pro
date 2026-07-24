import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/axios';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || 'User');
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock order data (since this is a registration system, we simulate past orders)
  const mockOrders = [
    { id: '#ORD-1001', date: '2026-07-20', total: '$124.50', status: 'Delivered' },
    { id: '#ORD-1002', date: '2026-07-18', total: '$89.00', status: 'Shipped' },
    { id: '#ORD-1003', date: '2026-07-15', total: '$45.99', status: 'Processing' },
  ];

  useEffect(() => {
    // Simulate fetching user-specific data
    setIsLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 500);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  // Quick stats for the dashboard
  const stats = [
    { label: 'Total Orders', value: orders.length, icon: '📦' },
    { label: 'Wishlist Items', value: '7', icon: '❤️' },
    { label: 'Reward Points', value: '1,280', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* ========== TOP NAVBAR ========== */}
      <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">🛍️ ShopDash</span>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            User
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            👋 {userEmail.split('@')[0]}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* ========== MAIN LAYOUT ========== */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- SIDEBAR (Tabs) --- */}
        <aside className="w-56 bg-white shadow-inner p-4 hidden md:block border-r border-gray-200">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center gap-3 ${
                  activeTab === 'overview' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>📊</span> Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center gap-3 ${
                  activeTab === 'orders' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>📋</span> My Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition flex items-center gap-3 ${
                  activeTab === 'profile' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>⚙️</span> Profile
              </button>
            </li>
            <li className="pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition flex items-center gap-3"
              >
                <span>🚪</span> Sign Out
              </button>
            </li>
          </ul>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {/* ===== TAB 1: OVERVIEW ===== */}
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
                <h1 className="text-3xl font-bold">Welcome back, {userEmail.split('@')[0]}! 🎉</h1>
                <p className="opacity-90 mt-1">You are logged in securely with email verification.</p>
                <div className="mt-3 bg-white/20 inline-block px-4 py-1 rounded-full text-sm">
                  ✅ Verified Account
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                    <span className="text-3xl">{stat.icon}</span>
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Action / Shopping CTA */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-3">🛒 Continue Shopping</h3>
                <p className="text-gray-500 text-sm mb-4">Browse our latest collection just for you.</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition">
                  Explore Products →
                </button>
              </div>
            </div>
          )}

          {/* ===== TAB 2: ORDERS ===== */}
          {activeTab === 'orders' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📋 My Orders</h2>
              <p className="text-gray-500 text-sm mb-6">Track your recent purchases.</p>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <span className="text-6xl block mb-4">🛒</span>
                  <p className="text-gray-500">No orders yet. Start shopping!</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                          <td className="px-6 py-4 text-gray-600">{order.date}</td>
                          <td className="px-6 py-4 font-bold text-gray-800">{order.total}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold 
                              ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===== TAB 3: PROFILE ===== */}
          {activeTab === 'profile' && (
            <div className="animate-fadeIn max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">⚙️ Profile Settings</h2>
              <p className="text-gray-500 text-sm mb-6">Manage your account details.</p>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl text-blue-600">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{userEmail.split('@')[0]}</p>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-700">{userEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Account Type</label>
                    <p className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-700 capitalize">
                      {localStorage.getItem('role') || 'User'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Member Since</label>
                    <p className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-700">July 2026</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Verification</label>
                    <p className="p-2 bg-green-50 rounded border border-green-200 text-green-700">✅ Verified</p>
                  </div>
                </div>
                <button className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-semibold transition">
                  Edit Profile (Demo)
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========== FOOTER ========== */}
      <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-400">
        © 2026 ShopDash — Secure Email Verification System
      </footer>

      {/* Add this CSS fade-in animation (put it in index.css or a global CSS file) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}