import { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const predefinedColors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#008000', '#800000', '#808000', '#008080', '#000080',
    '#ff6347', '#4682b4', '#f08080', '#ffc0cb', '#dda0dd'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="d-flex align-items-center">
        <div 
          className="color-preview me-2" 
          style={{ 
            backgroundColor: value,
            width: '40px',
            height: '40px',
            borderRadius: '4px',
            border: '1px solid #ced4da',
            cursor: 'pointer',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)'
          }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      
      {isOpen && (
        <div className="color-picker-dropdown mt-2 p-2 border rounded bg-white shadow">
          <div className="d-flex flex-wrap">
            {predefinedColors.map(color => (
              <div 
                key={color}
                className="color-option m-1" 
                style={{ 
                  backgroundColor: color,
                  width: '30px',
                  height: '30px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: value === color ? '2px solid #000' : '1px solid #ced4da'
                }}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
          <div className="mt-2">
            <label className="form-label small">Custom Color</label>
            <input
              type="color"
              className="form-control form-control-color w-100"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}