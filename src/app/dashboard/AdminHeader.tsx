import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  ArrowRightOnRectangleIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import axios from "axios";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  onSearch?: (query: string) => void;
}

const AdminHeader: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, onSearch }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setName(res.data.data.name);
      } catch {
        setName("");
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:hidden"
              onClick={toggleSidebar}
            >
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts, categories..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 transition-all duration-200"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <button
              className="bg-gray-600 text-white px-4 py-2.5 rounded-xl font-medium"
              onClick={() => router.push("/dashboard/blog/create")}
            >
              <span className="hidden sm:inline">Create Post</span>
              <span className="sm:hidden">+</span>
            </button>

            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <UserCircleIcon className="h-6 w-6 text-gray-600" />
                <span className="hidden md:block text-sm font-medium text-gray-700">{name ? name : "Dashboard"}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    onClick={handleLogout}
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;