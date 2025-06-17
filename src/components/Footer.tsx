
import { Github, Linkedin,  Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Github, href: "https://github.com/artiomleo", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/artiomleo/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:artiomleo@gmail.com", label: "Email" },
  ];
  
  return (
    <footer className="border-t border-border py-8 mt-20">
      <div className="container grid gap-8 md:grid-cols-2">
        <div>
          <Link 
            to="/" 
            className="text-xl font-bold flex items-center gap-2 mb-4"
          >
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
              AL
            </div>
            <span>Artiom Leontiev</span>
          </Link>
          <p className="text-muted-foreground max-w-md">
            Frontend developer passionate about creating beautiful, accessible, and user-friendly web experiences.
          </p>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="rounded-full p-2 hover:bg-muted transition-colors"
              >
                <link.icon size={18} />
              </a>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/experience" className="hover:text-foreground transition-colors">Experience</Link>
            <Link to="/projects" className="hover:text-foreground transition-colors">Projects</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {currentYear} Artiom Leontiev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
