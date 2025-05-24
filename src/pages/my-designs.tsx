import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { Design } from '@/types';

export default function MyDesignsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=my-designs');
    }
  }, [status, router]);
  
  // Fetch designs
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDesigns();
    }
  }, [status]);
  
  const fetchDesigns = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/designs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch designs');
      }
      
      const data = await response.json();
      setDesigns(data);
    } catch (err) {
      console.error('Error fetching designs:', err);
      setError('Failed to load designs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete design
  const handleDeleteDesign = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return;
    
    try {
      const response = await fetch(`/api/designs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete design');
      }
      
      // Update designs list
      setDesigns(designs.filter(design => design.id !== id));
    } catch (err) {
      console.error('Error deleting design:', err);
      alert('Failed to delete design. Please try again.');
    }
  };
  
  if (status === 'loading') {
    return (
      <Layout title="My Designs">
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
    <Layout title="My Designs">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>My Designs</h1>
          <Link href="/designer" className="btn btn-primary">
            Create New Design
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your designs...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : designs.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-brush" style={{ fontSize: '4rem' }}></i>
            </div>
            <h3>No designs yet</h3>
            <p className="text-muted mb-4">You haven't created any designs yet. Start creating your first design!</p>
            <Link href="/designer" className="btn btn-primary">
              Create First Design
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {designs.map(design => (
              <div key={design.id} className="col">
                <div className="card h-100 shadow-sm">
                  {design.preview_url ? (
                    <div className="bg-light p-3 text-center" style={{ height: '280px' }}>
                      <Image
                        src={design.preview_url}
                        alt={design.name}
                        width={200}
                        height={250}
                        className="img-fluid"
                        style={{ maxHeight: '250px', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '280px' }}>
                      <span className="text-muted">No preview available</span>
                    </div>
                  )}
                  
                  <div className="card-body">
                    <h5 className="card-title">{design.name}</h5>
                    <p className="card-text text-muted small">
                      Created on {new Date(design.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-flex justify-content-between">
                      <Link 
                        href={`/designer?edit=${design.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-pencil me-1"></i> Edit
                      </Link>
                      
                      <div>
                        <button
                          className="btn btn-sm btn-outline-danger me-2"
                          onClick={() => handleDeleteDesign(design.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        
                        <Link
                          href={`/api/designs/${design.id}/add-to-cart`}
                          className="btn btn-sm btn-outline-success"
                        >
                          <i className="bi bi-cart-plus"></i> Add to Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}