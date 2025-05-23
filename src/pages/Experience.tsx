
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Experience data
const experiences = [
  {
    id: 1,
    role: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    period: "2022 - Present",
    description: "Lead developer for the company's flagship product, managing a team of 4 developers. Implemented new features, improved performance, and mentored junior developers.",
    technologies: ["React", "TypeScript", "GraphQL", "Tailwind CSS"],
  },
  {
    id: 2,
    role: "Frontend Developer",
    company: "WebSolutions Ltd",
    period: "2020 - 2022",
    description: "Developed and maintained multiple client websites and web applications. Collaborated with designers to implement pixel-perfect UIs and improved site performance.",
    technologies: ["Vue.js", "JavaScript", "SCSS", "RESTful APIs"],
  },
  {
    id: 3,
    role: "UI Developer",
    company: "CreativeAgency",
    period: "2018 - 2020",
    description: "Transformed design mockups into responsive, interactive web interfaces. Worked directly with clients to implement feedback and ensure satisfaction.",
    technologies: ["HTML5", "CSS3", "JavaScript", "jQuery", "Bootstrap"],
  },
  {
    id: 4,
    role: "Junior Web Developer",
    company: "StartupHub",
    period: "2017 - 2018",
    description: "Assisted in developing web applications for early-stage startups. Gained experience in fast-paced environments and agile methodologies.",
    technologies: ["React", "JavaScript", "CSS", "Firebase"],
  },
];

export default function Experience() {
  return (
    <div className="pt-24">
      {/* Experience Header */}
      <section className="section-padding">
        <div className="container">
          <RevealOnScroll>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Work Experience</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10">
              Throughout my career, I've had the opportunity to work on a variety of 
              projects across different industries. Here's a look at my professional journey.
            </p>
          </RevealOnScroll>
          
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />
            
            {/* Experience items */}
            {experiences.map((exp, index) => (
              <RevealOnScroll 
                key={exp.id}
                direction={index % 2 === 0 ? "right" : "left"}
                delay={index * 0.1}
              >
                <div className={`md:grid md:grid-cols-2 mb-16 ${
                  index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                }`}>
                  {/* Content that alternates sides on desktop */}
                  <div className={`${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12 md:col-start-2"}`}>
                    <div className="flex items-center gap-2 text-primary mb-2 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.period}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">{exp.role}</h2>
                    <h3 className="text-xl text-muted-foreground mb-4">{exp.company}</h3>
                    
                    <p className="mb-4">{exp.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {exp.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Timeline dot - visible on all screen sizes */}
                  <div className={`absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 hidden md:block ${
                    index % 2 === 0 ? "md:translate-y-8" : "md:translate-y-8"
                  }`} />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
      
      {/* Additional Experience */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold mb-10 text-center">Additional Experience</h2>
          </RevealOnScroll>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Freelance Projects */}
            <RevealOnScroll delay={0.1}>
              <div className="bg-card rounded-xl p-6 border border-border h-full">
                <h3 className="text-xl font-bold mb-4">Freelance Projects</h3>
                <p className="text-muted-foreground mb-4">
                  Worked with various clients on a contract basis to deliver custom web solutions,
                  including e-commerce sites, blogs, and landing pages.
                </p>
                <p className="font-medium">2016 - Present</p>
              </div>
            </RevealOnScroll>
            
            {/* Open Source */}
            <RevealOnScroll delay={0.2}>
              <div className="bg-card rounded-xl p-6 border border-border h-full">
                <h3 className="text-xl font-bold mb-4">Open Source Contributions</h3>
                <p className="text-muted-foreground mb-4">
                  Active contributor to several open-source projects, including UI component libraries,
                  documentation improvements, and accessibility fixes.
                </p>
                <p className="font-medium">2018 - Present</p>
              </div>
            </RevealOnScroll>
            
            {/* Speaking */}
            <RevealOnScroll delay={0.3}>
              <div className="bg-card rounded-xl p-6 border border-border h-full">
                <h3 className="text-xl font-bold mb-4">Conference Speaking</h3>
                <p className="text-muted-foreground mb-4">
                  Presented talks at local tech meetups and conferences on topics including frontend
                  architecture, accessibility, and developer productivity.
                </p>
                <p className="font-medium">2019 - Present</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="section-padding">
        <div className="container">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold mb-10 text-center">My Skills</h2>
          </RevealOnScroll>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "JavaScript", "TypeScript", "React", "Vue.js", 
              "Next.js", "HTML5", "CSS3", "SCSS", 
              "Tailwind CSS", "Responsive Design", "RESTful APIs", "GraphQL", 
              "Git", "CI/CD", "Accessibility", "Performance Optimization"
            ].map((skill, index) => (
              <RevealOnScroll key={skill} delay={index * 0.05}>
                <div className="bg-card/50 border border-border rounded-lg p-4 text-center hover:bg-card hover:border-primary/50 transition-all duration-300">
                  <span className="font-medium">{skill}</span>
                </div>
              </RevealOnScroll>
            ))}
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
                  Interested in working together?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  I'm always open to discussing new projects, creative ideas, or
                  opportunities to be part of your team.
                </p>
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/contact">
                    Let's connect
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
