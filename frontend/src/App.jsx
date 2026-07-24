import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './components/Landing';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/dashboard" element={
          token ? (role === 'admin' ? <AdminDashboard /> : <UserDashboard />) : <Navigate to="/" />
        } />
      </Routes>
    </BrowserRouter>
  );
}
export default App;