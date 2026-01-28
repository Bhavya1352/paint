import { useState } from 'react';
import { Eye, EyeOff, Trash2, Plus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Layer } from '@/types/layerTypes';

interface LayerPanelProps {
  layers: Layer[];
  activeLayerId: string;
  onAddLayer: () => void;
  onDeleteLayer: (layerId: string) => void;
  onSetActiveLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onSetOpacity: (layerId: string, opacity: number) => void;
  onUpdateLayer: (layerId: string, updates: Partial<Layer>) => void;
}

export const LayerPanel = ({
  layers,
  activeLayerId,
  onAddLayer,
  onDeleteLayer,
  onSetActiveLayer,
  onToggleVisibility,
  onSetOpacity,
  onUpdateLayer,
}: LayerPanelProps) => {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleNameEdit = (layer: Layer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  };

  const handleNameSave = (layerId: string) => {
    onUpdateLayer(layerId, { name: editingName });
    setEditingLayerId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, layerId: string) => {
    if (e.key === 'Enter') {
      handleNameSave(layerId);
    } else if (e.key === 'Escape') {
      setEditingLayerId(null);
    }
  };

  return (
    <div className="fixed right-4 top-20 w-64 bg-white rounded-lg shadow-xl border p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Layers</h3>
        <Button
          size="sm"
          onClick={onAddLayer}
          className="h-8 w-8 p-0"
          title="Add Layer"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
              layer.id === activeLayerId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSetActiveLayer(layer.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                className="h-6 w-6 p-0"
              >
                {layer.visible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </Button>

              {editingLayerId === layer.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleNameSave(layer.id)}
                  onKeyDown={(e) => handleKeyPress(e, layer.id)}
                  className="flex-1 px-2 py-1 text-sm border rounded"
                  autoFocus
                />
              ) : (
                <span
                  className="flex-1 text-sm font-medium truncate"
                  onDoubleClick={() => handleNameEdit(layer)}
                >
                  {layer.name}
                </span>
              )}

              {layers.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Opacity</span>
              <Slider
                value={[layer.opacity]}
                onValueChange={(values) => onSetOpacity(layer.id, values[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-8">{layer.opacity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};