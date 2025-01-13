import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UploadZone from '@/components/UploadZone';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background transition-all duration-500">
      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Image Compressor
          </h2>
          <ThemeToggle />
        </div>
        
        <Card className="p-6 sm:p-8 backdrop-blur-sm bg-card/80 border border-accent/20 shadow-lg transition-all duration-500 hover:shadow-accent/5 hover:scale-[1.01]">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-up">
                Compress Your Images
              </h1>
              <p className="text-muted-foreground animate-fade-up delay-100 max-w-2xl mx-auto">
                Upload your image and we'll compress it while maintaining quality. Perfect for web optimization.
              </p>
            </div>

            <div className="animate-fade-up delay-200">
              <UploadZone onFileSelect={handleFileSelect} />
            </div>

            {isCompressing && (
              <div className="flex items-center justify-center space-x-3 animate-fade-up bg-primary/5 p-4 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <p className="text-primary font-medium">Compressing your image...</p>
              </div>
            )}

            {compressedImageUrl && (
              <div className="space-y-4 animate-fade-up">
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-primary/20"
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