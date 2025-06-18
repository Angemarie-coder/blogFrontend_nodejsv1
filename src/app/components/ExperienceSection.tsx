import React from "react";
import "../styles/experienceSection.css";
import experience from "../data/experience.json";

interface WorkExperience {
  position: string;
  company: string;
  location: string;
  duration: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  duration: string;
  details: string;
}

interface Internship {
  role: string;
  organization: string;
  location: string;
  duration: string;
  description: string;
}

interface Certification {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

interface ExperienceData {
  title: string;
  work_experience: WorkExperience[];
  education_background: Education[];
  internships_or_volunteer_work: Internship[];
  relevant_coursework_or_certifications: Certification[];
}

interface ExperienceJson {
  experience: ExperienceData;
}

const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        <h1 className="experience-title">
          {(experience as ExperienceJson).experience.title}
        </h1>
        <div className="experience-content">
          <div className="experience-item">
            <h2>Work Experience</h2>
            {(experience as ExperienceJson).experience.work_experience.map(
              (job, index) => (
                <div key={index} className="experience-entry">
                  <h3>{job.position}</h3>
                  <p className="entry-details">
                    {job.company} | {job.location} | {job.duration}
                  </p>
                  <ul>
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
          <div className="experience-item">
            <h2>Education</h2>
            {(experience as ExperienceJson).experience.education_background.map(
              (edu, index) => (
                <div key={index} className="experience-entry">
                  <h3>{edu.degree}</h3>
                  <p className="entry-details">
                    {edu.institution} | {edu.location} | {edu.duration}
                  </p>
                  <p>{edu.details}</p>
                </div>
              )
            )}
          </div>
          <div className="experience-item">
            <h2>Internships & Volunteer Work</h2>
            {(experience as ExperienceJson).experience.internships_or_volunteer_work.map(
              (intern, index) => (
                <div key={index} className="experience-entry">
                  <h3>{intern.role}</h3>
                  <p className="entry-details">
                    {intern.organization} | {intern.location} | {intern.duration}
                  </p>
                  <p>{intern.description}</p>
                </div>
              )
            )}
          </div>
          <div className="experience-item">
            <h2>Certifications & Coursework</h2>
            {(experience as ExperienceJson).experience.relevant_coursework_or_certifications.map(
              (cert, index) => (
                <div key={index} className="experience-entry">
                  <h3>{cert.title}</h3>
                  <p className="entry-details">
                    {cert.issuer} | {cert.date}
                  </p>
                  <p>{cert.description}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;