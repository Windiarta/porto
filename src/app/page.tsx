import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Experience from "@/components/Experience";
import ChatbotFAB from "@/components/ChatbotFAB";
import SkillsTools from "@/components/SkillsTools";
import Education from "@/components/Education";
import FadeIn from "@/components/FadeIn";

export const revalidate = 0; // Disable caching for development

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="glow-primary" />
      <div className="glow-secondary" />

      <header className="px-6 md:px-10 py-4 sticky top-6 z-50 transition-all duration-300">
        <div className="max-w-3xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between">
          <div className="font-extrabold tracking-tight text-xl bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">W</div>
          <nav className="hidden md:flex gap-8 text-[13px] font-medium text-foreground/70 uppercase tracking-widest">
            <a href="#skills" className="hover:text-accent transition-colors duration-200">Capabilities</a>
            <a href="#portfolio" className="hover:text-accent transition-colors duration-200">Portfolio</a>
            <a href="#experience" className="hover:text-accent transition-colors duration-200">Experience</a>
            <a href="#contact" className="hover:text-accent transition-colors duration-200">Contact</a>
          </nav>
          <a href="mailto:windiarta.widjaja@gmail.com" className="px-4 py-1.5 rounded-full bg-foreground text-background text-xs font-bold hover:scale-105 transition-transform duration-200">HIRE ME</a>
        </div>
      </header>

      <main className="px-6 md:px-10 py-10 max-w-6xl mx-auto space-y-40">
        <Hero />
        <FadeIn><SkillsTools /></FadeIn>
        <FadeIn><Portfolio /></FadeIn>
        <FadeIn><Experience /></FadeIn>
        <FadeIn><Education /></FadeIn>

        <FadeIn className="text-center">
          <section id="contact" className="space-y-8 py-20 glass rounded-[2rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent-secondary to-accent" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Let&apos;s build something <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent italic">extraordinary</span> together.</h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              I&apos;m currently open to new opportunities and interesting collaborations.
              Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <a className="text-xl font-bold hover:text-accent transition-colors underline decoration-accent/30 underline-offset-8" href="mailto:windiarta.widjaja@gmail.com" target="_blank">Email</a>
              <a className="text-xl font-bold hover:text-accent-secondary transition-colors underline decoration-accent-secondary/30 underline-offset-8" href="https://www.linkedin.com/in/windiarta/" target="_blank">LinkedIn</a>
              <a className="text-xl font-bold hover:text-foreground/50 transition-colors underline decoration-foreground/20 underline-offset-8" href="https://github.com/windiarta" target="_blank">GitHub</a>
            </div>
          </section>
        </FadeIn>
      </main>

      <ChatbotFAB />

      <footer className="px-6 md:px-10 py-10 border-t mt-10">
        <div className="max-w-6xl mx-auto text-sm text-gray-500">© {new Date().getFullYear()} Windiarta. All rights reserved.</div>
      </footer>
    </div>
  );
}
