import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Palette, Users, Zap, Sparkles, BrainCircuit } from "lucide-react";
import DrawingAnimation from "@/components/DrawingAnimation";
import HeroCanvas from "@/components/HeroCanvas";
import { ThemeToggle } from "@/components/ThemeToggle";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.5 });
  const isVisible = !!entry?.isIntersecting;

  return (
    <div ref={ref} className={`feature-card ${isVisible ? 'is-visible' : ''}`}>
      <div className="p-6 bg-card rounded-lg shadow-lg border border-border/50 hover:border-purple-500/50 transition-colors">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-center mb-2">{title}</h3>
        <p className="text-muted-foreground text-center">{description}</p>
      </div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();

  const handleRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
    setTimeout(() => {
        navigate("/whiteboard");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
      </div>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <DrawingAnimation />
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-fade-in-down tracking-tight">
              Vivid Sketchpad
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up font-medium">
              Create, Draw, and Imagine. <br/>
              <span className="text-purple-600 dark:text-purple-400 font-bold">Powered by AI Magic.</span>
            </p>
            <div className="hidden md:flex justify-center animate-fade-in-up animation-delay-400 gap-8 py-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-80 h-60 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-purple-100 dark:border-purple-900/50 p-4">
                  <canvas 
                    id="miniCanvas" 
                    width="288" 
                    height="192" 
                    className="w-full h-full rounded-lg cursor-crosshair bg-gray-50 dark:bg-gray-900"
                    onMouseDown={(e) => {
                      const canvas = e.currentTarget;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        const rect = canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        ctx.strokeStyle = '#9b87f5';
                        ctx.lineWidth = 3;
                        ctx.lineCap = 'round';
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        
                        const draw = (e: MouseEvent) => {
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          ctx.lineTo(x, y);
                          ctx.stroke();
                        };
                        
                        const stopDraw = () => {
                          canvas.removeEventListener('mousemove', draw);
                          canvas.removeEventListener('mouseup', stopDraw);
                        };
                        
                        canvas.addEventListener('mousemove', draw);
                        canvas.addEventListener('mouseup', stopDraw);
                      }
                    }}
                  />
                </div>
                <div className="absolute -top-3 -right-3 bg-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg uppercase tracking-widest">
                  Try Now!
                </div>
              </div>
              
              <div className="relative group w-80 h-60 rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-100 dark:border-pink-900/50">
                <div className="absolute inset-0 bg-purple-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-pink-400 animate-pulse" />
                  <p className="text-white font-bold leading-tight">
                    "A futuristic city in space, neon colors, digital art"
                  </p>
                  <div className="bg-white/10 px-3 py-1 rounded text-[10px] text-white/60 uppercase tracking-widest">
                    AI Prompt Example
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 bg-pink-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg uppercase tracking-widest">
                  AI Magic
                </div>
              </div>
            </div>
            <div className="pt-4 animate-fade-in-up animation-delay-600">
              <Button
                size="lg"
                className="text-xl px-10 py-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 transition-all font-bold tracking-tight ripple-button"
                onClick={handleRipple}
              >
                Launch Studio
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        <div className="py-20 px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">The Future of Art</h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sparkles size={48} className="text-purple-500" />} 
              title="AI Image Gen" 
              description="Simply type what you want to see, and our AI will generate high-quality art directly onto your canvas." 
            />
            <FeatureCard 
              icon={<BrainCircuit size={48} className="text-pink-500" />} 
              title="AI Art Critic" 
              description="Get professional feedback on your drawings. Our AI evaluates composition, color, and technique." 
            />
            <FeatureCard 
              icon={<Palette size={48} className="text-orange-500" />} 
              title="Creative Tools" 
              description="Brush, Spray, Shapes, Text, and more. A full suite of traditional tools enhanced for the digital age." 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
