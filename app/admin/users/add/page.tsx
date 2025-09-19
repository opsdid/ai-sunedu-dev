'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddUserPage() {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleid, setRoleid] = useState('2'); // Default to 'user' role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Note: This API route should be secured to only allow admins
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          firstname, 
          lastname, 
          email, 
          password, 
          roleid: parseInt(roleid) 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to create user.');
        return;
      }

      setSuccess('User created successfully! Redirecting to user list...');
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);

    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Add New User</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: '#2d3748', borderRadius: '8px' }}>
          
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none' }} />
          
          <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="First Name" required style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none' }} />
          
          <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Last Name" required style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none' }} />
          
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none' }} />
          
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none' }} />
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Assign Role</label>
            <select id="role" value={roleid} onChange={(e) => setRoleid(e.target.value)} required style={{ padding: '10px', color: 'black', borderRadius: '4px', border: 'none', width: '100%' }}>
              <option value="2">User</option>
              <option value="1">Admin</option>
            </select>
          </div>
          
          <button type="submit" style={{ padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Create User
          </button>

          {error && <p style={{ color: '#ef4444', textAlign: 'center', margin: 0 }}>{error}</p>}
          {success && <p style={{ color: '#22c55e', textAlign: 'center', margin: 0 }}>{success}</p>}
        </form>
         <p style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link href="/admin/users" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
            &larr; Back to User List
          </Link>
        </p>
      </div>
    </div>
  );
}