import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

const UploadZone = ({ onFileSelect }: UploadZoneProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out cursor-pointer",
          "hover:border-primary/50 hover:bg-accent/50",
          isDragActive ? "border-primary bg-accent" : "border-muted",
          "animate-fade-in"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          {preview ? (
            <div className="relative w-full max-w-xs mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg shadow-lg animate-fade-up"
              />
              <Button
                variant="secondary"
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                }}
              >
                Choose Different Image
              </Button>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-full bg-accent">
                {isDragActive ? (
                  <ImageIcon className="w-8 h-8 text-primary animate-pulse" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop the image here" : "Drag & Drop image here"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to select
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadZone;