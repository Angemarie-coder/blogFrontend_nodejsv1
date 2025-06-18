"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { EyeIcon, HandThumbUpIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import "@/styles/header.css";

interface Post {
  id: number;
  title: string;
  body: string;
  category: string;
  status: string;
  media?: { type: string; url: string };
  author: { id: number; name: string };
  likes: number;
  comments: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    count: number;
    totalPages: number;
  };
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>("http://localhost:5000/blog/posts", {
        params: { page: 1, limit: 10 },
      });
      if (response.data.success) {
        const postedPosts = response.data.data.posts
          .filter((post: Post) => post.status === "posted")
          .map((post) => ({
            ...post,
            author: { id: post.author.id, name: post.author.name },
          }));
        setPosts(postedPosts);
      } else {
        setError("Failed to fetch posts: Invalid response");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: number) => {
    router.push(`/blog/${id}`);
  };

  const handleLike = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/blog/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchPosts();
    } catch (err) {
      // handle error
    }
  };

  const handleComment = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/blog/posts/${id}/comment`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchPosts();
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="container mx-auto px-4 py-12 flex-1">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Latest Blog Posts
        </h2>
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center text-lg">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            No published posts available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                {post.media && (
                  <div className="h-56 overflow-hidden">
                    {post.media.type === "image" && (
                      <img
                        src={post.media.url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                    {post.media.type === "video" && (
                      <video
                        src={post.media.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                      />
                    )}
                    {post.media.type === "document" && (
                      <div className="h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          Document Preview
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      By {post.author.name}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.body.substring(0, 100)}... {/* Changed from content to body */}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <button onClick={() => handleLike(post.id)} className="flex items-center text-gray-600 hover:text-blue-600">
                      <HandThumbUpIcon className="h-5 w-5 mr-1" /> {post.likes}
                    </button>
                    <button onClick={() => handleComment(post.id)} className="flex items-center text-gray-600 hover:text-blue-600">
                      <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-1" /> {post.comments}
                    </button>
                  </div>
                  <button
                    onClick={() => handleView(post.id)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <EyeIcon className="h-5 w-5 mr-2" />
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogList;