import { useRef, useEffect, useState } from 'react';
import { DesignState } from '@/pages/designer';

interface TShirtCanvasProps {
  design: DesignState;
  onUpdatePreviewUrl: (url: string) => void;
}

export default function TShirtCanvas({ design, onUpdatePreviewUrl }: TShirtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tshirtImageRef = useRef<HTMLImageElement | null>(null);
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 500 });

  // Load t-shirt template image
  useEffect(() => {
    const tshirtImg = new Image();
    tshirtImg.src = '/images/tshirt-template.png';
    tshirtImg.onload = () => {
      tshirtImageRef.current = tshirtImg;
      renderCanvas();
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth, 400);
        const height = width * 1.25; // Keep aspect ratio 4:5
        setCanvasSize({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update canvas when design changes
  useEffect(() => {
    if (design.image) {
      const img = new Image();
      img.src = design.image;
      img.onload = () => {
        uploadedImageRef.current = img;
        renderCanvas();
      };
    } else {
      uploadedImageRef.current = null;
      renderCanvas();
    }
  }, [design, canvasSize]);

  // Generate preview URL after rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canvasRef.current) {
        const url = canvasRef.current.toDataURL('image/png');
        onUpdatePreviewUrl(url);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [design, canvasSize]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw t-shirt with selected color
    if (tshirtImageRef.current) {
      ctx.drawImage(tshirtImageRef.current, 0, 0, canvas.width, canvas.height);
      
      // Apply t-shirt color
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = design.tshirtColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Calculate printable area (center of t-shirt)
    const printableArea = {
      x: canvas.width * 0.25,
      y: canvas.height * 0.25,
      width: canvas.width * 0.5,
      height: canvas.height * 0.4
    };

    // Draw uploaded image if exists
    if (uploadedImageRef.current) {
      const img = uploadedImageRef.current;
      const scale = design.imageScale || 1;
      const imgWidth = img.width * scale * (printableArea.width / 300);
      const imgHeight = img.height * scale * (printableArea.width / 300);
      
      const x = (design.imagePositionX ?? printableArea.x + printableArea.width/2) - imgWidth/2;
      const y = (design.imagePositionY ?? printableArea.y + printableArea.height/2) - imgHeight/2;
      
      ctx.drawImage(img, x, y, imgWidth, imgHeight);
    }

    // Draw text if exists
    if (design.text) {
      const x = design.textPositionX ?? printableArea.x + printableArea.width/2;
      const y = design.textPositionY ?? printableArea.y + printableArea.height/2;
      
      ctx.font = `${design.textFont} ${printableArea.width * 0.1}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = design.textColor;
      ctx.fillText(design.text, x, y);
    }
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // Check if clicked on text
    if (design.text) {
      const textX = design.textPositionX ?? canvas.width * 0.5;
      const textY = design.textPositionY ?? canvas.height * 0.45;
      const textWidth = canvasRef.current.getContext('2d')?.measureText(design.text).width || 0;
      
      if (
        x > textX - textWidth/2 - 10 &&
        x < textX + textWidth/2 + 10 &&
        y > textY - 30 &&
        y < textY + 10
      ) {
        setIsDraggingText(true);
        setDragStartPos({ x, y });
        return;
      }
    }
    
    // Check if clicked on image
    if (uploadedImageRef.current && design.imagePositionX && design.imagePositionY) {
      const scale = design.imageScale || 1;
      const imgWidth = uploadedImageRef.current.width * scale * (canvas.width * 0.5 / 300);
      const imgHeight = uploadedImageRef.current.height * scale * (canvas.width * 0.5 / 300);
      
      if (
        x > design.imagePositionX - imgWidth/2 &&
        x < design.imagePositionX + imgWidth/2 &&
        y > design.imagePositionY - imgHeight/2 &&
        y < design.imagePositionY + imgHeight/2
      ) {
        setIsDraggingImage(true);
        setDragStartPos({ x, y });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingText && !isDraggingImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const dx = x - dragStartPos.x;
    const dy = y - dragStartPos.y;
    
    if (isDraggingText && design.textPositionX !== undefined && design.textPositionY !== undefined) {
      design.textPositionX += dx;
      design.textPositionY += dy;
    } else if (isDraggingImage && design.imagePositionX !== undefined && design.imagePositionY !== undefined) {
      design.imagePositionX += dx;
      design.imagePositionY += dy;
    }
    
    setDragStartPos({ x, y });
    renderCanvas();
  };

  const handleMouseUp = () => {
    setIsDraggingText(false);
    setIsDraggingImage(false);
  };

  return (
    <div ref={containerRef} className="text-center mb-4">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="mx-auto d-block"
        style={{ maxWidth: '100%', cursor: isDraggingText || isDraggingImage ? 'grabbing' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="mt-2 text-muted small">
        <p>Click and drag to reposition text or image</p>
      </div>
    </div>
  );
}