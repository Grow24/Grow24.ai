import React, { useRef, useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { Image, Upload } from 'lucide-react';

export const ImageNode: React.FC<NodeProps> = ({ data, selected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const style = data.style || {
    borderColor: '#e2e8f0',
    borderWidth: 2,
    borderRadius: 8
  };

  const handleFileSelect = (file: File) => {
    if (file && (file.type.startsWith('image/') || file.type === 'image/svg+xml')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        if (data.onChange) {
          data.onChange({ 
            imageData: dataURL, 
            fileName: file.name,
            fileType: file.type 
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg overflow-hidden ${
        selected ? 'ring-2 ring-blue-500' : ''
      } ${dragOver ? 'border-blue-400 bg-blue-50' : ''}`}
      style={{
        borderColor: style.borderColor,
        borderWidth: style.borderWidth,
        borderRadius: style.borderRadius,
        width: data.width || 200,
        height: data.height || 150,
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {data.imageData ? (
        <img
          src={data.imageData}
          alt={data.fileName || 'Uploaded image'}
          className="w-full h-full object-contain"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 cursor-pointer hover:text-gray-700">
          <div className="flex flex-col items-center gap-2">
            {dragOver ? (
              <Upload className="w-8 h-8" />
            ) : (
              <Image className="w-8 h-8" />
            )}
            <div className="text-sm text-center px-2">
              {dragOver ? 'Drop image here' : 'Click or drag image'}
            </div>
            <div className="text-xs opacity-75">PNG, JPG, SVG</div>
          </div>
        </div>
      )}
    </div>
  );
};