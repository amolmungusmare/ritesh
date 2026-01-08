import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ImageUploader({ 
  onImageUpload, 
  label = "Upload Image",
  captureLabel = "Capture Photo",
  uploading = false,
  imageUrl = null,
  onClear = null
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onImageUpload(file_url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (imageUrl) {
    return (
      <Card className="relative overflow-hidden rounded-xl">
        <img src={imageUrl} alt="Uploaded" className="w-full h-48 object-cover" />
        {onClear && (
          <Button 
            size="icon" 
            variant="destructive" 
            className="absolute top-2 right-2 rounded-full"
            onClick={onClear}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {(isUploading || uploading) ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 text-[#C01589] animate-spin" />
          <p className="text-gray-600">Uploading...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#C01589]/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-[#C01589]" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline"
              onClick={() => cameraInputRef.current?.click()}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              {captureLabel}
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 bg-[#C01589] hover:bg-[#A01270]"
            >
              <Upload className="w-4 h-4" />
              {label}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}