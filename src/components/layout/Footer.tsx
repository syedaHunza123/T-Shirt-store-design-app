export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>TeeDesign</h5>
            <p className="text-muted">Create your perfect custom t-shirt with our easy-to-use design tool.</p>
          </div>
          <div className="col-md-2 mb-3 mb-md-0">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-muted">Home</a></li>
              <li><a href="/designer" className="text-decoration-none text-muted">Designer</a></li>
              <li><a href="/cart" className="text-decoration-none text-muted">Cart</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3 mb-md-0">
            <h5>Help</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-muted">FAQ</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Shipping</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Returns</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li className="text-muted"><i className="bi bi-envelope me-2"></i>support@teedesign.com</li>
              <li className="text-muted"><i className="bi bi-telephone me-2"></i>(123) 456-7890</li>
            </ul>
            <div className="d-flex mt-2">
              <a href="#" className="text-muted me-3"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" className="text-muted me-3"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#" className="text-muted me-3"><i className="bi bi-twitter fs-5"></i></a>
            </div>
          </div>
        </div>
        <hr className="my-3 bg-secondary" />
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="small text-muted mb-0">&copy; {new Date().getFullYear()} TeeDesign. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="small text-muted mb-0">
              <a href="#" className="text-decoration-none text-muted">Privacy Policy</a> | 
              <a href="#" className="text-decoration-none text-muted"> Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}