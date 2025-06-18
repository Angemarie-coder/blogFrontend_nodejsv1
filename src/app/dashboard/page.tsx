"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/app/dashboard/Sidebar";
import { 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
  UserIcon,
  DocumentTextIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

interface Post {
  id: number;
  title: string;
  body: string;
  category: string;
  status: string;
  media?: { type: string; url: string };
  author: { id: number; name: string };
  createdAt: string;
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

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
  color?: "gray";
}

const AdminDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({ totalBlogs: 0, totalLikes: 0, totalComments: 0 });
  const [period, setPeriod] = useState("monthly");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [period]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>("http://localhost:5000/blog/posts", {
        params: { page: 1, limit: 10 }
      });
      console.log("API Response:", response.data);
      if (response.data.success) {
        const fetchedPosts = response.data.data.posts.map(post => ({
          ...post,
          author: { id: post.author.id, name: post.author.name } 
        }));
        setPosts(fetchedPosts);
      } else {
        setError("Failed to fetch posts: Invalid response");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/blog/user/stats?period=${period}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setStats(res.data.data);
    } catch (err) {
      // handle error
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/blog/edit/${id}`); 
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5000/blog/posts/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        fetchPosts(); // Refresh posts after deletion
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post");
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "gray" }: StatCardProps) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${
          color === "gray" ? "from-gray-500 to-gray-600" : "from-gray-500 to-gray-600"
        }`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 lg:ml-72">
        <div className="p-6 lg:p-8 space-y-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your Dashboard!</h1>
          </div>

          {/* Analytics Section */}
          <section id="analytics">
            <div className="mb-4 flex gap-4 items-center">
              <label className="font-medium">Stats Period:</label>
              <select value={period} onChange={e => setPeriod(e.target.value)} className="border rounded px-2 py-1">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Blogs" value={stats.totalBlogs} icon={DocumentTextIcon} color="gray" />
              <StatCard title="Total Likes" value={stats.totalLikes} icon={EyeIcon} color="gray" />
              <StatCard title="Total Comments" value={stats.totalComments} icon={ClockIcon} color="gray" />
            </div>
          </section>

          {/* Recent Posts Section */}
          <section id="posts">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50/80">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                                  {post.title}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {post.body?.substring(0, 50)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {post.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              post.status === "posted"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{post.author.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarDaysIcon className="h-4 w-4 mr-1" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                onClick={() => handleEdit(post.id)}
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200"
                                title="View"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                onClick={() => handleDelete(post.id)}
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {posts.length === 0 && !loading && !error && (
                <div className="p-8 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No posts found</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;