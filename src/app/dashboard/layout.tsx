"use client";

import type { Metadata } from "next";
import AdminHeader from "@/app/dashboard/AdminHeader";
import AdminFooter from "@/app/dashboard/AdminFooter";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/app/dashboard/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(5);
  const hasRedirected = useRef(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  // Handle countdown and navigation
  useEffect(() => {
    if (isAuthenticated === false && !hasRedirected.current) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            hasRedirected.current = true;
            // Defer navigation 
            setTimeout(() => {
              router.push("/login");
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized UI during redirect for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-900/70 backdrop-blur-sm" />
        </div>

        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-4">You need to be logged in to access the admin panel.</p>
          <p className="text-gray-400 text-sm">Redirecting to login in {countdown} seconds...</p>
          <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition mt-4">Logout</button>
        </div>
      </div>
    );
  }

  // Render layout for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="transition-all duration-300 ease-in-out flex-1">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}