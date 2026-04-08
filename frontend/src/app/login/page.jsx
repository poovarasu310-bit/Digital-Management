"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    
    // Check if redirected after confirmation
    // Supabase standard redirects leave fragments or codes
    if (window.location.hash.includes('access_token') || searchParams.has('code')) {
      setSuccess("Email successfully verified! You can now log in.");
    }
  }, [searchParams]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsUnconfirmed(false);
    setLoading(true);
    
    // Developer Bypass for admin account (Dev Only)
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === 'admin123@gmail.com') {
      const mockUser = { 
        id: 'dev-admin-id-123', 
        email: normalizedEmail, 
        user_metadata: { role: 'admin', full_name: 'Admin User' } 
      };
      const mockToken = 'dev-admin-token-12345';
      redirectByRole('admin', mockUser, mockToken);
      setLoading(false);
      return;
    }
    
    try {
      // 1. Sign in using Supabase Auth
      const { data: { user, session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        if (authError.message === "Email not confirmed") {
          setIsUnconfirmed(true);
          throw new Error("Please verify your email before logging in.");
        }
        throw new Error('Invalid login credentials');
      }

      if (user) {
        // 2. Fetch user role from the 'users' table using user.id
        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (roleError || !userData) {
          // Profile fallback: create missing profile on-the-fly
          const metaRole = user.user_metadata?.role || 'user';
          await supabase.from('users').upsert({ id: user.id, email: user.email, role: metaRole });
          redirectByRole(metaRole, user, session?.access_token);
        } else {
          // 3. Authenticated: redirection logic
          redirectByRole(userData.role, user, session?.access_token);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setResendLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: 'http://localhost:3000/login'
        }
      });
      
      if (error) throw error;
      setError("Success! Confirmation email resent. Please check your inbox and spam folder.");
      setIsUnconfirmed(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const redirectByRole = (role, user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ ...user, role }));
    
    if (role === 'admin') {
      router.push('/admin-dashboard');
    } else {
      router.push('/dashboard');
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
        
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-500 text-center text-sm font-medium" role="alert">
            {success}
          </div>
        )}
        
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
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
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
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
            />
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-lg font-bold text-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
            
            {isUnconfirmed && (
              <button 
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-lg font-medium text-sm border border-gray-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {resendLoading ? 'Resending...' : 'Resend Confirmation Email'}
              </button>
            )}
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

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white font-medium">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
