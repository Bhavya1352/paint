import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Palette, Users, Zap } from "lucide-react";
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
      <div className="p-6 bg-card rounded-lg shadow-lg">
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
      <div className="absolute inset-0 z-0">
        <img 
          src="/BACKGROUND.jpeg" 
          alt="Background" 
          className="w-full h-full object-contain opacity-50 blur-[1px]"
        />
      </div>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <DrawingAnimation />
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-fade-in-down">
              Welcome to Mini Paint
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
              Unleash your creativity with a simple and intuitive drawing
              experience. Start fresh or collaborate with others in real-time.
            </p>
            <div className="hidden md:flex justify-center animate-fade-in-up animation-delay-400 gap-8">
              <div className="relative">
                <div className="w-80 h-60 bg-white rounded-2xl shadow-2xl border-4 border-purple-200 p-4">
                  <canvas 
                    id="miniCanvas" 
                    width="288" 
                    height="192" 
                    className="w-full h-full rounded-lg cursor-crosshair"
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
                <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Try Drawing!
                </div>
              </div>
              
              <div className="relative w-80 h-60 rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-200">
                <img 
                  src="/.gif" 
                  alt="Drawing Animation" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 to-transparent"></div>
                <div className="absolute -bottom-2 -left-2 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  See Demo!
                </div>
              </div>
            </div>
            <div className="pt-4 animate-fade-in-up animation-delay-600">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all ripple-button"
                onClick={handleRipple}
              >
                Start Sketching
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="py-20 px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<Palette size={48} className="text-primary" />} title="Multiple Tools" description="Draw with pencil, spray brush, add shapes and more creative tools." />
            <FeatureCard icon={<Users size={48} className="text-primary" />} title="Undo/Redo" description="Never lose your work with powerful undo and redo functionality." />
            <FeatureCard icon={<Zap size={48} className="text-primary" />} title="Export" description="Save your masterpiece as PNG and share with the world." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
