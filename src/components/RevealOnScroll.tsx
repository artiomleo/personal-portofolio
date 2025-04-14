
import { useEffect, useRef, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  threshold?: number;
  className?: string;
}

export function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.1,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Set initial styles based on direction
    let initialStyles: Record<string, string> = {};
    
    switch (direction) {
      case "up":
        initialStyles = {
          transform: "translateY(40px)",
          opacity: "0",
        };
        break;
      case "down":
        initialStyles = {
          transform: "translateY(-40px)",
          opacity: "0",
        };
        break;
      case "left":
        initialStyles = {
          transform: "translateX(40px)",
          opacity: "0",
        };
        break;
      case "right":
        initialStyles = {
          transform: "translateX(-40px)",
          opacity: "0",
        };
        break;
    }
    
    Object.assign(element.style, initialStyles);
    element.style.transition = `transform 0.7s ease-out ${delay}s, opacity 0.7s ease-out ${delay}s`;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset transform and opacity when element is in view
          element.style.transform = "translate(0)";
          element.style.opacity = "1";
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -100px 0px",
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [direction, delay, threshold]);
  
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
