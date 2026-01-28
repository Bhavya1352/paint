import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Circle, Rect, PencilBrush, SprayBrush, Polygon, Path, Line, IText } from "fabric";
import { Toolbar } from "./Toolbar";
import { ColorPicker } from "./ColorPicker";
import { DrawingSubmitter } from "./DrawingSubmitter";
import { ZoomControls } from "./ZoomControls";
import { DarkModeToggle } from "./DarkModeToggle";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "sonner";

export type BrushType = "pencil" | "spray";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(3);
  const [brushType, setBrushType] = useState<BrushType>("pencil");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "triangle" | "star" | "heart" | "hexagon" | "line" | "text" | "eraser" | "fill" | "oval" | "diamond" | "pentagon" | "octagon" | "arrow" | "smiley" | "eye">("draw");
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  const saveToHistory = () => {
    if (!fabricCanvas || isUndoRedo.current) return;

    const state = JSON.stringify(fabricCanvas.toJSON());
    setHistory(prev => {
      // If we're not at the end of history, truncate future states
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, state];
    });
    setHistoryIndex(prev => prev + 1);
  };

  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const canvas = new FabricCanvas(canvasRef.current, {
      backgroundColor: "#ffffff",
      width: container.clientWidth || 800,
      height: container.clientHeight || 600,
      enableRetinaScaling: true,
      allowTouchScrolling: false,
    });

    const brush = new PencilBrush(canvas);
    brush.color = activeColor;
    brush.width = brushWidth;
    canvas.freeDrawingBrush = brush;
    canvas.isDrawingMode = true;

    setFabricCanvas(canvas);

    // Save initial empty canvas state so we can undo to blank canvas
    const initialState = JSON.stringify(canvas.toJSON());
    setHistory([initialState]);
    setHistoryIndex(0);
    setCanvasSize({ width: canvas.width || 800, height: canvas.height || 600 });
    setIsLoading(false);

    // Track mouse position
    canvas.on('mouse:move', (e) => {
      const pointer = canvas.getPointer(e.e);
      setMousePos({ x: Math.round(pointer.x), y: Math.round(pointer.y) });
    });

    // Track zoom changes
    canvas.on('mouse:wheel', () => {
      setZoomLevel(Math.round((canvas.getZoom() || 1) * 100));
    });

    // Save on drawing
    canvas.on('path:created', () => {
      setTimeout(() => {
        if (!isUndoRedo.current) {
          const state = JSON.stringify(canvas.toJSON());
          console.log('Path created, saving to history');
          setHistory(prev => {
            // Truncate any redo states and add new state
            return [...prev, state];
          });
          setHistoryIndex(prev => prev + 1);
        }
      }, 100);
    });

    // Save when object is modified (moved, resized, rotated)
    canvas.on('object:modified', () => {
      setTimeout(() => {
        if (!isUndoRedo.current) {
          const state = JSON.stringify(canvas.toJSON());
          setHistory(prev => [...prev, state]);
          setHistoryIndex(prev => prev + 1);
        }
      }, 100);
    });

    // Mobile touch support
    const preventScroll = (e: TouchEvent) => {
      if (e.target === canvas.upperCanvasEl) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });

    toast.success("Canvas ready!");

    return () => {
      canvas.off('path:created');
      canvas.off('object:modified');
      canvas.off('mouse:move');
      canvas.off('mouse:wheel');
      document.removeEventListener('touchstart', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    // Remove any existing fill handlers
    fabricCanvas.off('mouse:down');

    if (activeTool === "draw") {
      fabricCanvas.isDrawingMode = true;
      const brush = brushType === "spray" ? new SprayBrush(fabricCanvas) : new PencilBrush(fabricCanvas);
      brush.color = activeColor;
      brush.width = brushWidth;
      
      // Smooth drawing with requestAnimationFrame
      let animationId: number;
      const smoothRender = () => {
        fabricCanvas.renderAll();
        animationId = requestAnimationFrame(smoothRender);
      };
      
      fabricCanvas.freeDrawingBrush = brush;
      fabricCanvas.on('path:created', () => {
        cancelAnimationFrame(animationId);
      });
      
    } else if (activeTool === "eraser") {
      fabricCanvas.isDrawingMode = true;
      const eraser = new PencilBrush(fabricCanvas);
      eraser.color = "#ffffff";
      eraser.width = brushWidth * 2;
      fabricCanvas.freeDrawingBrush = eraser;
    } else if (activeTool === "fill") {
      fabricCanvas.isDrawingMode = false;
      // Add persistent fill handler
      fabricCanvas.on('mouse:down', (e) => {
        if (e.target) {
          e.target.set('fill', activeColor);
          fabricCanvas.renderAll();
          setTimeout(saveToHistory, 100);
          toast.success(`Object filled with ${activeColor}!`);
        }
      });
    } else {
      fabricCanvas.isDrawingMode = false;
    }
  }, [fabricCanvas, activeTool, activeColor, brushWidth, brushType]);

  const handleToolClick = (tool: typeof activeTool) => {
    if (!fabricCanvas) return;

    // Helper function to get random position within canvas bounds
    const getRandomPosition = (shapeSize: number = 100) => ({
      left: Math.max(50, Math.random() * (fabricCanvas.width! - shapeSize - 50)),
      top: Math.max(50, Math.random() * (fabricCanvas.height! - shapeSize - 50))
    });

    // Only set active tool for non-shape tools
    if (["select", "draw", "eraser", "fill"].includes(tool)) {
      setActiveTool(tool);
      return;
    }

    const pos = getRandomPosition();

    // For shape tools, add the shape but keep the tool active
    if (tool === "rectangle") {
      const rect = new Rect({
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
        width: 120,
        height: 80,
      });
      fabricCanvas.add(rect);
      setTimeout(saveToHistory, 100);
      toast.info("Rectangle added - Click again to add more");
    } else if (tool === "circle") {
      const circle = new Circle({
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
        radius: 50,
      });
      fabricCanvas.add(circle);
      setTimeout(saveToHistory, 100);
      toast.info("Circle added - Click again to add more");
    } else if (tool === "oval") {
      const oval = new Circle({
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
        radius: 40,
        scaleX: 1.5,
        scaleY: 0.8,
      });
      fabricCanvas.add(oval);
      setTimeout(saveToHistory, 100);
      toast.info("Oval added - Click again to add more");
    } else if (tool === "triangle") {
      const triangle = new Polygon([
        { x: 0, y: -50 },
        { x: -43, y: 25 },
        { x: 43, y: 25 }
      ], {
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(triangle);
      setTimeout(saveToHistory, 100);
      toast.info("Triangle added - Click again to add more");
    } else if (tool === "diamond") {
      const diamond = new Polygon([
        { x: 0, y: -50 },
        { x: 40, y: 0 },
        { x: 0, y: 50 },
        { x: -40, y: 0 }
      ], {
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(diamond);
      setTimeout(saveToHistory, 100);
      toast.info("Diamond added - Click again to add more");
    } else if (tool === "pentagon") {
      const pentagon = new Polygon([
        { x: 0, y: -50 },
        { x: 47, y: -15 },
        { x: 29, y: 40 },
        { x: -29, y: 40 },
        { x: -47, y: -15 }
      ], {
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(pentagon);
      setTimeout(saveToHistory, 100);
      toast.info("Pentagon added - Click again to add more");
    } else if (tool === "octagon") {
      const octagon = new Polygon([
        { x: 0, y: -50 },
        { x: 35, y: -35 },
        { x: 50, y: 0 },
        { x: 35, y: 35 },
        { x: 0, y: 50 },
        { x: -35, y: 35 },
        { x: -50, y: 0 },
        { x: -35, y: -35 }
      ], {
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(octagon);
      setTimeout(saveToHistory, 100);
      toast.info("Octagon added - Click again to add more");
    } else if (tool === "star") {
      const star = new Polygon([
        { x: 0, y: -50 },
        { x: 14, y: -20 },
        { x: 47, y: -15 },
        { x: 23, y: 7 },
        { x: 29, y: 40 },
        { x: 0, y: 25 },
        { x: -29, y: 40 },
        { x: -23, y: 7 },
        { x: -47, y: -15 },
        { x: -14, y: -20 }
      ], {
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(star);
      setTimeout(saveToHistory, 100);
      toast.info("Star added - Click again to add more");
    } else if (tool === "heart") {
      const heartPath = "M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z";
      const heart = new Path(heartPath, {
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
        scaleX: 3,
        scaleY: 3,
      });
      fabricCanvas.add(heart);
      setTimeout(saveToHistory, 100);
      toast.info("Heart added - Click again to add more");
    } else if (tool === "hexagon") {
      const hexagon = new Polygon([
        { x: 50, y: 0 },
        { x: 93, y: 25 },
        { x: 93, y: 75 },
        { x: 50, y: 100 },
        { x: 7, y: 75 },
        { x: 7, y: 25 }
      ], {
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(hexagon);
      setTimeout(saveToHistory, 100);
      toast.info("Hexagon added - Click again to add more");
    } else if (tool === "arrow") {
      const arrow = new Polygon([
        { x: -40, y: -10 },
        { x: 20, y: -10 },
        { x: 20, y: -20 },
        { x: 40, y: 0 },
        { x: 20, y: 20 },
        { x: 20, y: 10 },
        { x: -40, y: 10 }
      ], {
        left: pos.left,
        top: pos.top,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: 2,
      });
      fabricCanvas.add(arrow);
      setTimeout(saveToHistory, 100);
      toast.info("Arrow added - Click again to add more");
    } else if (tool === "smiley") {
      const smiley = new IText('😊', {
        left: Math.random() * (fabricCanvas.width! - 50),
        top: Math.random() * (fabricCanvas.height! - 50),
        fontSize: 40,
        fontFamily: 'Arial',
      });
      fabricCanvas.add(smiley);
      setTimeout(saveToHistory, 100);
      toast.info("Smiley emoji added - Click again to add more");
    } else if (tool === "eye") {
      const eye = new IText('👁️', {
        left: Math.random() * (fabricCanvas.width! - 50),
        top: Math.random() * (fabricCanvas.height! - 50),
        fontSize: 40,
        fontFamily: 'Arial',
      });
      fabricCanvas.add(eye);
      setTimeout(saveToHistory, 100);
      toast.info("Eye emoji added - Click again to add more");
    } else if (tool === "line") {
      const line = new Line([50, 50, 150, 50], {
        left: pos.left,
        top: pos.top,
        stroke: activeColor,
        strokeWidth: brushWidth,
      });
      fabricCanvas.add(line);
      setTimeout(saveToHistory, 100);
      toast.info("Line added - Click again to add more");
    } else if (tool === "text") {
      setActiveTool('select');
      const text = new IText('Type here...', {
        left: Math.random() * (fabricCanvas.width! - 100),
        top: Math.random() * (fabricCanvas.height! - 50),
        fill: activeColor,
        fontSize: 20,
        fontFamily: 'Arial',
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      text.enterEditing();
      setTimeout(saveToHistory, 100);
      toast.info("Text mode - Type to edit, click elsewhere when done");
    } else if (tool === "fill") {
      setActiveTool(tool);
      toast.info("Fill mode active - Click objects to fill with color");
    }
  };

  const handleUndo = useCallback(() => {
    console.log('Undo clicked - historyIndex:', historyIndex, 'history length:', history.length);
    if (historyIndex > 0 && history.length > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      console.log('Loading state at index:', newIndex);

      if (fabricCanvas && state) {
        isUndoRedo.current = true;
        fabricCanvas.loadFromJSON(JSON.parse(state)).then(() => {
          fabricCanvas.renderAll();
          isUndoRedo.current = false;
          console.log('Undo complete');
        });
        setHistoryIndex(newIndex);
        toast.success("↶ Undo ho gaya!");
      }
    } else {
      toast.error("Kuch bhi undo karne ko nahi hai!");
    }
  }, [historyIndex, history, fabricCanvas]);

  const handleRedo = useCallback(() => {
    console.log('Redo clicked - historyIndex:', historyIndex, 'history length:', history.length);
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      console.log('Loading state at index:', newIndex);

      if (fabricCanvas && state) {
        isUndoRedo.current = true;
        fabricCanvas.loadFromJSON(JSON.parse(state)).then(() => {
          fabricCanvas.renderAll();
          isUndoRedo.current = false;
          console.log('Redo complete');
        });
        setHistoryIndex(newIndex);
        toast.success("↩️ Wapas restore ho gaya!");
      }
    } else {
      toast.error("Kuch restore karne ko nahi hai!");
    }
  }, [historyIndex, history, fabricCanvas]);

  const handleDelete = useCallback(() => {
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject) {
      fabricCanvas?.remove(activeObject);
      fabricCanvas?.renderAll();
      setTimeout(() => {
        if (!fabricCanvas || isUndoRedo.current) return;
        const state = JSON.stringify(fabricCanvas.toJSON());
        setHistory(prev => [...prev.slice(0, historyIndex + 1), state]);
        setHistoryIndex(prev => prev + 1);
      }, 100);
      toast.error("🗑️ Delete ho gaya! Ctrl+Z se wapas laa sakte ho");
    } else {
      toast.info("Pehle koi object select karo delete karne ke liye");
    }
  }, [fabricCanvas, historyIndex]);

  const handleClear = useCallback(() => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    setTimeout(() => {
      if (!fabricCanvas || isUndoRedo.current) return;
      const state = JSON.stringify(fabricCanvas.toJSON());
      setHistory(prev => [...prev.slice(0, historyIndex + 1), state]);
      setHistoryIndex(prev => prev + 1);
    }, 100);
    toast.success("🧹 Sab saaf! Ctrl+Z se wapas laa sakte ho");
  }, [fabricCanvas, historyIndex]);

  const handleExport = (format: 'png' | 'svg' = 'png') => {
    if (!fabricCanvas) return;
    
    if (format === 'svg') {
      const svgData = fabricCanvas.toSVG();
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mini-paint.svg';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('SVG exported!');
    } else {
      const dataURL = fabricCanvas.toDataURL({ format: 'png', multiplier: 1 });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'mini-paint.png';
      link.click();
      toast.success('PNG exported!');
    }
  };

  const handleEvaluate = () => {
    toast.info("AI Evaluator coming soon!");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDelete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleDelete]);

  return (
    <div className="flex flex-col h-screen w-full p-1 sm:p-2 gap-1 sm:gap-2 bg-gray-200 dark:bg-gray-900 overflow-hidden">
      {/* Top Toolbar Area - Paint Style */}
      <div className="flex flex-wrap gap-1 sm:gap-2 items-start justify-center overflow-x-auto pb-1">
        <Toolbar 
          activeTool={activeTool} 
          onToolClick={handleToolClick} 
          onClear={handleClear}
          brushWidth={brushWidth}
          onBrushWidthChange={setBrushWidth}
          brushType={brushType}
          onBrushTypeChange={setBrushType}
          onExport={() => handleExport('png')}
          onExportSVG={() => handleExport('svg')}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onEvaluate={handleEvaluate}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
        
        <div className="glass-card rounded-xl sm:rounded-2xl p-2 sm:p-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400">🎨 COLORS</span>
            <ColorPicker color={activeColor} onChange={setActiveColor} />
          </div>
        </div>
      </div>
      
      <DrawingSubmitter fabricCanvas={fabricCanvas} />
      <ZoomControls fabricCanvas={fabricCanvas} onZoomChange={setZoomLevel} />
      
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex gap-1 sm:gap-2">
        <KeyboardShortcuts />
        <DarkModeToggle />
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner message="Initializing Canvas..." size="lg" />
        </div>
      )}
      
      <div className="flex-grow w-full relative min-h-0" ref={canvasContainerRef}>
        <div className="absolute inset-0 glass-card rounded-xl sm:rounded-3xl overflow-hidden shadow-elegant border-2 border-border/50">
          <canvas ref={canvasRef} />
        </div>
        {/* Real Paint Style Status Bar - Responsive */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 px-1 sm:px-2 py-0.5 sm:py-1 flex items-center justify-between text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 rounded-b-xl sm:rounded-b-3xl">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="hidden xs:inline">Ready</span>
            </div>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Pos: {mousePos.x}, {mousePos.y}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="capitalize"><strong>{activeTool}</strong></span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">{brushWidth}px</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded border border-gray-400" style={{ backgroundColor: activeColor }}></div>
            </div>
            <span className="hidden md:inline">| {zoomLevel}%</span>
            <span>| {historyIndex + 1}/{history.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};