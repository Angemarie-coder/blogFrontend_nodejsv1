import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import ProjectSection from "@/app/components/ProjectSection";
import ExperienceSection from "@/app/components/ExperienceSection";
import ContactSection from "@/app/components/ContactSection";
import Newsletter from "@/app/components/Newsletter";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="app">
      <Header />
      <HeroSection />
      <AboutSection />
      <ProjectSection />
      <ExperienceSection />
      <ContactSection />
      <Newsletter />
      <Footer />
    </div>
  );
}