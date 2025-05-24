import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h1 className="display-4 fw-bold">Design Your Perfect T-Shirt</h1>
              <p className="lead mb-4">
                Create custom t-shirts that are uniquely yours. Add images, text, and choose
                colors to make a statement that's all your own.
              </p>
              <Link href="/designer" className="btn btn-light btn-lg px-4 me-2">
                Start Designing
              </Link>
              <Link href="/login" className="btn btn-outline-light btn-lg px-4">
                Sign In
              </Link>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="/images/hero-tshirt.png"
                alt="Custom T-Shirt Design"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-pencil-fill fs-1"></i>
                  </div>
                  <h4>1. Design</h4>
                  <p className="text-muted">
                    Use our easy-to-use design tool to create your custom t-shirt. Add images, text, and choose colors.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-cart-fill fs-1"></i>
                  </div>
                  <h4>2. Order</h4>
                  <p className="text-muted">
                    Add your creation to cart, select sizes and quantities, and complete your purchase securely.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-box-seam-fill fs-1"></i>
                  </div>
                  <h4>3. Receive</h4>
                  <p className="text-muted">
                    We'll print and ship your custom t-shirts directly to your door within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designs */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Featured Designs</h2>
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <img
                    src={`/images/design-${i}.jpg`}
                    className="card-img-top"
                    alt={`Design example ${i}`}
                    style={{ height: '240px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">Featured Design {i}</h5>
                    <p className="card-text text-muted">Create something similar or use as inspiration.</p>
                    <Link href="/designer" className="btn btn-outline-primary">
                      Customize
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="mb-4">Ready to create your custom t-shirt?</h2>
          <p className="lead mb-4">
            Express yourself with a unique design that stands out from the crowd.
          </p>
          <Link href="/designer" className="btn btn-light btn-lg px-4">
            Start Designing Now
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">What Our Customers Say</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="mb-3 text-warning">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <p className="card-text mb-3">
                    "I made custom t-shirts for our family reunion and everyone loved them! The design tool was easy to use and the quality was excellent."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">JD</span>
                    </div>
                    <div>
                      <h6 className="mb-0">John D.</h6>
                      <small className="text-muted">Verified Customer</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="mb-3 text-warning">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <p className="card-text mb-3">
                    "I needed custom shirts for my small business and TeeDesign delivered. The quality is great and they arrived faster than expected."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">SL</span>
                    </div>
                    <div>
                      <h6 className="mb-0">Sarah L.</h6>
                      <small className="text-muted">Verified Customer</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="mb-3 text-warning">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-half"></i>
                  </div>
                  <p className="card-text mb-3">
                    "Made custom t-shirts for my daughter's birthday party. The kids loved them and the parents asked where they could get their own!"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">MJ</span>
                    </div>
                    <div>
                      <h6 className="mb-0">Michael J.</h6>
                      <small className="text-muted">Verified Customer</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}