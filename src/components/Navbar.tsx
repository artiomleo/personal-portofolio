
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Menu items
  const menuItems = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Experience", path: "/experience" },
    { title: "Projects", path: "/projects" },
    { title: "Contact", path: "/contact" },
  ];
  
  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      
      {/* Main navigation */}
      <header 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled ? "py-3 blur-backdrop shadow-sm" : "py-5 bg-transparent"
        }`}
      >
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold flex items-center gap-2 hover:text-primary transition-colors"
            aria-label="Go to homepage"
          >
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
              AL
            </div>
            <span>Artiom Leontiev</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <ul className="flex gap-6">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={`relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${
                      location.pathname === item.path ? 'text-primary after:scale-x-100' : ''
                    }`}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            
            <ThemeToggle />
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation overlay */}
      <div 
        className={`fixed inset-0 bg-background/95 backdrop-blur-md z-30 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full">
          <ul className="flex flex-col gap-8 text-center text-2xl">
            {menuItems.map((item) => (
              <li key={item.title} className="opacity-0 animate-fade-in" style={{ animationDelay: `${menuItems.indexOf(item) * 0.1}s` }}>
                <Link
                  to={item.path}
                  className={`relative font-medium ${location.pathname === item.path ? 'text-primary' : ''}`}
                  aria-current={location.pathname === item.path ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
