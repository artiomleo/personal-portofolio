
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";

// Sample project data
const projects = [
  {
    id: 1,
    title: "E-Commerce Dashboard",
    description: "A comprehensive dashboard for managing products, orders, and customers with real-time analytics and inventory tracking.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
    category: "Web App",
    links: {
      github: "#",
      live: "#",
    },
  },
  {
    id: 2,
    title: "Social Media Platform",
    description: "A responsive social platform with real-time messaging, notifications, and content sharing capabilities.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
    technologies: ["Next.js", "React", "Socket.io", "Express", "PostgreSQL"],
    category: "Web App",
    links: {
      github: "#",
      live: "#",
    },
  },
  {
    id: 3,
    title: "Analytics Dashboard",
    description: "Data visualization dashboard with interactive charts, customizable reports, and user permission management.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2020&q=80",
    technologies: ["Vue.js", "D3.js", "Express", "Firebase"],
    category: "Web App",
    links: {
      github: "#",
      live: "#",
    },
  },
  {
    id: 4,
    title: "Health & Fitness App",
    description: "Mobile application for tracking workouts, nutrition, and health metrics with personalized recommendations.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    technologies: ["React Native", "Redux", "Node.js", "MongoDB"],
    category: "Mobile App",
    links: {
      github: "#",
      live: "#",
    },
  },
  {
    id: 5,
    title: "Real Estate Platform",
    description: "Web platform for property listings with advanced search, virtual tours, and agent contact features.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    technologies: ["React", "Redux", "Node.js", "MongoDB", "MapBox API"],
    category: "Web App",
    links: {
      github: "#",
      live: "#",
    },
  },
  {
    id: 6,
    title: "Restaurant Booking System",
    description: "Online reservation system with table management, customer preferences, and automated email confirmations.",
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    technologies: ["Vue.js", "Vuex", "Express", "PostgreSQL", "Twilio API"],
    category: "Web App",
    links: {
      github: "#",
      live: "#",
    },
  },
];

// Category filters
const categories = ["All", "Web App", "Mobile App", "UI/UX", "Other"];

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter projects based on category and search query
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = filter === "All" || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="pt-24">
      {/* Projects Header */}
      <section className="section-padding">
        <div className="container">
          <RevealOnScroll>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">My Projects</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10">
              Explore a selection of my recent work. Each project showcases different skills 
              and technologies I've worked with.
            </p>
          </RevealOnScroll>
          
          {/* Filters */}
          <RevealOnScroll delay={0.2}>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-10">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      filter === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 rounded-full bg-card border border-border focus:border-primary focus:outline-none"
                  aria-label="Search projects"
                />
              </div>
            </div>
          </RevealOnScroll>
          
          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <RevealOnScroll key={project.id} delay={index * 0.1}>
                  <div className="group rounded-xl overflow-hidden border border-border bg-card/50 hover:bg-card transition-colors duration-300 h-full flex flex-col">
                    {/* Project Image */}
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={`${project.title} project screenshot`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Project Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {project.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 flex-grow">
                        {project.description}
                      </p>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Project Links */}
                      <div className="flex gap-4 mt-2">
                        <a 
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                          aria-label={`View ${project.title} source code on GitHub`}
                        >
                          <Github size={16} />
                          <span>Source</span>
                        </a>
                        
                        <a 
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                          aria-label={`Visit live ${project.title} site`}
                        >
                          <ExternalLink size={16} />
                          <span>Live Demo</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* More Projects */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <RevealOnScroll>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">More on GitHub</h2>
              <p className="text-muted-foreground mb-8">
                These are just some of my featured projects. Check out my GitHub for 
                more examples of my work, including smaller projects and contributions 
                to open source.
              </p>
              <Button asChild className="rounded-full" size="lg">
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  View My GitHub
                </a>
              </Button>
            </div>
          </RevealOnScroll>
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
                  Have a project in mind?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  I'm currently available for freelance work and full-time positions.
                  Let's discuss how I can help bring your ideas to life.
                </p>
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/contact">
                    Start a conversation
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
