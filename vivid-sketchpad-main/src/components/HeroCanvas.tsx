
import React, { useRef, useEffect } from 'react';

const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = 300;
    const height = canvas.height = 300;

    class Line {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 6 - 3;
        this.vy = Math.random() * 6 - 3;
        this.life = this.maxLife = Math.random() * 100 + 150;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.strokeStyle = this.color;
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
    
    const init = () => {
        lines = [];
        for (let i = 0; i < 30; i++) {
            lines.push(new Line(width / 2, height / 2));
        }
    }

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      lines.forEach((line, i) => {
        line.update();
        line.draw(ctx);
        if (line.life < 0) {
          lines.splice(i, 1);
          lines.push(new Line(width / 2, height / 2));
        }
      });
    };

    init();
    animate();

  }, []);

  return <canvas ref={canvasRef} className="rounded-lg shadow-lg" width="300" height="300" />;
};

export default HeroCanvas;
