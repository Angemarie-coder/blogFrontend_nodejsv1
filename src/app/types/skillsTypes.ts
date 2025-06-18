interface SkillCategory {
  category: string;
  items: string[];
}

interface Skills {
  title: string;
  categories: SkillCategory[];
}

export type { Skills, SkillCategory };