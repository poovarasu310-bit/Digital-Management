"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      router.push('/login');
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
      <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-primary opacity-[0.03] rounded-bl-full blur-[40px]"></div>
      
      <div 
        className={`w-full bg-background rounded-[28px] shadow-airbnb p-6 sm:p-8 z-10 transition-all duration-700 ease-in-out transform flex flex-col ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="mb-8 text-center pt-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h2 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Create your account</h2>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-primary text-center text-sm font-medium" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <Input 
            id="name"
            label="Name" 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
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
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-[15px] font-medium text-muted pb-2">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary-hover hover:underline transition-colors px-1 rounded-md">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
