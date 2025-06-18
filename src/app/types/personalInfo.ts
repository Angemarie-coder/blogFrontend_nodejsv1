declare module '@/data/personalInfo.json' {
  interface PersonalInfo {
    hero: {
      name: string;
      professional_title: string;
      tagline: string;
      photo: {
        src: string;
        alt: string;
      };
      cta_button: {
        text: string;
        link: string;
      };
    };
    about: {
      title: string;
      personal_introduction: {
        description: string;
      };
      background_and_interests: {
        description: string;
      };
      skills_and_technologies: {
        description: string;
        technologies: Array<{
          category: string;
          items: string[];
        }>;
      };
      unique_qualities: {
        description: string;
        likes: string;
      };
    };
  }
  const value: PersonalInfo;
  export default value;
}