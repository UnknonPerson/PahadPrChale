import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  current?: string;
  onUpload: (file: File) => Promise<void> | void;
  uploading?: boolean;
  uploadProgress?: number;
  shape?: 'circle' | 'rect';
  label?: string;
  className?: string;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

async function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) return resolve(file);
        const compressed = new File([blob], file.name, { type: 'image/webp' });
        resolve(compressed.size < file.size ? compressed : file);
      }, 'image/webp', quality);
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

export default function ImageUpload({
  current,
  onUpload,
  uploading = false,
  uploadProgress = 0,
  shape = 'rect',
  label = 'Upload Image',
  className = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPG, PNG, or WebP images are allowed');
        return;
      }
      if (file.size > MAX_SIZE) {
        setError('Image must be smaller than 5 MB');
        return;
      }
      const processed = file.size > 500 * 1024 ? await compressImage(file) : file;
      const url = URL.createObjectURL(processed);
      setPreview(url);
      await onUpload(processed);
    },
    [onUpload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const displaySrc = preview || current;
  const isCircle = shape === 'circle';

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden transition-all duration-200
          ${isCircle ? 'w-24 h-24 rounded-full' : 'w-full aspect-video rounded-xl max-w-xs'}
          ${isDragging ? 'ring-2 ring-primary-500 scale-[1.02]' : ''}
          ${!displaySrc ? 'border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800' : ''}
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        {displaySrc ? (
          <img
            src={displaySrc}
            alt="Preview"
            className={`w-full h-full object-cover ${isCircle ? 'rounded-full' : 'rounded-xl'}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            {!isCircle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isDragging ? 'Drop here' : 'Click or drag & drop'}
              </p>
            )}
          </div>
        )}

        {/* Hover overlay */}
        {!uploading && (
          <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
            ${isCircle ? 'rounded-full' : 'rounded-xl'}`}>
            <Upload className="w-6 h-6 text-white mb-1" />
            <span className="text-white text-xs font-medium">Change</span>
          </div>
        )}

        {/* Upload progress */}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl">
            <Loader className="w-6 h-6 text-white animate-spin mb-2" />
            {uploadProgress > 0 && (
              <div className="w-3/4 bg-gray-600 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
          <X className="w-3 h-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {!isCircle && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          JPG, PNG, WebP · Max 5 MB · Auto-compressed
        </p>
      )}
    </div>
  );
}
