import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import OTPVerification from './OTPVerification';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/check-email', { email });
      toast.success(res.data.message);
      setIsOtpScreen(true); // Show OTP input
    } catch (err) {
      // This catches the "Email not registered" error perfectly!
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  };

  if (isOtpScreen) {
    return <OTPVerification email={email} onSuccess={() => {
        // Redirect based on role (handled in App.jsx, but we reload to trigger useEffect)
        window.location.href = '/dashboard';
    }} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-6">Enter your email to log in</p>
        <form onSubmit={handleEmailSubmit}>
          <input 
            type="email" 
            placeholder="you@example.com" 
            className="w-full p-3 border rounded-lg mb-4"
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Send Verification Code
          </button>
        </form>
        <p className="text-xs text-center mt-4 text-gray-400">* Admin: admin@test.com | User: john@test.com</p>
      </div>
    </div>
  );
}