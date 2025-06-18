"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/app/dashboard/Sidebar";
import { 
  PencilIcon, 
  TrashIcon,
  CalendarDaysIcon,
  TagIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  HandThumbUpIcon,
  ChatBubbleLeftEllipsisIcon
} from "@heroicons/react/24/outline";

interface Post {
  id: number;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  body?: string;
  media?: {
    type: string;
    url: string;
  };
  author: {
    id: number;
  };
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

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>("http://localhost:5000/blog/user/posts", {
          params: { page: 1, limit: 10 },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        // Map the response to ensure only author.id is used
        const formattedPosts = response.data.data.posts.map(post => ({
          ...post,
          author: { id: post.author.id }
        }));
        setPosts(formattedPosts);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data?.message || "Failed to fetch posts");
          } else if (err.request) {
            setError("No response from server. Please try again later.");
          } else {
            setError("An error occurred while fetching posts.");
          }
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5000/blog/posts/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        setPosts(posts.filter((post) => post.id !== id));
      } catch (err: any) {
        console.error("Error deleting post:", err);
        if (axios.isAxiosError(err)) {
          if (err.response) {
            alert(err.response.data?.message || "Failed to delete post");
          } else if (err.request) {
            alert("No response from server. Please try again later.");
          } else {
            alert("An error occurred while deleting the post.");
          }
        } else {
          alert("An unexpected error occurred");
        }
      }
    }
  };

  const handleLike = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/blog/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      window.location.reload();
    } catch (err) {
      // handle error
    }
  };

  const handleComment = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/blog/posts/${id}/comment`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      window.location.reload();
    } catch (err) {
      // handle error
    }
  };

  const filteredPosts = posts.filter((post: Post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!filterCategory || post.category === filterCategory) &&
    (!filterStatus || post.status === filterStatus)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 lg:ml-72 p-6 lg:p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 lg:ml-72 p-6 lg:p-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 lg:ml-72">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
              </div>

              {/* Filters Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  <option value="Tech">Tech</option>
                  <option value="Development">Development</option>
                  <option value="Trends">Trends</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                >
                  <option value="">All Statuses</option>
                  <option value="posted">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
                >
                  {post.media?.url && (
                    <div className="relative h-48 rounded-t-2xl overflow-hidden">
                      <img
                        src={post.media.url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                        {post.title}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/dashboard/blog/edit/${post.id}`)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.body}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {post.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="flex items-center text-gray-500 text-xs">
                        <HandThumbUpIcon className="h-4 w-4 mr-1" /> {post.likes} Likes
                      </span>
                      <span className="flex items-center text-gray-500 text-xs">
                        <ChatBubbleLeftEllipsisIcon className="h-4 w-4 mr-1" /> {post.comments} Comments
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
                  <p className="text-gray-600 mb-4">No posts found matching your criteria</p>
                  <Link
                    href="/dashboard/blog/create"
                    className="inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create New Post
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}