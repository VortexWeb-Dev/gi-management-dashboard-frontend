// components/Sidebar.jsx
import React from "react";
import {
  Gauge,
  Handshake,
  Clock,
  Users,
  Trophy,
  X,
  Menu
} from "lucide-react"; 

import { useLocation } from "react-router-dom";


const sidebarLinks = [
  {
    icon: <Gauge size={24} />,
    text: "Management Dashboard",
    href: "/dashboard",
  },
  {
    icon: <Handshake size={24} />,
    text: "Overall Deals",
    href: "/deals",
  },
  {
    icon: <Clock size={24} />,
    text: "Agent Last Transaction",
    href: "/transactions",
  },
  {
    icon: <Users size={24} />,
    text: "Team",
    href: "/team",
  },
  {
    icon: <Trophy size={24} />,
    text: "Agent Ranking",
    href: "/ranking",
  },
];

const SidebarItem = ({ icon, text, href, isOpen, isActive }) => {
  return (
    <a
      href={href}
      className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-lg transition-colors duration-200 group
      ${isActive
        ? "bg-blue-100 text-blue-600 dark:bg-blue-700 dark:text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-700"
      }`}
    >
      <span className="flex items-center justify-center text-blue-600 dark:text-blue-400">
        {icon}
      </span>
      {isOpen && (
        <span className="ml-3 font-medium transition-opacity duration-200">
          {text}
        </span>
      )}
    </a>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  return (
    <div
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } flex flex-col`}
    >
      <div className="py-6 px-4 flex items-center justify-between">
        {isOpen ? (
          <>
            <h2 className="text-xl font-semibold tracking-tight text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-xl shadow-sm ring-1 ring-blue-100 dark:ring-blue-800">
               Management
            </h2>

            <button
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              aria-label="Collapse sidebar"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className="w-full flex justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            aria-label="Expand sidebar"
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      <div className="flex-1 px-2 py-4 space-y-1">
        {sidebarLinks.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            text={item.text}
            href={item.href}
            isOpen={isOpen}
            isActive={location.pathname === item.href}
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Dashboard v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
