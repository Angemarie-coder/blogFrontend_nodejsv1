"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/header.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleHomeNavigation = (): void => {
    router.push("/");
    setIsMenuOpen(false);
  };

  const handleBlogNavigation = (): void => {
    router.push("/blog");
    setIsMenuOpen(false);
  };

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        Ange<span className="logo-accent">craft</span>
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
        <a href="/" onClick={handleHomeNavigation}>
          Home
        </a>
        <a href="#about" onClick={() => scrollToSection("about")}>
          About
        </a>
        <a href="#experience" onClick={() => scrollToSection("experience")}>
          Experience
        </a>
        <a href="/blog" onClick={handleBlogNavigation}>
          Blog
        </a>
        <a href="#projects" onClick={() => scrollToSection("projects")}>
          Projects
        </a>
        <a href="#contact" onClick={() => scrollToSection("contact")}>
          Contact
        </a>
        <a href="/login" onClick={() => setIsMenuOpen(false)} className="menu-auth-link">Login</a>
        <a href="/register" onClick={() => setIsMenuOpen(false)} className="menu-auth-link">Sign Up</a>
      </nav>
    </header>
  );
};

export default Header;