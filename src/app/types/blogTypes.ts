interface BlogMedia {
  image?: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  status: "posted" | "draft";
  date: string;
  media: BlogMedia;
  comments: number;
  likes: number;
}

type Blogs = BlogPost[];

export type { Blogs, BlogPost, BlogMedia };