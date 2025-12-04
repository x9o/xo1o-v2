import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const BackgroundEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: Point[] = [];
    const POINT_COUNT = 60;
    const CONNECTION_DISTANCE = 150;
    const MOUSE_DISTANCE = 250;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      for (let i = 0; i < POINT_COUNT; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw points
      points.forEach((point, i) => {
        // Move points
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Mouse interaction (repulsion/attraction)
        const dx = mouseRef.current.x - point.x;
        const dy = mouseRef.current.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MOUSE_DISTANCE) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (MOUSE_DISTANCE - distance) / MOUSE_DISTANCE;
            const directionX = forceDirectionX * force * 0.5;
            const directionY = forceDirectionY * force * 0.5;
            
            // Gently push away
            point.x -= directionX;
            point.y -= directionY;
        }

        // Draw Point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${0.3 + (Math.random() * 0.2)})`; // Indigo color
        ctx.fill();

        // Draw Connections
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const distX = point.x - p2.x;
          const distY = point.y - p2.y;
          const dist = Math.sqrt(distX * distX + distY * distY);

          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist / CONNECTION_DISTANCE * 0.9})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
    />
  );
};

export default BackgroundEffects;