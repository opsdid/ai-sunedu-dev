'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!firstName || !lastName || !username || !password || !email) {
      setError('All fields are required.');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          password,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong during registration.');
        return;
      }

      setSuccess('User registered successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err) {
      console.error('Registration failed:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
      <h1>Register New User</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '500px', padding: '20px', backgroundColor: '#222', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
            style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none', width: '50%' }}
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
            style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none', width: '50%' }}
          />
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none' }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Register
        </button>
        {error && <p style={{ color: '#ff4d4d', textAlign: 'center', margin: 0 }}>{error}</p>}
        {success && <p style={{ color: '#4caf50', textAlign: 'center', margin: 0 }}>{success}</p>}
      </form>
      <p style={{ marginTop: '20px' }}>
        Already have an account?{' '}
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Login here
        </Link>
      </p>
    </div>
  );
}