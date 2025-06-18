"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/dashboard/Sidebar";

interface Media {
  type: "image" | "video" | "document";
  url: string;
}

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Tech");
  const [status, setStatus] = useState("posted");
  const [media, setMedia] = useState<Media | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Get token from localStorage (or your auth mechanism)
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to create a post");
      }

      // Validate status
      if (status !== "posted" && status !== "draft") {
        throw new Error("Invalid status value");
      }

      // Prepare payload
      const payload = {
        title,
        body,
        category,
        status,
        media,
      };

      // Send POST request to /posts
      const response = await fetch("http://localhost:5000/blog/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      setSuccess("Post created successfully!");
      setTimeout(() => {
        router.push("/dashboard/blog");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 lg:ml-72">
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
              <p className="text-gray-600">Fill in the details below to create a new blog post</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                      placeholder="Enter post title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 min-h-[200px]"
                      placeholder="Write your post content here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                      >
                        <option value="Tech">Tech</option>
                        <option value="Development">Development</option>
                        <option value="Trends">Trends</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                      >
                        <option value="draft">Draft</option>
                        <option value="posted">Published</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Media URL
                    </label>
                    <input
                      type="url"
                      value={media?.url || ""}
                      onChange={(e) => {
                        const url = e.target.value;
                        if (url) {
                          const type = url.match(/\.(jpg|jpeg|png|gif)$/i) ? "image" :
                                     url.match(/\.(mp4|webm|ogg)$/i) ? "video" : "document";
                          setMedia({ type, url });
                        } else {
                          setMedia(null);
                        }
                      }}
                      disabled={loading}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                      placeholder="Enter media URL (image, video, or document)"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Enter a direct URL to an image, video, or document.
                    </p>
                  </div>

                  {media && (
                    <div className="mt-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        {media.type === "image" && (
                          <img src={media.url} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
                        )}
                        {media.type === "video" && (
                          <video src={media.url} controls className="max-h-48 rounded-lg mx-auto" />
                        )}
                        {media.type === "document" && (
                          <div className="flex items-center justify-center space-x-2 text-blue-600">
                            <a href={media.url} className="hover:underline">View Document</a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/blog")}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;