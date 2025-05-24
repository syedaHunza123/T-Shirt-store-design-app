import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    // Get cart count from localStorage
    const updateCartCount = () => {
      if (typeof window !== 'undefined') {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
      }
    };
    
    updateCartCount();
    
    // Listen for storage events to update cart count
    window.addEventListener('storage', updateCartCount);
    
    // Create a custom event for updating cart
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link href="/" className="navbar-brand">
          TeeDesign
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/" className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/designer" className={`nav-link ${router.pathname === '/designer' ? 'active' : ''}`}>
                Design Your Tee
              </Link>
            </li>
            {session && (
              <li className="nav-item">
                <Link href="/my-designs" className={`nav-link ${router.pathname === '/my-designs' ? 'active' : ''}`}>
                  My Designs
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/cart" className="nav-link position-relative">
                <i className="bi bi-cart"></i> Cart
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            {session ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {session.user?.name || session.user?.email}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <Link href="/my-designs" className="dropdown-item">
                        My Designs
                      </Link>
                    </li>
                    <li>
                      <Link href="/account" className="dropdown-item">
                        Account
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/signup" className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}