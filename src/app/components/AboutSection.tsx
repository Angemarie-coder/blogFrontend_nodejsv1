import React from "react";
import "../styles/aboutSection.css";
import personalInfo from "../data/personalInfo.json";

interface TechnologyItem {
  category: string;
  items: string[];
}

interface AboutSection {
  title: string;
  personal_introduction: {
    description: string;
  };
  background_and_interests: {
    description: string;
  };
  skills_and_technologies: {
    description: string;
    technologies: TechnologyItem[];
  };
  unique_qualities: {
    description: string;
    likes: string;
  };
}

interface PersonalInfo {
  about: AboutSection;
}

const AboutSection: React.FC = () => {
  const data = personalInfo as PersonalInfo;

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h1 className="about-title">{data.about.title}</h1>
        <div className="about-content">
          <div className="about-item">
            <h2>Introduction</h2>
            <p>{data.about.personal_introduction.description}</p>
          </div>
          <div className="about-item">
            <h2>Background & Interests</h2>
            <p>{data.about.background_and_interests.description}</p>
          </div>
          <div className="about-item">
            <h2>Skills & Technologies</h2>
            <p>{data.about.skills_and_technologies.description}</p>
            <div className="skills-list">
              {data.about.skills_and_technologies.technologies.map(
                (tech: TechnologyItem, index: number) => (
                  <div key={index} className="skill-category">
                    <h3>{tech.category}</h3>
                    <ul>
                      {tech.items.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="about-item">
            <h2>Unique Qualities</h2>
            <p>{data.about.unique_qualities.description}</p>
            <p>{data.about.unique_qualities.likes}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;