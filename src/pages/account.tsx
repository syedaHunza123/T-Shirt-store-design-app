import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import Layout from '@/components/layout/Layout';

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=account');
    }
  }, [status, router]);
  
  // Set initial name from session
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);
  
  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdating(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setMessage({ text: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile', type: 'danger' });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'danger' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters long', type: 'danger' });
      return;
    }
    
    setIsUpdating(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      
      setMessage({ text: 'Password changed successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to change password', 
        type: 'danger' 
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <Layout title="Account Settings">
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout title="Account Settings">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Account</h5>
                <div className="nav flex-column nav-pills mt-3">
                  <a className="nav-link active" href="#profile" data-bs-toggle="pill">Profile</a>
                  <a className="nav-link" href="#security" data-bs-toggle="pill">Security</a>
                  <a className="nav-link" href="#orders" data-bs-toggle="pill">Orders</a>
                  <button 
                    className="nav-link text-danger" 
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-9">
            {message && (
              <div className={`alert alert-${message.type} alert-dismissible fade show mb-4`} role="alert">
                {message.text}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setMessage(null)}
                  aria-label="Close"
                ></button>
              </div>
            )}
            
            <div className="tab-content">
              <div className="tab-pane fade show active" id="profile">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Profile Information</h3>
                    
                    <form onSubmit={handleUpdateProfile}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          value={session?.user?.email || ''}
                          disabled
                        />
                        <small className="form-text text-muted">Email cannot be changed</small>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                          type="text"
                          id="name"
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isUpdating}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : 'Update Profile'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              
              <div className="tab-pane fade" id="security">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Change Password</h3>
                    
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          className="form-control"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          disabled={isUpdating}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={isUpdating}
                          required
                          minLength={6}
                        />
                        <small className="form-text text-muted">Must be at least 6 characters long</small>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isUpdating}
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Changing Password...' : 'Change Password'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              
              <div className="tab-pane fade" id="orders">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Order History</h3>
                    
                    <div className="text-center py-4">
                      <div className="mb-3">
                        <i className="bi bi-bag" style={{ fontSize: '3rem' }}></i>
                      </div>
                      <p className="text-muted">You haven't placed any orders yet.</p>
                      <a href="/designer" className="btn btn-primary">Start Shopping</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}