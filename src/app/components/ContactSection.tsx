"use client";

import React, { useState } from "react";
import "../styles/contactSection.css";
import contact from "../data/contact.json";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  errorMessage: string;
}

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  validation: Validation;
}

interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
}

interface ProfessionalProfile {
  platform: string;
  url: string;
  icon: string;
}

interface Location {
  city: string;
  country: string;
}

interface ContactForm {
  submit: { text: string };
  fields: Field[];
}

interface ContactData {
  title: string;
  email: string;
  location: Location;
  social_media: SocialMedia[];
  professional_profiles: ProfessionalProfile[];
  contact_form: ContactForm;
}

interface ContactJson {
  contact: ContactData;
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): Partial<FormData> => {
    const newErrors: Partial<FormData> = {};
    (contact as ContactJson).contact.contact_form.fields.forEach((field) => {
      const { name, validation } = field;
      const value = formData[name as keyof FormData];

      if (validation.required && !value) {
        newErrors[name as keyof FormData] = validation.errorMessage;
      } else if (validation.minLength && value.length < validation.minLength) {
        newErrors[name as keyof FormData] = validation.errorMessage;
      } else if (validation.maxLength && value.length > validation.maxLength) {
        newErrors[name as keyof FormData] = validation.errorMessage;
      } else if (
        validation.pattern &&
        !new RegExp(validation.pattern).test(value)
      ) {
        newErrors[name as keyof FormData] = validation.errorMessage;
      }
    });
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Form submitted:", formData);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h1 className="contact-title">{(contact as ContactJson).contact.title}</h1>
        <div className="contact-content">
          <div className="contact-form">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              {(contact as ContactJson).contact.contact_form.fields.map(
                (field, index) => (
                  <div key={index} className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof FormData]}
                        onChange={handleInputChange}
                        className={errors[field.name as keyof FormData] ? "input-error" : ""}
                      />
                    ) : (
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof FormData]}
                        onChange={handleInputChange}
                        className={errors[field.name as keyof FormData] ? "input-error" : ""}
                      />
                    )}
                    {errors[field.name as keyof FormData] && (
                      <span className="error-message">
                        {errors[field.name as keyof FormData]}
                      </span>
                    )}
                  </div>
                )
              )}
              <button type="submit" className="submit-btn">
                {(contact as ContactJson).contact.contact_form.submit.text}
              </button>
            </form>
          </div>
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p className="contact-email">
              <strong>Email:</strong>{" "}
              <a href={`mailto:${(contact as ContactJson).contact.email}`}>
                {(contact as ContactJson).contact.email}
              </a>
            </p>
            <p className="contact-location">
              <strong>Location:</strong>{" "}
              {(contact as ContactJson).contact.location.city},{" "}
              {(contact as ContactJson).contact.location.country}
            </p>
            <div className="social-links">
              <h3>Social Media</h3>
              <div className="links-container">
                {(contact as ContactJson).contact.social_media.map(
                  (social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <img
                        src={social.icon}
                        alt={`${social.platform} Icon`}
                        className="social-icon"
                      />
                      {social.platform}
                    </a>
                  )
                )}
              </div>
            </div>
            <div className="professional-links">
              <h3>Professional Profiles</h3>
              <div className="links-container">
                {(contact as ContactJson).contact.professional_profiles.map(
                  (profile, index) => (
                    <a
                      key={index}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <img
                        src={profile.icon}
                        alt={`${profile.platform} Icon`}
                        className="social-icon"
                      />
                      {profile.platform}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;