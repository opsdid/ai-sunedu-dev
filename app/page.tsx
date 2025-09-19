'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import InteractiveAvatar from "@/components/InteractiveAvatar";

// A component that reads the URL and displays the timeout message if needed.
function TimeoutMessage() {
  const searchParams = useSearchParams();
  const timeout = searchParams.get('timeout');

  if (timeout) {
    return (
      <div style={{ padding: '10px 15px', backgroundColor: '#fffbe6', color: '#856404', border: '1px solid #ffeeba', borderRadius: '8px', textAlign: 'center', marginBottom: '15px', width: '100%' }}>
        Your session has timed out after 10 minutes.
      </div>
    );
  }
  return null;
}

// The login form component
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
      if (result?.error) {
        setError('Invalid username or password.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Login to Interactive Avatar</h1>
      <div style={{width: '300px', marginTop: '20px'}}>
        {/* Suspense is a fallback while this component reads the URL */}
        <Suspense fallback={<div></div>}>
            <TimeoutMessage />
        </Suspense>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ padding: '8px', color: 'black', borderRadius: '4px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ padding: '8px', color: 'black', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '8px', cursor: 'pointer' }}>Login</button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>
      <p style={{ marginTop: '20px' }}>
        Don't have an account?{' '}
        <Link href="/register" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Register here
        </Link>
      </p>
    </div>
  );
}

// This component wraps the main avatar view and contains the timeout logic.
function AuthenticatedView() {
  useEffect(() => {
    const sessionDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Set a timer that will log the user out after the duration
    const timer = setTimeout(() => {
      signOut({ callbackUrl: '/?timeout=true' });
    }, sessionDuration);

    // This is a cleanup function. It runs if the user signs out or navigates away.
    return () => clearTimeout(timer);
  }, []); // The empty array means this effect runs only once when the page loads.

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-[900px] flex flex-col items-start justify-start gap-5 mx-auto pt-4 pb-20">
        <div className="w-full">
          <InteractiveAvatar />
        </div>
      </div>
    </div>
  );
}

// The main page component that decides which view to show.
export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!session) {
    return <LoginForm />;
  }

  return <AuthenticatedView />;
}