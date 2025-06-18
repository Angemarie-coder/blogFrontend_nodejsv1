"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { 
  ChartBarIcon, 
  DocumentTextIcon,
  HomeIcon,
  UsersIcon,
  CogIcon
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

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

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [postCount, setPostCount] = useState<number>(0); // Default to 0
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>("http://localhost:5000/blog/posts", {
          params: { page: 1, limit: 10 }
        });
        console.log("API Response:", response.data);
        const count = response.data.data.count || 0;
        console.log("Fetched Post Count:", count);
        setPostCount(count);
      } catch (err) {
        console.error("Error fetching post count:", err);
        setPostCount(0); // Fallback to 0 on error
      } finally {
        setLoading(false);
      }
    };

    fetchPostCount();
  }, []);

  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", href: "/dashboard", active: pathname === "/dashboard" },
    { 
      icon: DocumentTextIcon, 
      label: "My Blogs", 
      href: "/dashboard/blog", 
      active: pathname.startsWith("/dashboard/blog"), 
      count: postCount 
    },
    { icon: CogIcon, label: "Profile", href: "/dashboard/profile", active: pathname === "/dashboard/profile" }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white/90 backdrop-blur-md shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 border-r border-gray-200/50`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                item.active
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${item.active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && !loading && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.active 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                }`}>
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;