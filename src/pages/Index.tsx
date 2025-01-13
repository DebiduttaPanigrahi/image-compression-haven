import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UploadZone from '@/components/UploadZone';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsCompressing(true);
    setCompressedImageUrl(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // This is a demo API endpoint - replace with your actual endpoint
      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Compression failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCompressedImageUrl(url);
      
      toast({
        title: "Success!",
        description: "Image compressed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to compress image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 sm:p-8 backdrop-blur-sm bg-card/50">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight animate-fade-up">
                Image Compressor
              </h1>
              <p className="text-muted-foreground animate-fade-up">
                Upload your image and we'll compress it while maintaining quality
              </p>
            </div>

            <UploadZone onFileSelect={handleFileSelect} />

            {isCompressing && (
              <div className="flex items-center justify-center space-x-2 animate-fade-up">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p>Compressing your image...</p>
              </div>
            )}

            {compressedImageUrl && (
              <div className="space-y-4 animate-fade-up">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = compressedImageUrl;
                    link.download = 'compressed-image';
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Compressed Image
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;