import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Experience from "@/components/Experience";
import ChatbotFAB from "@/components/ChatbotFAB";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Tools from "@/components/Tools";

export const revalidate = 0; // Disable caching for development

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-white text-black">
      <header className="px-6 md:px-10 py-6 sticky top-0 bg-white/70 backdrop-blur border-b z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-extrabold tracking-tight text-xl">Windiarta</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#skills" className="hover:underline transition-transform duration-200 hover:-translate-y-0.5">Skills</a>
            <a href="#tools" className="hover:underline transition-transform duration-200 hover:-translate-y-0.5">Tools</a>
            <a href="#portfolio" className="hover:underline transition-transform duration-200 hover:-translate-y-0.5">Portfolio</a>
            <a href="#experience" className="hover:underline transition-transform duration-200 hover:-translate-y-0.5">Experience</a>
            <a href="#education" className="hover:underline transition-transform duration-200 hover:-translate-y-0.5">Education</a>
            <a href="#contact" className="hover:underline transition-transform duration-200 hover:-translate-y-0.5">Contact</a>
          </nav>
        </div>
      </header>

      <main className="px-6 md:px-10 py-10 max-w-6xl mx-auto space-y-20">
        <Hero />
        <Skills />
        <Tools />
        <Portfolio />
        <Experience />
        <Education />

        <section id="contact" className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Contact</h2>
          <p className="text-gray-600">Open to collaborations and opportunities. Reach me via email: <a className="underline transition-colors duration-200 hover:text-black" href="mailto:windiarta.widjaja@gmail.com">windiarta.widjaja@gmail.com</a></p>
        </section>
      </main>

      <ChatbotFAB />

      <footer className="px-6 md:px-10 py-10 border-t mt-10">
        <div className="max-w-6xl mx-auto text-sm text-gray-500">© {new Date().getFullYear()} Windiarta. All rights reserved.</div>
      </footer>
    </div>
  );
}
