import React from "react";
import { HeartIcon } from "@heroicons/react/24/solid";

const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 py-6 px-6 lg:ml-72">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="flex items-center text-sm text-gray-600">
          <span>&copy; 2025 Admin Dashboard.</span>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;