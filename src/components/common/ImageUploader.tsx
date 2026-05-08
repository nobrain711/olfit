/**
 * @file ImageUploader.tsx
 * @description 이미지를 업로드하고 리사이징하여 Base64로 변환하는 컴포넌트입니다.
 */

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onImageProcessed: (base64: string) => void;
  isAnalyzing: boolean;
}

export default function ImageUploader({ onImageProcessed, isAnalyzing }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 이미지 리사이징 및 Base64 변환 로직
   */
  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // 가로 최대 800px로 제한하여 경량화
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // JPEG 포맷으로 압축하여 Base64 추출 (품질 0.7)
        const base64 = canvas.toDataURL("image/jpeg", 0.7);
        setPreview(base64);
        onImageProcessed(base64);
      };
    };
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative aspect-video flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 cursor-pointer rounded-sm ${
            isDragging ? "border-wood bg-cream/20" : "border-cream/20 bg-white/10 hover:bg-white/20"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center">
              <Upload className="text-cream/60 w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-cream mb-1">
                오늘의 스타일(OOTD) 사진을 업로드하세요
              </p>
              <p className="text-[11px] text-cream/40 uppercase tracking-wider">
                Drag & Drop or Click to browse
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-video bg-black/5 rounded-sm overflow-hidden group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          
          {/* 오버레이 컨트롤 (분석 중이 아닐 때만 삭제 버튼 노출) */}
          {!isAnalyzing && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={removeImage}
                className="p-3 bg-cream text-wood rounded-full hover:scale-110 shadow-lg transition-transform"
                title="이미지 제거"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* 분석 중 상태 표시 */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-wood/60 backdrop-blur-sm flex flex-col items-center justify-center text-cream">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-[13px] font-medium tracking-widest uppercase">Analyzing your style...</p>
              <p className="text-[11px] text-cream/60 mt-2">AI가 당신의 무드를 해석하고 있습니다</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 flex items-start gap-3 px-2">
        <ImageIcon size={14} className="text-cream/30 mt-0.5" />
        <p className="text-[11px] text-cream/40 leading-relaxed break-keep">
          정면 전신사진 혹은 의상의 질감과 색상이 잘 드러나는 사진일수록 더욱 정교한 분석이 가능합니다. <br />업로드된 이미지는 분석 즉시 경량화되어 안전하게 처리됩니다.
        </p>
      </div>
    </div>
  );
}
