
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";

// Tech stack logos - in a real app, these would be imported from files
const techStack = [
  { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" },
  { name: "Vitest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitest/vitest-original.svg" },
  { name: "Nuxt.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Vuetify", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuetify/vuetify-original.svg" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original-wordmark.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Gulp", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gulp/gulp-plain.svg" },
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
                    src="/images/portrait.jpg"
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
                Frontend Developer based in Cluj-Napoca
              </h1>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Hi there! I'm Artiom, a Frontend Developer with over 6 years of experience crafting beautiful, accessible, and user-friendly websites and applications.
                </p>
                <p>
                  I specialize in turning design concepts into responsive, interactive interfaces that deliver outstanding user experiences on any device. My work blends technical expertise with a strong sense of design and a deep understanding of user needs.
                </p>
                <p>
                  Outside of coding, I enjoy exploring new places, hiking in the mountains, and contributing to open-source projects.
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
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12">
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
                      description: "Building responsive, accessible, and performant web applications using Vue.js, Nuxt, Vite, and Tailwind."
                    },
                    {
                      title: "UI/UX Implementation",
                      description: "Transforming Figma and other design mockups into pixel-perfect interfaces with smooth interactions, adhering to WCAG 2.1 AA accessibility standards."
                    },
                    {
                      title: "State Management",
                      description: "Implementing efficient state management solutions using Pinia and Vuex for scalable and maintainable applications."
                    },
                    {
                      title: "API Integration",
                      description: "Connecting frontend applications with RESTful APIs, and third-party services such as Azure ADB2C, Stripe, and Mapbox."
                    },
                    {
                      title: "Microfrontend Architecture",
                      description: "Designing and implementing modular and scalable microfrontend architectures, enabling independent deployments and maintainable codebases."
                    },
                    {
                      title: "Performance & Accessibility",
                      description: "Optimizing application performance for faster load times (e.g. Vite over Webpack) and ensuring accessibility through ARIA roles, keyboard navigation, and screen reader support."
                    },
                    {
                      title: "Team Leadership & Mentoring",
                      description: "Leading teams of developers, conducting code reviews, facilitating technical meetings, and making technology decisions to ensure high code quality and technical alignment."
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
                    <h3 className="font-semibold text-lg">Bachelor of Engineering, Automation and Computer Science</h3>
                    <p className="text-muted-foreground">Technical University of Cluj Napoca, 2015 - 2019</p>
                    <p className="mt-2">Focused on software engineering principles, automation systems, and computer science fundamentals</p>
                  </div>

                  <div className="border-l-2 border-primary/30 pl-6 relative">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary" />
                    <h3 className="font-semibold text-lg">Microfrontend Architecture & Modern Frontend Development</h3>
                    <p className="text-muted-foreground">Professional Experience, 2019 - Present</p>
                    <p className="mt-2">Hands-on expertise with Vue.js 3, Vite, Pinia, and scalable microfrontend systems for enterprise applications</p>
                  </div>

                  <div className="border-l-2 border-primary/30 pl-6 relative">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary" />
                    <h3 className="font-semibold text-lg">Accessibility & Performance Optimization</h3>
                    <p className="text-muted-foreground">Self-study & Project Implementation, 2020 - Present</p>
                    <p className="mt-2">Specialized in building WCAG 2.1 AA compliant applications, performance tuning, and SEO best practices</p>
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
