
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ImageIcon, Plus, X, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ImageUpload = ({ images, onChange }: ImageUploadProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Handle file uploads
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          // Convert to base64 string
          const imageUrl = event.target.result.toString();
          onChange([...images, imageUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (tempImageUrl.trim()) {
      onChange([...images, tempImageUrl]);
      setTempImageUrl('');
      setShowDialog(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.length > 0 && images.map((image, index) => (
          <div 
            key={index} 
            className="relative group aspect-square rounded-md border overflow-hidden"
          >
            <img 
              src={image} 
              alt={`صورة المنتج ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => handleRemoveImage(index)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed p-4 hover:border-algerian-green transition-colors",
            images.length === 0 ? "col-span-full h-52" : ""
          )}
        >
          <ImageIcon className="h-8 w-8 mb-2 text-gray-500" />
          <span className="text-sm text-center text-gray-500 rtl">رفع صورة</span>
          <span className="text-xs text-center text-gray-400 mt-1 rtl">اضغط للاختيار</span>
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => setShowDialog(true)}
          className="rtl"
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة برابط
        </Button>
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle className="rtl">إضافة صورة برابط URL</DialogTitle>
          <DialogDescription className="rtl">
            أدخل رابط الصورة المباشر
          </DialogDescription>
          
          <div className="grid gap-4 py-4">
            <input
              type="url"
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)} variant="outline" className="rtl">
              إلغاء
            </Button>
            <Button onClick={handleAddImageUrl} className="rtl">
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUpload;
