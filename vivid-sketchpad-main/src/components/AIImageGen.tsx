import { useState } from 'react';
import { Sparkles, Loader2, Download, Plus, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';

interface AIImageGenProps {
  isOpen: boolean;
  onClose: () => void;
  fabricCanvas: FabricCanvas | null;
}

export const AIImageGen = ({ isOpen, onClose, fabricCanvas }: AIImageGenProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Pehle kuch likho toh sahi!');
      return;
    }

    setIsGenerating(true);
    setGeneratedImageUrl(null);
    setVariations([]);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 100000);
      
      // Using CORS Proxy to ensure images load everywhere
      const proxy = "https://corsproxy.io/?";
      const baseUrl = "https://image.pollinations.ai/prompt/";
      
      const mainUrl = `${proxy}${encodeURIComponent(`${baseUrl}${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}`)}`;
      const v1 = `${proxy}${encodeURIComponent(`${baseUrl}${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed + 1}`)}`;
      const v2 = `${proxy}${encodeURIComponent(`${baseUrl}${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed + 2}`)}`;
      
      setGeneratedImageUrl(mainUrl);
      setVariations([v1, v2]);
      toast.success('AI ने छवि और variations बना दिए! ✨');
    } catch (error) {
      toast.error('AI Service down. Try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addToCanvas = async () => {
    if (!fabricCanvas || !generatedImageUrl) {
      toast.error('Pehle image generate toh hone do!');
      return;
    }

    try {
      toast.info('Adding to canvas...');
      // Use fabric's built-in helper with CORS attempt
      const img = await FabricImage.fromURL(generatedImageUrl, {
        crossOrigin: 'anonymous'
      });

      const scale = 300 / img.width!;
      img.set({
        scaleX: scale,
        scaleY: scale,
        shadow: { color: 'rgba(0,0,0,0.4)', blur: 15, offsetX: 8, offsetY: 8 } as any
      });

      fabricCanvas.add(img);
      fabricCanvas.centerObject(img);
      img.setCoords();
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();

      toast.success('AI Image added!');
      onClose();
    } catch (error) {
      console.warn('CORS failed, attempting simple add...');
      try {
        const imgFallback = await FabricImage.fromURL(generatedImageUrl);
        const scale = 300 / imgFallback.width!;
        imgFallback.set({ scaleX: scale, scaleY: scale });
        fabricCanvas.add(imgFallback);
        fabricCanvas.centerObject(imgFallback);
        fabricCanvas.renderAll();
        toast.success('Added (Standard Mode)');
        onClose();
      } catch (err) {
        toast.error('Image block ho rahi hai browser se.');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-2 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI Image Generator
          </DialogTitle>
          <DialogDescription>
            Write whatever you imagine, and our AI will turn it into art!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., A cute robot painting on a canvas..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
              className="flex-1 focus-visible:ring-purple-500"
              disabled={isGenerating}
            />
            <Button
              onClick={generateImage}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            </Button>
          </div>

          <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-purple-600 animate-pulse" />
                </div>
                <p className="text-sm font-medium text-gray-500">AI is thinking...</p>
              </div>
            ) : generatedImageUrl ? (
              <img
                src={generatedImageUrl}
                alt="AI Generated"
                className="w-full h-full object-contain animate-in fade-in zoom-in duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // If pollinations fails, use LoremFlickr as related fallback
                  target.src = `https://loremflickr.com/512/512/${encodeURIComponent(prompt)}`;
                  toast.error('AI load error. Showing related reference image.');
                }}
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-sm text-gray-500">Your generated masterpiece will appear here</p>
              </div>
            )}
          </div>

          {!isGenerating && variations.length > 0 && (
            <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-500">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">AI Variations (Related Images)</p>
              <div className="grid grid-cols-2 gap-2">
                {variations.map((vUrl, idx) => (
                  <div 
                    key={idx}
                    className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500 cursor-pointer transition-all shadow-sm bg-muted"
                    onClick={() => setGeneratedImageUrl(vUrl)}
                  >
                    <img src={vUrl} alt="Variation" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={addToCanvas}
              disabled={!generatedImageUrl || isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white gap-2"
            >
              <Plus className="w-4 h-4" /> Add to Canvas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
