"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Additional Dashboard Components
import TaskForm from '@/components/dashboard/TaskForm';
import TaskList from '@/components/dashboard/TaskList';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Task & Admin State
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  const router = useRouter();

  const getTokenHeaders = () => {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
  };

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const resUser = await fetch('http://localhost:5000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = await resUser.json();
        
        if (!resUser.ok) throw new Error(userData.error || 'Failed to fetch user');
        setUser(userData.user);

        // Fetch tasks
        setTasksLoading(true);
        const resTasks = await axios.get('http://localhost:5000/api/tasks', getTokenHeaders());
        setTasks(resTasks.data);
        
        // If admin, fetch users
        if (userData.user.role === 'admin') {
          try {
            const resUsers = await axios.get('http://localhost:5000/api/users', getTokenHeaders());
            setUsers(resUsers.data);
          } catch(e) {
            console.error(e);
          }
        }
      } catch (err) {
        setError(err.message);
        if (err.message.includes('token') || err.message.includes('fetch user')) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
        setTasksLoading(false);
      }
    };

    fetchUserAndTasks();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  // Task API integrations
  const handleAddTask = async (newTaskData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', newTaskData, getTokenHeaders());
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedData, getTokenHeaders());
      setTasks(tasks.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, getTokenHeaders());
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted flex h-screen items-center justify-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500 flex h-screen items-center justify-center">{error}</div>;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted mt-1 text-sm">Manage your daily tasks and productivity</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <span className="block text-sm font-medium text-foreground">{user?.email}</span>
              <span className="block text-xs text-muted uppercase tracking-wider font-bold text-primary">{user?.role}</span>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-primary/10 text-primary'}`}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <Button variant="outline" onClick={handleLogout}>Log out</Button>
          </div>
        </header>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-5 border-l-4 border-l-gray-500 shadow-sm hover:shadow transition-shadow">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Total Tasks</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">{totalTasks}</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-green-500 shadow-sm hover:shadow transition-shadow">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Completed</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">{completedTasks}</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-yellow-500 shadow-sm hover:shadow transition-shadow">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Pending</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingTasks}</p>
          </Card>
          <Card className="p-5 shadow-sm hover:shadow transition-shadow">
            <div className="flex justify-between items-end">
              <div className="w-full">
                <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Completion Rate</h3>
                <p className="text-3xl font-bold mt-2 text-primary">{completionRate}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
            </div>
          </Card>
        </div>

        {/* Admin Section Removed */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Summary and Add task */}
          <div className="col-span-1 space-y-8">
            <TaskForm onTaskAdded={handleAddTask} />
            
            {taskChartData.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Task Progress Monitor</h3>
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
            )}
          </div>

          {/* Right Column: Task List */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                Your Tasks
              </h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            
            {tasksLoading ? (
              <div className="p-12 text-center text-muted animate-pulse">Loading tasks...</div>
            ) : (
              <TaskList 
                tasks={tasks} 
                onUpdateTask={handleUpdateTask} 
                onDeleteTask={handleDeleteTask} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
