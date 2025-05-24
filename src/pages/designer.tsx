import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import TShirtCanvas from '@/components/designer/TShirtCanvas';
import ColorPicker from '@/components/designer/ColorPicker';
import TextEditor from '@/components/designer/TextEditor';
import ImageUploader from '@/components/designer/ImageUploader';
import { Design } from '@/types';

export interface DesignState {
  name: string;
  tshirtColor: string;
  text: string;
  textColor: string;
  textFont: string;
  textPositionX?: number;
  textPositionY?: number;
  image: string | null;
  imagePositionX?: number;
  imagePositionY?: number;
  imageScale: number;
  previewUrl: string | null;
}

export default function DesignerPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { edit: designId } = router.query;
  
  // Initialize design state
  const [design, setDesign] = useState<DesignState>({
    name: 'My Custom T-Shirt',
    tshirtColor: '#ffffff',
    text: '',
    textColor: '#000000',
    textFont: 'Arial',
    image: null,
    imageScale: 1,
    previewUrl: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);
  
  // Fetch design if editing
  useEffect(() => {
    if (designId && typeof designId === 'string') {
      setIsLoading(true);
      fetch(`/api/designs/${designId}`)
        .then(res => {
          if (!res.ok) throw new Error('Design not found');
          return res.json();
        })
        .then((data: Design) => {
          setDesign({
            name: data.name,
            tshirtColor: data.tshirt_color,
            text: data.text_content || '',
            textColor: data.text_color || '#000000',
            textFont: data.text_font || 'Arial',
            textPositionX: data.text_position_x || undefined,
            textPositionY: data.text_position_y || undefined,
            image: data.image_url || null,
            imagePositionX: data.image_position_x || undefined,
            imagePositionY: data.image_position_y || undefined,
            imageScale: data.image_scale || 1,
            previewUrl: data.preview_url
          });
          setMessage({ text: 'Design loaded successfully', type: 'success' });
        })
        .catch(err => {
          console.error('Error loading design:', err);
          setMessage({ text: 'Error loading design', type: 'danger' });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [designId]);
  
  // Update design state helpers
  const updateDesign = (updates: Partial<DesignState>) => {
    setDesign(prev => ({ ...prev, ...updates }));
  };
  
  // Handle updating the preview URL
  const handleUpdatePreviewUrl = (url: string) => {
    updateDesign({ previewUrl: url });
  };
  
  // Handle image upload
  const handleImageUpload = (imageUrl: string) => {
    updateDesign({ 
      image: imageUrl, 
      imagePositionX: undefined, 
      imagePositionY: undefined
    });
  };
  
  // Handle image removal
  const handleRemoveImage = () => {
    updateDesign({ image: null });
  };
  
  // Handle saving design
  const handleSaveDesign = async () => {
    if (!session) {
      // Save to local storage and redirect to login
      localStorage.setItem('tempDesign', JSON.stringify(design));
      router.push('/login?redirect=designer');
      return;
    }
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch(`/api/designs${designId ? `/${designId}` : ''}`, {
        method: designId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: design.name,
          tshirt_color: design.tshirtColor,
          text_content: design.text,
          text_color: design.textColor,
          text_font: design.textFont,
          text_position_x: design.textPositionX,
          text_position_y: design.textPositionY,
          image_url: design.image,
          image_position_x: design.imagePositionX,
          image_position_y: design.imagePositionY,
          image_scale: design.imageScale,
          preview_url: design.previewUrl
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save design');
      }
      
      const savedDesign = await response.json();
      setMessage({ text: 'Design saved successfully!', type: 'success' });
      
      // If it's a new design, update URL to edit mode
      if (!designId) {
        router.replace(`/designer?edit=${savedDesign.id}`, undefined, { shallow: true });
      }
    } catch (error) {
      console.error('Error saving design:', error);
      setMessage({ text: 'Error saving design', type: 'danger' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle adding to cart
  const handleAddToCart = async () => {
    // First save the design if needed
    if (!designId) {
      await handleSaveDesign();
      return; // The save operation will update the URL, and then user can add to cart
    }
    
    // If we have a design ID, add to cart
    try {
      setIsSaving(true);
      
      // Check if user is logged in
      if (!session) {
        // Add to localStorage cart
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = cart.findIndex((item: any) => item.design_id === designId);
        
        if (existingItemIndex >= 0) {
          // Update quantity
          cart[existingItemIndex].quantity += 1;
        } else {
          // Add new item
          cart.push({
            id: Date.now(), // Temporary ID
            design_id: designId,
            quantity: 1,
            size: 'M',
            design: {
              id: designId,
              name: design.name,
              tshirt_color: design.tshirtColor,
              preview_url: design.previewUrl
            }
          });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Dispatch a custom event to notify other components (like Header)
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        setMessage({ text: 'Added to cart!', type: 'success' });
        setTimeout(() => {
          router.push('/cart');
        }, 1000);
        return;
      }
      
      // Add to server-side cart
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          design_id: designId,
          quantity: 1,
          size: 'M'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      
      setMessage({ text: 'Added to cart!', type: 'success' });
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage({ text: 'Error adding to cart', type: 'danger' });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Layout title="Design Your T-Shirt">
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">T-Shirt Designer</h2>
                
                {message && (
                  <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setMessage(null)}
                      aria-label="Close"
                    ></button>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading your design...</p>
                  </div>
                ) : (
                  <TShirtCanvas design={design} onUpdatePreviewUrl={handleUpdatePreviewUrl} />
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="card-title mb-3">Design Options</h3>
                
                <div className="mb-3">
                  <label htmlFor="design-name" className="form-label">Design Name</label>
                  <input
                    type="text"
                    id="design-name"
                    className="form-control"
                    value={design.name}
                    onChange={(e) => updateDesign({ name: e.target.value })}
                  />
                </div>
                
                <ColorPicker
                  label="T-Shirt Color"
                  value={design.tshirtColor}
                  onChange={(color) => updateDesign({ tshirtColor: color })}
                />
                
                <div className="accordion mb-3" id="designAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingText">
                      <button 
                        className="accordion-button" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#collapseText" 
                        aria-expanded="true" 
                        aria-controls="collapseText"
                      >
                        Text Options
                      </button>
                    </h2>
                    <div 
                      id="collapseText" 
                      className="accordion-collapse collapse show" 
                      aria-labelledby="headingText"
                    >
                      <div className="accordion-body">
                        <TextEditor
                          text={design.text}
                          textColor={design.textColor}
                          textFont={design.textFont}
                          onTextChange={(text) => updateDesign({ text })}
                          onTextColorChange={(textColor) => updateDesign({ textColor })}
                          onTextFontChange={(textFont) => updateDesign({ textFont })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingImage">
                      <button 
                        className="accordion-button collapsed" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#collapseImage" 
                        aria-expanded="false" 
                        aria-controls="collapseImage"
                      >
                        Image Options
                      </button>
                    </h2>
                    <div 
                      id="collapseImage" 
                      className="accordion-collapse collapse" 
                      aria-labelledby="headingImage"
                    >
                      <div className="accordion-body">
                        <ImageUploader onImageUpload={handleImageUpload} />
                        
                        {design.image && (
                          <>
                            <div className="mb-3">
                              <label className="form-label">Image Scale</label>
                              <input
                                type="range"
                                className="form-range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={design.imageScale}
                                onChange={(e) => updateDesign({ imageScale: parseFloat(e.target.value) })}
                              />
                              <div className="d-flex justify-content-between">
                                <small>Smaller</small>
                                <small>Larger</small>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleRemoveImage}
                              >
                                Remove Image
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveDesign}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : (designId ? 'Update Design' : 'Save Design')}
                  </button>
                  
                  <button
                    className="btn btn-success"
                    onClick={handleAddToCart}
                    disabled={isSaving || !designId}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card bg-light">
              <div className="card-body">
                <h5 className="card-title">Design Tips</h5>
                <ul className="small mb-0">
                  <li>Click and drag to position text and images on the t-shirt</li>
                  <li>Use transparent PNG images for best results</li>
                  <li>Consider the t-shirt color when choosing text colors</li>
                  <li>Save your design before adding to cart</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}