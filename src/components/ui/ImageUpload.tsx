import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Format invalide',
        description: 'Veuillez sélectionner une image (JPG, PNG, WEBP).',
        variant: 'destructive',
      });
      return;
    }

    // Limit file size to 25MB for high quality images
    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: 'Fichier trop lourd',
        description: "L'image ne doit pas dépasser 25 Mo.",
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('vehicle_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle_photos')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer l'image.",
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <span className="text-sm font-medium">{label}</span>}
      
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[12rem] rounded-xl border-2 border-dashed transition-colors overflow-hidden cursor-pointer bg-muted/20",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          value ? "border-transparent" : "",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !value && !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
            <span className="text-sm font-medium">Envoi en cours...</span>
          </div>
        ) : value ? (
          <div className="relative w-full h-full group">
            <img 
              src={value} 
              alt="Uploaded preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                variant="destructive" 
                size="icon" 
                className="rounded-full shadow-lg"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
            <div className="p-2 rounded-full bg-background border shadow-sm mb-2">
              <UploadCloud className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Cliquez ou glissez une image haute qualité</span>
            <span className="text-xs mt-1 opacity-70">JPG, PNG, WEBP (max 25Mo)</span>
          </div>
        )}
      </div>
    </div>
  );
}
