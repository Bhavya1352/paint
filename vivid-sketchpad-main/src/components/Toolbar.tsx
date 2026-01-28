import { MousePointer2, Pen, Square, Circle, Trash2, Brush, Download, Undo2, Redo2, RotateCcw, Triangle, Star, Heart, Hexagon, Minus, Type, Eraser, PaintBucket, Sparkles, X, Ellipsis, Diamond, Octagon, Pentagon, Zap, Smile, Eye, Move3D, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BrushType } from "./Canvas";

interface ToolbarProps {
  activeTool: "select" | "draw" | "rectangle" | "circle" | "triangle" | "star" | "heart" | "hexagon" | "line" | "text" | "eraser" | "fill" | "oval" | "diamond" | "pentagon" | "octagon" | "arrow" | "smiley" | "eye";
  onToolClick: (tool: "select" | "draw" | "rectangle" | "circle" | "triangle" | "star" | "heart" | "hexagon" | "line" | "text" | "eraser" | "fill" | "oval" | "diamond" | "pentagon" | "octagon" | "arrow" | "smiley" | "eye") => void;
  onClear: () => void;
  onExport: () => void;
  onExportSVG: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onEvaluate: () => void;
  brushWidth: number;
  onBrushWidthChange: (width: number) => void;
  brushType: BrushType;
  onBrushTypeChange: (type: BrushType) => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const Toolbar = ({ 
  activeTool, 
  onToolClick, 
  onClear, 
  onExport,
  onExportSVG,
  onUndo,
  onRedo,
  onEvaluate,
  brushWidth, 
  onBrushWidthChange,
  brushType,
  onBrushTypeChange,
  canUndo = true,
  canRedo = true
}: ToolbarProps) => {
  const [isShapesOpen, setIsShapesOpen] = useState(false);
  
  const shapeTools = [
    { id: "rectangle" as const, icon: Square, label: "Rectangle" },
    { id: "circle" as const, icon: Circle, label: "Circle" },
    { id: "oval" as const, icon: Ellipsis, label: "Oval" },
    { id: "triangle" as const, icon: Triangle, label: "Triangle" },
    { id: "diamond" as const, icon: Diamond, label: "Diamond" },
    { id: "pentagon" as const, icon: Pentagon, label: "Pentagon" },
    { id: "hexagon" as const, icon: Hexagon, label: "Hexagon" },
    { id: "octagon" as const, icon: Octagon, label: "Octagon" },
    { id: "star" as const, icon: Star, label: "Star" },
    { id: "heart" as const, icon: Heart, label: "Heart" },
    { id: "arrow" as const, icon: Zap, label: "Arrow" },
    { id: "smiley" as const, icon: Smile, label: "Smiley" },
    { id: "eye" as const, icon: Eye, label: "Eye" },
  ];

  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-2 sm:p-3 animate-scale-in max-w-full">
      {/* Action Tools Section */}
      <div className="mb-2 sm:mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400">ACTIONS</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              "tool-button rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10 hover:bg-blue-100 hover:text-blue-600",
              !canUndo && "opacity-50 cursor-not-allowed"
            )}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            className={cn(
              "tool-button rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10 hover:bg-green-100 hover:text-green-600",
              !canRedo && "opacity-50 cursor-not-allowed"
            )}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="tool-button rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10 hover:bg-red-100 hover:text-red-600"
            title="Sab Saaf Karo"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Drawing Tools Section */}
      <div className="mb-2 sm:mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400">TOOLS</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToolClick('select')}
            className={cn(
              "tool-button rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10",
              activeTool === 'select' && "tool-button-active"
            )}
            title="Select"
          >
            <MousePointer2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToolClick('draw')}
            className={cn(
              "tool-button rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10",
              activeTool === 'draw' && "tool-button-active"
            )}
            title="Pencil"
          >
            <Pen className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToolClick('eraser')}
            className={cn(
              "tool-button rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10",
              activeTool === 'eraser' && "tool-button-active"
            )}
            title="Eraser"
          >
            <Eraser className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToolClick('fill')}
            className={cn(
              "tool-button rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10",
              activeTool === 'fill' && "tool-button-active"
            )}
            title="Fill"
          >
            <PaintBucket className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToolClick('text')}
            className={cn(
              "tool-button rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10",
              activeTool === 'text' && "tool-button-active"
            )}
            title="Text"
          >
            <Type className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToolClick('line')}
            className={cn(
              "tool-button rounded-lg sm:rounded-xl w-8 h-8 sm:w-10 sm:h-10",
              activeTool === 'line' && "tool-button-active"
            )}
            title="Line"
          >
            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Shapes Section - Collapsible on mobile */}
      <div className="mb-2 sm:mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <Collapsible open={isShapesOpen} onOpenChange={setIsShapesOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 mb-1 sm:mb-2 w-full">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400">SHAPES</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform sm:hidden", isShapesOpen && "rotate-180")} />
          </CollapsibleTrigger>
          {/* Always visible on desktop, collapsible on mobile */}
          <div className="hidden sm:flex items-center gap-1 flex-wrap">
            {shapeTools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="icon"
                onClick={() => onToolClick(tool.id)}
                className={cn(
                  "tool-button rounded-lg sm:rounded-xl w-7 h-7 sm:w-8 sm:h-8",
                  activeTool === tool.id && "tool-button-active"
                )}
                title={tool.label}
              >
                <tool.icon className="w-3 h-3" />
              </Button>
            ))}
          </div>
          <CollapsibleContent className="sm:hidden">
            <div className="flex items-center gap-1 flex-wrap">
              {shapeTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant="ghost"
                  size="icon"
                  onClick={() => onToolClick(tool.id)}
                  className={cn(
                    "tool-button rounded-lg w-7 h-7",
                    activeTool === tool.id && "tool-button-active"
                  )}
                  title={tool.label}
                >
                  <tool.icon className="w-3 h-3" />
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Brush Settings Section */}
      <div className="mb-2 sm:mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400">BRUSH</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="tool-button rounded-lg sm:rounded-xl w-7 h-7 sm:w-8 sm:h-8" title="Brush Type">
                <Brush className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onBrushTypeChange("pencil")}>
                <Pen className="w-4 h-4 mr-2" /> Pencil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBrushTypeChange("spray")}>
                <Sparkles className="w-4 h-4 mr-2" /> Spray
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Brush Size with Visual Preview */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div 
              className="rounded-full bg-foreground transition-all hidden sm:block"
              style={{ 
                width: Math.min(brushWidth, 24), 
                height: Math.min(brushWidth, 24),
                minWidth: 4,
                minHeight: 4
              }}
              title={`Brush size: ${brushWidth}px`}
            />
            <Slider 
              defaultValue={[brushWidth]}
              value={[brushWidth]}
              onValueChange={(values) => onBrushWidthChange(values[0])}
              max={50}
              min={1}
              step={1}
              className="w-16 sm:w-24"
            />
            <span className="text-[10px] sm:text-xs font-mono bg-muted px-1 sm:px-1.5 py-0.5 rounded">{brushWidth}px</span>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400">SAVE</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onExport}
          className="tool-button rounded-lg sm:rounded-xl w-7 h-7 sm:w-8 sm:h-8 hover:bg-blue-100 hover:text-blue-600"
          title="Save as PNG"
        >
          <Download className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportSVG}
          className="tool-button rounded-lg sm:rounded-xl h-7 sm:h-8 px-1.5 sm:px-2 hover:bg-purple-100 hover:text-purple-600 text-[10px] sm:text-xs"
          title="Save as SVG"
        >
          SVG
        </Button>
      </div>
    </div>
  );
};