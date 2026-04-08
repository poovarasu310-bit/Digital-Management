"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Edit Task State
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', status: '', githubLink: '' });

  const router = useRouter();

  const getTokenHeaders = () => {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const resUser = await fetch('http://localhost:5000/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await resUser.json();
        
        if (!resUser.ok) throw new Error(userData.error || 'Failed to fetch user');
        
        if (userData.user.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        setUser(userData.user);

        const resUsers = await axios.get('http://localhost:5000/api/users', getTokenHeaders());
        setUsers(resUsers.data);

        const resTasks = await axios.get('http://localhost:5000/api/tasks', getTokenHeaders());
        setTasks(resTasks.data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('token') || err.message.includes('fetch user')) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, getTokenHeaders());
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, getTokenHeaders());
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };
  
  const startEditTask = (t) => {
    setEditingTaskId(t.id);
    setEditForm({ title: t.title, status: t.status, githubLink: t.githubLink || '' });
  };
  
  const saveTaskEdit = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, editForm, getTokenHeaders());
      setTasks(tasks.map(t => (t.id === id ? res.data : t)));
      setEditingTaskId(null);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const getOwnerEmail = (userId) => {
    const owner = users.find(u => u.id === userId);
    return owner ? owner.email : 'Unknown';
  };

  if (loading) return <div className="p-8 text-center text-muted flex h-screen items-center justify-center">Loading Admin Panel...</div>;
  if (error) return <div className="p-8 text-center text-red-500 flex h-screen items-center justify-center">{error}</div>;

  const totalUsers = users.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  
  const taskChartData = tasks.map((t, index) => {
    let progress = 0;
    if (t.status === 'completed') progress = 100;
    else if (t.status === 'in-progress') progress = 50;
    else progress = 20;

    return {
      name: t.title.length > 10 ? t.title.substring(0, 10) + '...' : t.title,
      progress: progress,
      color: COLORS[index % COLORS.length]
    };
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted mt-1 text-sm">System Overview and Management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <span className="block text-sm font-medium text-foreground">{user?.email}</span>
              <span className="block text-xs text-muted uppercase tracking-wider font-bold text-purple-600">Administrator</span>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-purple-100 text-purple-700">
              A
            </div>
            <Button variant="outline" onClick={handleLogout}>Log out</Button>
          </div>
        </header>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card className="p-5 border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-shadow">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Total Users</h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">{totalUsers}</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-gray-500 shadow-sm hover:shadow transition-shadow">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Total Tasks</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">{totalTasks}</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-green-500 shadow-sm hover:shadow transition-shadow">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Completed Tasks</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">{completedTasks}</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-yellow-500 shadow-sm hover:shadow transition-shadow">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Pending Tasks</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingTasks}</p>
          </Card>
        </div>

        {/* Charts Section */}
        {taskChartData.length > 0 && (
          <div className="mb-10">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Overall Task Progress Monitor</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={taskChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                    <XAxis dataKey="name" tick={{fontSize: 11}} />
                    <YAxis domain={[0, 100]} tickFormatter={(t) => `${t}%`} tick={{fontSize: 11}} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="progress" barSize={30} name="Progress %" radius={[4, 4, 0, 0]}>
                      {taskChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Line type="monotone" dataKey="progress" stroke="#334155" strokeWidth={3} dot={{ r: 5, fill: '#334155', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* Full-width layout for Task Management (primary feature) */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Admin Task Management</h2>
          <Card className="overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100/50 border-b border-gray-200 text-sm">
                    <th className="p-3 font-medium text-muted">Title</th>
                    <th className="p-3 font-medium text-muted">Status</th>
                    <th className="p-3 font-medium text-muted">Owner</th>
                    <th className="p-3 font-medium text-muted">Code</th>
                    <th className="p-3 font-medium text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t => (
                    <tr key={t.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                      {editingTaskId === t.id ? (
                        <td colSpan={5} className="p-3">
                          <div className="flex flex-col gap-2">
                            <input 
                              className="border rounded px-2 py-1 flex-1 text-sm"
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            />
                            <input 
                              type="url"
                              className="border rounded px-2 py-1 flex-1 text-sm"
                              value={editForm.githubLink}
                              onChange={(e) => setEditForm({...editForm, githubLink: e.target.value})}
                              placeholder="GitHub Link"
                            />
                            <select 
                              className="border rounded px-2 py-1 text-sm bg-white text-slate-900"
                              value={editForm.status}
                              onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In-Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <div className="flex gap-2 justify-end mt-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingTaskId(null)}>Cancel</Button>
                              <Button size="sm" onClick={() => saveTaskEdit(t.id)}>Save</Button>
                            </div>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td className="p-3 text-sm font-medium">{t.title}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                              t.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                              t.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-muted break-all max-w-[150px]">
                            {getOwnerEmail(t.userId)}
                          </td>
                          <td className="p-3 text-sm text-muted">
                            {t.githubLink ? (
                              <a href={t.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
                                GitHub
                              </a>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-3 justify-end">
                              <button onClick={() => startEditTask(t)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">Edit</button>
                              <button onClick={() => handleDeleteTask(t.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted">No tasks found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* User Management Section */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">User Management</h2>
          <Card className="overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100/50 border-b border-gray-200 text-sm">
                    <th className="p-3 font-medium text-muted">User Email</th>
                    <th className="p-3 font-medium text-muted">Role</th>
                    <th className="p-3 font-medium text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 text-sm font-medium">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                          disabled={u.id === user.id}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-muted">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>


      </div>
    </div>
  );
}
