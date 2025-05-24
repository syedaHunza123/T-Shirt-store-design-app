import { useState } from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onUpdateSize: (id: number, size: string) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ 
  item, 
  onUpdateQuantity, 
  onUpdateSize, 
  onRemove 
}: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSizeChange = async (newSize: string) => {
    setIsUpdating(true);
    try {
      await onUpdateSize(item.id, newSize);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      setIsUpdating(true);
      try {
        await onRemove(item.id);
      } finally {
        setIsUpdating(false);
      }
    }
  };
  
  // Calculate price based on quantity
  const basePrice = 19.99;
  const totalPrice = (basePrice * item.quantity).toFixed(2);
  
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-3">
          {item.design?.preview_url ? (
            <Image 
              src={item.design.preview_url} 
              alt={item.design.name || 'T-shirt design'} 
              className="img-fluid rounded-start"
              width={200}
              height={250}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div className="bg-light d-flex align-items-center justify-content-center h-100" style={{ minHeight: '200px' }}>
              <span className="text-muted">No preview available</span>
            </div>
          )}
        </div>
        <div className="col-md-9">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <h5 className="card-title">{item.design?.name || 'Custom T-Shirt'}</h5>
              <h5 className="text-primary">${totalPrice}</h5>
            </div>
            <p className="card-text text-muted">Custom designed t-shirt</p>
            
            <div className="row mt-3">
              <div className="col-sm-6 col-md-4 mb-2">
                <label className="form-label">Size</label>
                <select 
                  className="form-select" 
                  value={item.size} 
                  onChange={(e) => handleSizeChange(e.target.value)}
                  disabled={isUpdating}
                >
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">X-Large</option>
                  <option value="XXL">XX-Large</option>
                </select>
              </div>
              
              <div className="col-sm-6 col-md-4 mb-2">
                <label className="form-label">Quantity</label>
                <div className="input-group">
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    disabled={isUpdating}
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isUpdating}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <button 
                className="btn btn-sm btn-outline-danger me-2"
                onClick={handleRemove}
                disabled={isUpdating}
              >
                <i className="bi bi-trash"></i> Remove
              </button>
              <Link href={`/designer?edit=${item.design_id}`} className="btn btn-sm btn-outline-primary">
                <i className="bi bi-pencil"></i> Edit Design
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}