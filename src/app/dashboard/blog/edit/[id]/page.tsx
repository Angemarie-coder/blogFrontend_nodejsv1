"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/app/dashboard/Sidebar";

interface Media {
  type: "image" | "video" | "document";
  url: string;
}

interface Post {
  id: number;
  title: string;
  category: string;
  status: string;
  body: string;
  media?: Media;
}

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [formData, setFormData] = useState<Post | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/blog/posts/${resolvedParams.id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const postData = response.data.data;
        if (!postData) {
          throw new Error("Post not found");
        }

        setFormData({
          id: postData.id,
          title: postData.title || "",
          body: postData.body || "",
          category: postData.category || "Tech",
          status: postData.status || "draft",
          media: postData.media || undefined,
        });
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to fetch post" : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      // Validate status
      if (!["posted", "draft"].includes(formData.status)) {
        throw new Error("Invalid status value");
      }

      await axios.put(`http://localhost:5000/blog/posts/${resolvedParams.id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess("Post updated successfully!");
      setTimeout(() => {
        router.push("/admin/blog");
      }, 1500);
    } catch (err: any) {
      console.error("Error updating post:", err);
      setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to update post" : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (error || !formData) {
    return (
      <div className="min-h-screen flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 lg:ml-72 p-6 lg:p-8">
          <div className="text-center text-red-600">{error || "Post not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 lg:ml-72">
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
              <p className="text-gray-600">Update the details of your blog post</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl">{success}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                      placeholder="Enter post title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200 min-h-[200px]"
                      placeholder="Write your post content here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        disabled={submitting}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                      >
                        <option value="Tech">Tech</option>
                        <option value="Development">Development</option>
                        <option value="Trends">Trends</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        disabled={submitting}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                      >
                        <option value="draft">Draft</option>
                        <option value="posted">Published</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media URL</label>
                    <input
                      type="url"
                      value={formData.media?.url || ""}
                      onChange={(e) => {
                        const url = e.target.value;
                        if (url) {
                          const type = url.match(/\.(jpg|jpeg|png|gif)$/i)
                            ? "image"
                            : url.match(/\.(mp4|webm|ogg)$/i)
                            ? "video"
                            : "document";
                          setFormData({ ...formData, media: { type, url } });
                        } else {
                          setFormData({ ...formData, media: undefined });
                        }
                      }}
                      disabled={submitting}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
                      placeholder="Enter media URL (image, video, or document)"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Enter a direct URL to an image, video, or document.
                    </p>
                  </div>

                  {formData.media && (
                    <div className="mt-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        {formData.media.type === "image" && (
                          <img src={formData.media.url} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
                        )}
                        {formData.media.type === "video" && (
                          <video src={formData.media.url} controls className="max-h-48 rounded-lg mx-auto" />
                        )}
                        {formData.media.type === "document" && (
                          <div className="flex items-center justify-center space-x-2 text-blue-600">
                            <a href={formData.media.url} className="hover:underline">View Document</a>
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
                  onClick={() => router.push("/admin/blog")}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}