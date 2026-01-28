import { Check, Palette, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onEyedropperClick?: () => void;
}

export const ColorPicker = ({ color, onChange, onEyedropperClick }: ColorPickerProps) => {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  
  // MS Paint style color palette
  const colors = [
    // Row 1 - Basic colors
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#808080" },
    { name: "Dark Red", value: "#800000" },
    { name: "Red", value: "#FF0000" },
    { name: "Orange", value: "#FF8000" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Green", value: "#00FF00" },
    { name: "Cyan", value: "#00FFFF" },
    { name: "Blue", value: "#0000FF" },
    { name: "Purple", value: "#800080" },
    // Row 2 - Light colors
    { name: "White", value: "#FFFFFF" },
    { name: "Light Gray", value: "#C0C0C0" },
    { name: "Brown", value: "#804000" },
    { name: "Pink", value: "#FF80C0" },
    { name: "Peach", value: "#FFC080" },
    { name: "Light Yellow", value: "#FFFF80" },
    { name: "Lime", value: "#80FF00" },
    { name: "Light Cyan", value: "#80FFFF" },
    { name: "Light Blue", value: "#0080FF" },
    { name: "Magenta", value: "#FF00FF" },
  ];

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
    // Add to recent colors if not already there
    if (!recentColors.includes(newColor) && !colors.find(c => c.value === newColor)) {
      setRecentColors(prev => [newColor, ...prev.slice(0, 4)]);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      {/* Current color display */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex flex-col items-center">
          <span className="text-[8px] sm:text-[10px] text-muted-foreground mb-0.5 sm:mb-1">Current</span>
          <div 
            className="w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg border-2 border-border shadow-inner"
            style={{ backgroundColor: color }}
            title={color}
          />
        </div>
        
        {/* Color palette grid - 5 cols on mobile, 10 on desktop */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-0.5">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => handleColorChange(c.value)}
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 transition-all hover:scale-125 hover:z-10 relative border border-gray-300",
                color === c.value && "ring-2 ring-primary ring-offset-1"
              )}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        {/* Custom color picker */}
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => inputRef.current?.click()}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br from-red-500 via-green-500 to-blue-500 flex items-center justify-center transition-smooth hover:scale-110 border border-border"
            title="Custom Color"
          >
            <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-white drop-shadow" />
          </button>
          <input 
            ref={inputRef}
            type="color" 
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="absolute opacity-0 w-0 h-0"
          />
        </div>
      </div>

      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-[8px] sm:text-[10px] text-muted-foreground">Recent:</span>
          {recentColors.map((c, i) => (
            <button
              key={i}
              onClick={() => onChange(c)}
              className="w-3 h-3 sm:w-4 sm:h-4 rounded border border-border hover:scale-125 transition-all"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      )}
    </div>
  );
};
