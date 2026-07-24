import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    };
    fetchUsers();
  }, [token]);

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users.filter(u => u.id !== id));
    toast.success('User removed');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">🛡️ Admin Panel</h1>
      <p>Managing {users.length} users</p>
      <table className="w-full mt-4 border">
        <thead><tr><th>ID</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td>{u.id}</td><td>{u.email}</td><td>{u.role}</td>
              <td><button onClick={() => deleteUser(u.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}