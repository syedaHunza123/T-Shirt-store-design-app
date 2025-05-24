interface TextEditorProps {
  text: string;
  textColor: string;
  textFont: string;
  onTextChange: (text: string) => void;
  onTextColorChange: (color: string) => void;
  onTextFontChange: (font: string) => void;
}

export default function TextEditor({
  text,
  textColor,
  textFont,
  onTextChange,
  onTextColorChange,
  onTextFontChange
}: TextEditorProps) {
  const fontOptions = [
    'Arial',
    'Verdana',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Palatino',
    'Garamond',
    'Comic Sans MS',
    'Impact',
    'Arial Black',
    'Trebuchet MS'
  ];
  
  return (
    <div className="mb-4">
      <h5>Add Text</h5>
      
      <div className="mb-3">
        <label htmlFor="text-input" className="form-label">Text</label>
        <input
          type="text"
          id="text-input"
          className="form-control"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter your text"
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="text-color" className="form-label">Text Color</label>
        <div className="d-flex">
          <input
            type="color"
            id="text-color"
            className="form-control form-control-color me-2"
            value={textColor}
            onChange={(e) => onTextColorChange(e.target.value)}
            title="Choose text color"
          />
          <input
            type="text"
            className="form-control"
            value={textColor}
            onChange={(e) => onTextColorChange(e.target.value)}
            placeholder="#000000"
          />
        </div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="text-font" className="form-label">Font</label>
        <select
          id="text-font"
          className="form-select"
          value={textFont}
          onChange={(e) => onTextFontChange(e.target.value)}
        >
          {fontOptions.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}