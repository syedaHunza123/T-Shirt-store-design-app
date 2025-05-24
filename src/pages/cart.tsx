import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import CartItem from '@/components/cart/CartItem';
import { CartItem as CartItemType } from '@/types';
import Link from 'next/link';

export default function CartPage() {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (session) {
          // Fetch from API if user is logged in
          const response = await fetch('/api/cart');
          
          if (!response.ok) {
            throw new Error('Failed to fetch cart items');
          }
          
          const items = await response.json();
          setCartItems(items);
        } else {
          // Get from localStorage if user is not logged in
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartItems(localCart);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCartItems();
  }, [session]);
  
  // Update cart item quantity
  const handleUpdateQuantity = async (id: number, quantity: number) => {
    try {
      if (session) {
        // Update in database
        const response = await fetch(`/api/cart/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update cart item');
        }
        
        // Update local state
        setCartItems(items =>
          items.map(item => (item.id === id ? { ...item, quantity } : item))
        );
      } else {
        // Update in localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.map((item: any) => 
          item.id === id ? { ...item, quantity } : item
        );
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity. Please try again.');
    }
  };
  
  // Update cart item size
  const handleUpdateSize = async (id: number, size: string) => {
    try {
      if (session) {
        // Update in database
        const response = await fetch(`/api/cart/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ size }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update cart item');
        }
        
        // Update local state
        setCartItems(items =>
          items.map(item => (item.id === id ? { ...item, size } : item))
        );
      } else {
        // Update in localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.map((item: any) => 
          item.id === id ? { ...item, size } : item
        );
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
      }
    } catch (err) {
      console.error('Error updating size:', err);
      alert('Failed to update size. Please try again.');
    }
  };
  
  // Remove cart item
  const handleRemoveItem = async (id: number) => {
    try {
      if (session) {
        // Delete from database
        const response = await fetch(`/api/cart/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove cart item');
        }
      } else {
        // Remove from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter((item: any) => item.id !== id);
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
      
      // Update local state
      setCartItems(items => items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item. Please try again.');
    }
  };
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * 19.99, 0);
  const shipping = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + shipping;
  
  return (
    <Layout title="Shopping Cart">
      <div className="container py-5">
        <h1 className="mb-4">Your Shopping Cart</h1>
        
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your cart...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-cart-x" style={{ fontSize: '4rem' }}></i>
            </div>
            <h3>Your cart is empty</h3>
            <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/designer" className="btn btn-primary">
              Start Designing
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onUpdateSize={handleUpdateSize}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
            
            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">Order Summary</h5>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-4 fw-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="d-grid">
                    <button className="btn btn-primary" disabled={cartItems.length === 0}>
                      Proceed to Checkout
                    </button>
                    
                    <Link href="/designer" className="btn btn-outline-secondary mt-2">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
              
              {!session && (
                <div className="card mt-3">
                  <div className="card-body">
                    <p className="mb-2"><i className="bi bi-info-circle me-2"></i> You're not logged in</p>
                    <p className="small text-muted mb-3">
                      Sign in to save your cart and access your designs later.
                    </p>
                    <Link href="/login" className="btn btn-outline-primary btn-sm">
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}