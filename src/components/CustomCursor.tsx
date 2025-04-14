
import { useEffect, useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

export function CustomCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if on mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // If on mobile, don't show custom cursor
    if (isMobile) return;
    
    // Add cursor-none class to body to hide default cursor
    document.body.classList.add("cursor-none");
    
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mouseenter", onMouseEnter);
      
      // Add event listeners for links and buttons
      const interactiveElements = document.querySelectorAll("a, button, input, textarea, select, [role='button']");
      
      interactiveElements.forEach((element) => {
        element.addEventListener("mouseenter", onInteractiveElementEnter);
        element.addEventListener("mouseleave", onInteractiveElementLeave);
      });
    };
    
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const onMouseDown = () => {
      setClicked(true);
    };
    
    const onMouseUp = () => {
      setClicked(false);
    };
    
    const onMouseLeave = () => {
      setHidden(true);
    };
    
    const onMouseEnter = () => {
      setHidden(false);
    };
    
    const onInteractiveElementEnter = () => {
      setLinkHovered(true);
    };
    
    const onInteractiveElementLeave = () => {
      setLinkHovered(false);
    };
    
    addEventListeners();
    
    return () => {
      if (isMobile) return;
      
      document.body.classList.remove("cursor-none");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      
      const interactiveElements = document.querySelectorAll("a, button, input, textarea, select, [role='button']");
      
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", onInteractiveElementEnter);
        element.removeEventListener("mouseleave", onInteractiveElementLeave);
      });
    };
  }, [isMobile]);
  
  if (isMobile) return null;

  return (
    <>
      <div
        className={`custom-cursor fixed pointer-events-none z-50 transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {/* Main dot cursor */}
        <div
          className={`absolute rounded-full bg-primary transition-all duration-150 ${
            clicked ? "w-4 h-4 -ml-2 -mt-2 opacity-30" : "w-3 h-3 -ml-1.5 -mt-1.5"
          } ${linkHovered ? "w-5 h-5 -ml-2.5 -mt-2.5 bg-accent mix-blend-difference" : ""}`}
        />
        {/* Outer ring */}
        <div
          className={`absolute rounded-full border border-primary/60 transition-all duration-300 ease-out ${
            clicked ? "w-5 h-5 -ml-2.5 -mt-2.5" : "w-7 h-7 -ml-3.5 -mt-3.5"
          } ${linkHovered ? "w-10 h-10 -ml-5 -mt-5 border-accent/60" : ""}`}
        />
      </div>
    </>
  );
}
