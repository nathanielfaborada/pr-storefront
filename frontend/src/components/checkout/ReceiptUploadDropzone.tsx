import React, { useRef } from 'react';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';

interface ReceiptUploadDropzoneProps {
  receiptUrl: string | null;
  onReceiptChange: (url: string | null) => void;
}

export const ReceiptUploadDropzone: React.FC<ReceiptUploadDropzoneProps> = ({
  receiptUrl,
  onReceiptChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onReceiptChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2 font-mono">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600">
        Upload Proof of Payment Screenshot *
      </label>

      {receiptUrl ? (
        <div className="relative p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={receiptUrl}
              alt="Receipt Preview"
              className="w-12 h-14 object-cover rounded-xl border border-emerald-200 bg-white"
            />
            <div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Screenshot Attached</span>
              </div>
              <p className="text-[11px] text-zinc-600">Ready for instant payment clearance.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onReceiptChange(null)}
            className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-zinc-300 hover:border-black bg-zinc-50 hover:bg-zinc-100 p-5 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />
          <div className="p-2.5 rounded-full bg-white text-zinc-400 group-hover:text-black transition-colors shadow-sm">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900">
              Click or drag &amp; drop GCash / Maya payment screenshot
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Supports PNG, JPG, JPEG, WEBP</p>
          </div>
        </div>
      )}
    </div>
  );
};
