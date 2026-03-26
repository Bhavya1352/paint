import { useState } from 'react';
import { Image as ImageIcon, Search, Plus, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';

interface ClipArtGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  fabricCanvas: FabricCanvas | null;
}

const CATEGORIES = [
  { id: 'characters', name: 'Characters', query: 'https://api.dicebear.com/9.x/bottts/svg?seed=' },
  { id: 'nature', name: 'Nature', query: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop' },
  { id: 'space', name: 'Space', query: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=300&fit=crop' },
  { id: 'animals', name: 'Animals', query: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&h=300&fit=crop' },
  { id: 'tech', name: 'Tech', query: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=300&fit=crop' },
];

export const ClipArtGallery = ({ isOpen, onClose, fabricCanvas }: ClipArtGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddImage = async (url: string) => {
    if (!fabricCanvas) return;

    try {
      toast.info('Adding clip-art...');
      const img = await FabricImage.fromURL(url, {
        crossOrigin: 'anonymous'
      });
      
      // Scale to a standard visible size
      const scale = 250 / img.width!;
      img.set({
        scaleX: scale,
        scaleY: scale,
        shadow: { color: 'rgba(0,0,0,0.3)', blur: 12, offsetX: 6, offsetY: 6 } as any
      });
      
      fabricCanvas.add(img);
      fabricCanvas.centerObject(img);
      img.setCoords();
      
      fabricCanvas.bringToFront(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.requestRenderAll();
      
      toast.success('Clip-art added! ✨');
      onClose();
    } catch (error) {
       console.warn('CORS failed for clip-art, using safe mode...');
       try {
         const imgFallback = await FabricImage.fromURL(url);
         const scale = 250 / imgFallback.width!;
         imgFallback.set({ scaleX: scale, scaleY: scale });
         
         fabricCanvas.add(imgFallback);
         fabricCanvas.centerObject(imgFallback);
         imgFallback.setCoords();
         
         fabricCanvas.bringToFront(imgFallback);
         fabricCanvas.setActiveObject(imgFallback);
         fabricCanvas.requestRenderAll();
         
         toast.success('Added (Safe Mode)');
         onClose();
       } catch (err) {
         toast.error('Could not load image.');
       }
    }
  };

  const getGalleryItems = () => {
    if (activeCategory === 'characters') {
      return ['Leo', 'Luna', 'Max', 'Zoe', 'Bolt', 'Spark', 'Rex', 'Nala'].map(seed => ({
        id: `char-${seed}`,
        url: `${CATEGORIES[0].query}${seed}`,
        title: seed
      }));
    }
    
    // For Unsplash items, we just return a few variations or search based
    const baseItem = CATEGORIES.find(c => c.id === activeCategory);
    if (!baseItem) return [];
    
    // Using a list of IDs to simulate a real gallery
    const unsplashIds = [
      '1441974231531-c6227db76b6e', '1451187580459-43490279c0fa', '1474511320723-9a56873867b5',
      '1485827404703-89b55fcc595e', '1504333638930-c8787f578ec4', '1518770660439-4636190af475'
    ];
    
    return unsplashIds.slice(0, 6).map((id, index) => ({
      id: `img-${index}`,
      url: `https://images.unsplash.com/photo-${id}?w=300&h=300&fit=crop`,
      title: `${activeCategory} ${index + 1}`
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-gray-900 overflow-hidden flex flex-col h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <ImageIcon className="w-6 h-6" />
            Vivid Clip-Art Library
          </DialogTitle>
          <DialogDescription>
            Choose from high-quality images and characters to add to your masterpiece.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 overflow-x-auto py-2 shrink-0 no-scrollbar">
          {CATEGORIES.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="whitespace-nowrap rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto mt-4 pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {getGalleryItems().map(item => (
              <div 
                key={item.id}
                className="group relative aspect-square bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                onClick={() => handleAddImage(item.url)}
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Stable fallback for broken gallery items
                    target.src = `https://api.dicebear.com/9.x/shapes/svg?seed=${item.id}`;
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="bg-white text-blue-600 p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-[10px] text-white font-medium uppercase tracking-wider">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t flex justify-end gap-2 shrink-0">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <p className="text-[10px] text-gray-400 self-center">Powered by Unsplash & Dicebear</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
