"use client";

import React from "react";
import "../styles/heroSection.css";
import personalInfo from "../data/personalInfo.json";

interface HeroPhoto {
  src: string;
  alt: string;
}

interface CtaButton {
  text: string;
  link: string;
}

interface HeroData {
  name: string;
  professional_title: string;
  tagline: string;
  photo: HeroPhoto;
  cta_button: CtaButton;
}

interface PersonalInfo {
  hero: HeroData;
}

const HeroSection: React.FC = () => {
  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>{(personalInfo as PersonalInfo).hero.name}</h1>
            <h2>{(personalInfo as PersonalInfo).hero.professional_title}</h2>
            <p>{(personalInfo as PersonalInfo).hero.tagline}</p>
            <button
              className="get-started-btn"
              onClick={() =>
                scrollToSection((personalInfo as PersonalInfo).hero.cta_button.link)
              }
            >
              {(personalInfo as PersonalInfo).hero.cta_button.text}
            </button>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <img
                src={(personalInfo as PersonalInfo).hero.photo.src}
                alt={(personalInfo as PersonalInfo).hero.photo.alt}
                className="hero-person-image"
              />
              <div className="floating-elements">
                <div className="element element-1">📧</div>
                <div className="element element-2">💬</div>
                <div className="element element-3">⭐</div>
                <div className="element element-4">📊</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;