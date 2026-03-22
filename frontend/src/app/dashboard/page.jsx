"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
        
        setUser(data.user);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  }

  if (loading) return <div className="p-8 text-center text-muted">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-primary">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Log out</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          <p className="text-muted mb-4">You are securely logged into the Digital Talent Management System.</p>
          <div className="bg-gray-50 p-4 rounded-lg border border-border">
            <p className="font-mono text-sm text-foreground">Email: {user?.email}</p>
            <p className="font-mono text-sm text-foreground mt-2">ID: {user?.id}</p>
          </div>
        </Card>
        
        <Card className="col-span-1 border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-10 rounded-bl-full"></div>
          <h2 className="text-xl font-semibold mb-4 text-primary">System Status</h2>
          <div className="flex items-center text-emerald-600 font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            All systems operational
          </div>
        </Card>
      </div>
    </div>
  );
}
