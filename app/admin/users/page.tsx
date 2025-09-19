'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  rolename: string;
}

export default function ViewUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (status === 'unauthenticated') {
      router.push('/');
    }
    
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
       router.push('/'); // Or a dedicated 'unauthorized' page
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetch('/api/users')
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to fetch users');
          }
          return res.json();
        })
        .then((data) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading...</div>;
  }
  
  if (session?.user?.role !== 'admin') {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Access Denied.</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2em' }}>User Management</h1>
        <Link href="/" style={{ color: '#0070f3' }}>Back to Home</Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #444' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Username</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Full Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '10px' }}>{user.id}</td>
              <td style={{ padding: '10px' }}>{user.username}</td>
              <td style={{ padding: '10px' }}>{`${user.firstname} ${user.lastname}`}</td>
              <td style={{ padding: '10px' }}>{user.email}</td>
              <td style={{ padding: '10px' }}>{user.rolename}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}