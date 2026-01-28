import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ZoomControlsProps {
  fabricCanvas: any;
  onZoomChange?: (zoom: number) => void;
}

export const ZoomControls = ({ fabricCanvas, onZoomChange }: ZoomControlsProps) => {
  const handleZoomIn = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    if (zoom < 3) {
      const newZoom = zoom * 1.2;
      fabricCanvas.setZoom(newZoom);
      onZoomChange?.(Math.round(newZoom * 100));
      toast.info(`Zoom: ${Math.round(newZoom * 100)}%`);
    }
  };

  const handleZoomOut = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    if (zoom > 0.3) {
      const newZoom = zoom * 0.8;
      fabricCanvas.setZoom(newZoom);
      onZoomChange?.(Math.round(newZoom * 100));
      toast.info(`Zoom: ${Math.round(newZoom * 100)}%`);
    }
  };

  const handleResetZoom = () => {
    if (!fabricCanvas) return;
    fabricCanvas.setZoom(1);
    fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    onZoomChange?.(100);
    toast.info('Zoom reset to 100%');
  };

  return (
    <div className="fixed bottom-16 sm:bottom-20 right-2 sm:right-4 flex flex-col gap-1 sm:gap-2 z-40">
      <Button
        size="icon"
        onClick={handleZoomIn}
        className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
        title="Zoom In (+)"
      >
        <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
      </Button>
      <Button
        size="icon"
        onClick={handleZoomOut}
        className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
        title="Zoom Out (-)"
      >
        <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
      </Button>
      <Button
        size="icon"
        onClick={handleResetZoom}
        className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
        title="Reset Zoom (100%)"
      >
        <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
      </Button>
    </div>
  );
};