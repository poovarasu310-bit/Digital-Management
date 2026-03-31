"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      // Role Validation
      if (activeTab === 'admin' && data.user.role !== 'admin') {
        throw new Error('Access denied. Not an admin account.');
      }
      if (activeTab === 'user' && data.user.role !== 'user') {
        throw new Error('Access denied. Not a standard user account.');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Optional but good for UI
      
      if (activeTab === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Please ensure the backend is running on port 5000.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div 
        className={`w-full max-w-[420px] bg-gray-900 rounded-2xl p-8 shadow-xl transition-all duration-700 ease-in-out transform flex flex-col ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="mb-8 text-center pt-2">
          <div className="mx-auto w-12 h-12 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center mb-5">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">Log in to your account</p>
        </div>
        
        <div className="flex w-full mb-6 bg-gray-800 rounded-lg p-1">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'user' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setActiveTab('user'); setError(''); }}
          >
            User Login
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'admin' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setActiveTab('admin'); setError(''); }}
          >
            Admin Login
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-center text-sm font-medium" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              id="email"
              type="email" 
              placeholder="Email"
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
            />
          </div>
          <div>
            <input 
              id="password"
              type="password" 
              placeholder="Password"
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
            />
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm font-medium text-gray-400 pb-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-pink-500 hover:text-pink-400 hover:underline transition-colors px-1 py-1 rounded-md">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
