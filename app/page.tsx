/*"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";
export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-[900px] flex flex-col items-start justify-start gap-5 mx-auto pt-4 pb-20">
        <div className="w-full">
          <InteractiveAvatar />
        </div>
      </div>
    </div>
  );
}*/

'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import InteractiveAvatar from "@/components/InteractiveAvatar";

// A simple login form component
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const result = await signIn('credentials', {
        redirect: false, // Important: prevent automatic redirection
        username: username,
        password: password,
      });

      if (result?.error) {
        // If signIn returns an error, display it
        setError('Invalid username or password.');
        console.error('Sign-in error:', result.error);
      } 
      // If sign-in is successful, the parent component's useSession hook
      // will detect the new session and re-render to show the protected content.

    } catch (error) {
      console.error('Login submission error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Login to Interactive Avatar</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username (try 'admin' or 'user')"
          required
          style={{ padding: '8px', color: 'black' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (try 'password123' or 'password')"
          required
          style={{ padding: '8px', color: 'black' }}
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}


// The main page component
export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // If the user is NOT authenticated, show our custom login form
  if (!session) {
    return <LoginForm />;
  }

  // If the user IS authenticated, show the Heygen Avatar and a sign-out button
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
