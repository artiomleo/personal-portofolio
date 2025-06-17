
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ParticleBackground } from "./components/ParticleBackground";
import { ScrollProgress } from "./components/ScrollProgress";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Accessibility skip link */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      
      {/* Background elements */}
      <ParticleBackground />
      {/* <CustomCursor /> */}
      <ScrollProgress />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
