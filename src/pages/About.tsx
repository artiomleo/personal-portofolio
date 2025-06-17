
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";

// Tech stack logos - in a real app, these would be imported from files
const techStack = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { name: "GraphQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
];

export default function About() {
  return (
    <div className="pt-24">
      {/* About Hero */}
      <section className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <RevealOnScroll direction="right">
              <div className="relative">
                <div className="relative z-10 rounded-2xl overflow-hidden aspect-square">
                  <img 
                    src="/portrait.jpg" 
                    alt="Artiom Leontiev, Frontend Developer"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-primary rounded-2xl" />
                <div className="absolute -z-10 bottom-10 -left-10 w-20 h-20 rounded-full bg-secondary/30 blur-xl" />
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll>
              <span className="text-primary font-medium mb-2 block">About Me</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Frontend Developer based in New York City
              </h1>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Hi there! I'm John, a passionate 29-year-old Frontend Developer with 
                  over 5 years of experience creating beautiful, accessible, and user-friendly websites 
                  and applications.
                </p>
                <p>
                  I specialize in translating design concepts into responsive, interactive interfaces 
                  that provide exceptional user experiences across all devices. My approach combines 
                  technical expertise with an eye for design and a deep understanding of user needs.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new coffee shops, hiking in upstate New York, 
                  or contributing to open-source projects.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/contact">
                    Get in touch <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <a href="https://drive.google.com/file/d/1mfCKTsZ6tDHk7Td8VvAKuy1Ct9NsHG6t/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                <Button variant="link" size="lg" className="rounded-full gap-2">
                  <Download className="w-4 h-4" /> Download Resume
                </Button>
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
      
      {/* Tech Stack */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold mb-2 text-center">Technologies I Use</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              I work with a range of modern technologies to create efficient, 
              scalable, and maintainable web applications.
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
              {techStack.map((tech, index) => (
                <div 
                  key={tech.name}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-card rounded-xl flex items-center justify-center p-4 border border-border transition-transform duration-300 group-hover:scale-110 group-hover:border-primary/50">
                    <img 
                      src={tech.icon} 
                      alt={`${tech.name} logo`} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <span className="font-medium text-sm">{tech.name}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>
      
      {/* Skills & Tools */}
      <section className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Skills */}
            <RevealOnScroll direction="right">
              <div>
                <span className="text-primary font-medium mb-2 block">Skills</span>
                <h2 className="text-3xl font-bold mb-6">What I Can Do</h2>
                
                <ul className="space-y-4">
                  {[
                    {
                      title: "Frontend Development",
                      description: "Building responsive, accessible, and performant web applications using modern frameworks."
                    },
                    {
                      title: "UI/UX Implementation",
                      description: "Transforming design mockups into pixel-perfect interfaces with smooth interactions."
                    },
                    {
                      title: "State Management",
                      description: "Implementing efficient state management solutions for complex applications."
                    },
                    {
                      title: "API Integration",
                      description: "Connecting frontend applications with RESTful APIs and GraphQL endpoints."
                    },
                    {
                      title: "Responsive Design",
                      description: "Creating websites that work beautifully across all devices and screen sizes."
                    }
                  ].map((skill, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="mt-1 w-4 h-4 rounded-full bg-primary/20 border border-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg">{skill.title}</h3>
                        <p className="text-muted-foreground">{skill.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
            
            {/* Education & Certifications */}
            <RevealOnScroll direction="left">
              <div>
                <span className="text-primary font-medium mb-2 block">Education & Certifications</span>
                <h2 className="text-3xl font-bold mb-6">My Background</h2>
                
                <div className="space-y-6">
                  <div className="border-l-2 border-primary/30 pl-6 relative">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary" />
                    <h3 className="font-semibold text-lg">B.S. in Computer Science</h3>
                    <p className="text-muted-foreground">New York University, 2018</p>
                    <p className="mt-2">Specialized in Human-Computer Interaction and Web Technologies</p>
                  </div>
                  
                  <div className="border-l-2 border-primary/30 pl-6 relative">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary" />
                    <h3 className="font-semibold text-lg">Frontend Development Certification</h3>
                    <p className="text-muted-foreground">Frontend Masters, 2020</p>
                    <p className="mt-2">Advanced course on modern frontend frameworks and practices</p>
                  </div>
                  
                  <div className="border-l-2 border-primary/30 pl-6 relative">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary" />
                    <h3 className="font-semibold text-lg">Accessibility Certification</h3>
                    <p className="text-muted-foreground">W3C / edX, 2021</p>
                    <p className="mt-2">Comprehensive training on creating accessible web applications</p>
                  </div>
                </div>
              </div>
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
                  Let's build something amazing together
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Whether you're looking for a frontend developer for your next project
                  or just want to connect, I'd love to hear from you.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="rounded-full">
                    <Link to="/contact">
                      Contact me
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full">
                    <Link to="/projects">
                      See my work
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
