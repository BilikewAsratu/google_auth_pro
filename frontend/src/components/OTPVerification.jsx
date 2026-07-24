import { useState } from 'react';
import { api } from '../api/axios';
import toast from 'react-hot-toast';

export default function OTPVerification({ email, onSuccess }) {
  const [code, setCode] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/verify-otp', { email, code });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('email', res.data.user.email);
      toast.success('Login successful!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-sm text-gray-500 mb-4">We sent a 6-digit code to {email}</p>
        <form onSubmit={handleVerify}>
          <input 
            type="text" maxLength="6" placeholder="Enter 6-digit code" 
            className="w-full p-3 border rounded-lg mb-4 text-center text-2xl tracking-widest"
            value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} required 
          />
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Verify & Login
          </button>
        </form>
      </div>
    </div>
  );
}