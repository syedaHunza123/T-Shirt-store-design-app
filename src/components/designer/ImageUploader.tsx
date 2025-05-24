import { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, SVG)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    setError(null);
    setIsUploading(true);
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setIsUploading(false);
      if (event.target?.result) {
        onImageUpload(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      setError('Error reading file');
    };
    reader.readAsDataURL(file);
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="mb-3">
      <label className="form-label">Upload Image</label>
      <div className="d-grid">
        <button 
          type="button" 
          className="btn btn-outline-primary" 
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Choose Image'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="d-none"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      {error && <div className="text-danger mt-2 small">{error}</div>}
      <div className="form-text">
        Upload an image to place on your t-shirt. For best results, use transparent PNG files.
      </div>
    </div>
  );
}