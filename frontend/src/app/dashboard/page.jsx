"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Additional Dashboard Components
import TaskForm from '@/components/dashboard/TaskForm';
import TaskSummary from '@/components/dashboard/TaskSummary';
import TaskList from '@/components/dashboard/TaskList';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Task Management State
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  const router = useRouter();

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
        const resTasks = await axios.get('http://localhost:5000/api/tasks');
        setTasks(resTasks.data);
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
      const res = await axios.post('http://localhost:5000/api/tasks', newTaskData);
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedData);
      setTasks(tasks.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted flex h-screen items-center justify-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500 flex h-screen items-center justify-center">{error}</div>;

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
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <Button variant="outline" onClick={handleLogout}>Log out</Button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Summary and Add task */}
          <div className="col-span-1 space-y-8">
            <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Welcome back!</h2>
              <p className="text-muted text-sm mb-4">You are securely logged into the Digital Talent Management System.</p>
              <div className="bg-white p-3 rounded-lg border border-border shadow-inner">
                <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Logged in as</p>
                <p className="font-mono text-sm text-foreground truncate">{user?.email}</p>
              </div>
            </Card>

            <TaskSummary tasks={tasks} />
            <TaskForm onTaskAdded={handleAddTask} />
          </div>

          {/* Right Column: Task List */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold text-foreground">Your Tasks</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            
            {tasksLoading ? (
              <div className="p-12 text-center">Loading tasks...</div>
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
