
import React, { useRef, useEffect } from 'react';

const DrawingAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    class Line {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 - 2;
        this.life = this.maxLife = Math.random() * 100 + 50;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.strokeStyle = `hsl(${this.x / width * 360}, 70%, 60%)`;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx, this.y - this.vy);
        ctx.stroke();
        ctx.restore();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
      }
    }

    let lines: Line[] = [];
    const mouse = { x: width / 2, y: height / 2 };

    const init = () => {
      lines = [];
      for (let i = 0; i < 50; i++) {
        lines.push(new Line(mouse.x, mouse.y));
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      lines.forEach((line, i) => {
        line.update();
        line.draw(ctx);
        if (line.life < 0) {
          lines.splice(i, 1);
          lines.push(new Line(mouse.x, mouse.y));
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        init();
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};

export default DrawingAnimation;
