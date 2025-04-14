
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const isDarkMode = document.documentElement.classList.contains("dark");
    
    // Resize canvas to match window size
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Re-initialize particles after resize
        initParticles();
      }
    };
    
    // Initialize particles
    const initParticles = () => {
      particles.current = [];
      const numberOfParticles = Math.min(
        Math.max(Math.floor(window.innerWidth * window.innerHeight / 15000), 30),
        100
      );
      
      for (let i = 0; i < numberOfParticles; i++) {
        const primaryColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--primary')
          .trim();
        const secondaryColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--secondary')
          .trim();
        const accentColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--accent')
          .trim();
        
        // Randomize particles with different colors
        const colors = [
          `hsl(${primaryColor} / 0.3)`,
          `hsl(${secondaryColor} / 0.3)`,
          `hsl(${accentColor} / 0.3)`,
        ];
        
        const randomIndex = Math.floor(Math.random() * colors.length);
        
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: colors[randomIndex],
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };
    
    // Update particle positions
    const updateParticles = () => {
      particles.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off the edges
        if (particle.x > canvas.width || particle.x < 0) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y > canvas.height || particle.y < 0) {
          particle.speedY = -particle.speedY;
        }
      });
    };
    
    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((particle) => {
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw connections between nearby particles
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.stroke();
          }
        }
      }
      
      ctx.globalAlpha = 1;
    };
    
    // Animation loop
    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initial setup
    resizeCanvas();
    let animationFrameId = requestAnimationFrame(animate);
    
    // Event listeners
    window.addEventListener("resize", resizeCanvas);
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      // Redraw particles when theme changes
      if (ctx) {
        drawParticles();
      }
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 w-full h-full" />;
}
