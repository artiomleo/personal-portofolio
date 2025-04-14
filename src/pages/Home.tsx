
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col justify-center min-h-screen relative">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <RevealOnScroll direction="right" delay={0.2}>
            <span className="text-primary font-medium">Hello, I'm John Doe</span>
          </RevealOnScroll>
          
          <RevealOnScroll>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mt-4 mb-6 leading-tight">
              Frontend <span className="text-primary">Developer</span>
              <br />
              Building the Web
            </h1>
          </RevealOnScroll>
          
          <RevealOnScroll direction="left" delay={0.4}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8">
              I craft modern, responsive, and user-friendly web experiences 
              with a focus on accessibility and performance.
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={0.6}>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">
                  Get in touch <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/projects">
                  View my work
                </Link>
              </Button>
            </div>
          </RevealOnScroll>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse">
          <span className="text-sm mb-2">Scroll down</span>
          <ChevronDown size={20} />
        </div>
      </section>
      
      {/* Featured Projects Preview */}
      <section className="section-padding">
        <div className="container">
          <RevealOnScroll>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
                <p className="text-muted-foreground">Some of my recent work</p>
              </div>
              <Button asChild variant="ghost" className="group">
                <Link to="/projects">
                  View all projects
                  <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </RevealOnScroll>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Project Card 1 */}
            <RevealOnScroll delay={0.1}>
              <Link to="/projects" className="group">
                <div className="rounded-lg overflow-hidden border border-border bg-card/50 hover:bg-card transition-colors duration-300 h-full flex flex-col">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                      alt="E-commerce project screenshot" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        React
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                        TypeScript
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      E-Commerce Dashboard
                    </h3>
                    <p className="text-muted-foreground text-sm flex-grow">
                      A modern dashboard for managing products, orders, and customers with real-time analytics.
                    </p>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
            
            {/* Project Card 2 */}
            <RevealOnScroll delay={0.2}>
              <Link to="/projects" className="group">
                <div className="rounded-lg overflow-hidden border border-border bg-card/50 hover:bg-card transition-colors duration-300 h-full flex flex-col">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80" 
                      alt="Mobile app project screenshot" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Next.js
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                        Tailwind
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      Social Media Platform
                    </h3>
                    <p className="text-muted-foreground text-sm flex-grow">
                      A responsive social media platform with real-time messaging and content sharing.
                    </p>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
            
            {/* Project Card 3 */}
            <RevealOnScroll delay={0.3}>
              <Link to="/projects" className="group">
                <div className="rounded-lg overflow-hidden border border-border bg-card/50 hover:bg-card transition-colors duration-300 h-full flex flex-col">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2020&q=80" 
                      alt="Analytics project screenshot" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Vue.js
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                        D3.js
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      Analytics Dashboard
                    </h3>
                    <p className="text-muted-foreground text-sm flex-grow">
                      Data visualization dashboard with interactive charts and customizable reports.
                    </p>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-padding">
        <div className="container">
          <RevealOnScroll>
            <div className="relative rounded-2xl p-10 md:p-16 overflow-hidden border border-border">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 opacity-50" />
              
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to bring your ideas to life?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  I'm currently available for freelance work. If you have a project
                  that needs some creative direction, I'd love to hear about it.
                </p>
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/contact">
                    Let's work together
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
