import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Github, Linkedin, Send } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useState } from "react";

export default function Contact() {
  const formId = import.meta.env.VITE_FORM_ID;
  const { toast } = useToast();
  const [state, submitForm] = useForm(formId);
  const [name, setName] = useState("");
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (state.succeeded) {
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
    } else if (state.errors && Object.keys(state.errors).length > 0) {
      fetch("/.netlify/functions/report-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: state.errors,
          data: submittedData,
        })
      });
    }
  }, [state.succeeded, state.errors, toast, submittedData]);



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const dataObj = Object.fromEntries(formData.entries());
    setSubmittedData(dataObj);
    await submitForm(formData);
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/artiomleo", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/artiomleo/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:artiomleo@gmail.com", label: "Email" },
  ];

  return (
    <div className="pt-24">
      <section className="section-padding">
        <div className="container">
          <RevealOnScroll>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10">
              I'm interested in freelance opportunities, full-time positions, and collaborations.
              If you have a project that needs coding or just want to connect, feel free to reach out!
            </p>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-10">
            <RevealOnScroll direction="right">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                  <p className="text-muted-foreground mb-6">
                    Feel free to reach out through any of these channels.
                    I'll get back to you as soon as possible.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <address className="text-muted-foreground not-italic">
                      Cluj-Napoca, RO
                    </address>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a href="mailto:hello@example.com" className="text-muted-foreground hover:text-primary transition-colors">
                      artiomleo@gmail.com
                    </a>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-3">Connect on Social</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-primary/10 transition-colors"
                      >
                        <link.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="md:col-span-2">
              {state.succeeded ? (
                <div className="bg-card/50 p-6 rounded-xl border border-border text-center">
                  <p className="text-xl font-medium">Thanks for reaching out!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 p-6 rounded-xl border border-border">
                  <h2 className="text-2xl font-bold mb-4">Send me a message</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        required
                        aria-required="true"
                        placeholder="Your name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Your Email <span className="text-primary">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        aria-required="true"
                        placeholder="your@email.com"
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message <span className="text-primary">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      aria-required="true"
                      placeholder="Hi, I'd like to talk about..."
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                  </div>

                  <Button type="submit" size="lg" disabled={state.submitting} className="w-full flex gap-2 items-center">
                    {state.submitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-t-2 border-r-2 border-primary-foreground rounded-full" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "What services do you offer?",
                answer: "I specialize in frontend development, building responsive web applications with modern frameworks like Vue.js, React, and Nuxt.js. I also offer UI/UX implementation, performance optimization, and accessibility audits.",
              },
              {
                question: "What is your typical project process?",
                answer: "I start with understanding your requirements and goals, then move to planning and architecture. Development follows an iterative approach with regular demos and feedback sessions, concluding with thorough testing and deployment.",
              },
              {
                question: "How do you handle project timelines and deadlines?",
                answer: "I provide realistic timelines based on project scope and complexity. I break down projects into milestones with buffer time for revisions, and maintain regular communication to ensure everything stays on track.",
              },
              {
                question: "Are you available for remote work?",
                answer: "Yes, I work remotely with clients worldwide. I'm comfortable with different time zones and use various collaboration tools to ensure smooth communication and project management.",
              },
            ].map((item, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
