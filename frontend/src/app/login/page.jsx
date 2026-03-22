"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
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
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4 relative">
      <div className="absolute top-0 left-0 w-full h-[250px] bg-primary opacity-5 rounded-b-[40px] blur-[20px]"></div>
      
      <div 
        className={`w-full bg-background rounded-[28px] shadow-airbnb p-6 sm:p-8 z-10 transition-all duration-700 ease-in-out transform flex flex-col ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="mb-8 text-center pt-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <h2 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Welcome Back</h2>
          <p className="mt-2 text-[15px] font-medium text-muted">Log in to your account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-primary text-center text-sm font-medium" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            id="email"
            label="Email" 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            id="password"
            label="Password" 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <div className="pt-4">
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Authenticating...' : 'Login'}
            </Button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-[15px] font-medium text-muted pb-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary-hover hover:underline transition-colors px-1 rounded-md">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
