// components/Profile.jsx
import React from "react";
import { useEffect,useRef } from "react";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  X,
} from "lucide-react";

const ProfileInfo = ({ icon, label, value }) => {
  return (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 mt-1 text-blue-500 dark:text-blue-400">
        {icon}
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {value}
        </p>
      </div>
    </div>
  );
};

const SocialLink = ({ icon, href, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

const Profile = ({ onClose }) => {
    const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-end p-4">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header Background */}
          {/* <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-lg"> AGHALI</div> */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-lg flex items-center justify-center">
            <h1 className="text-white text-5xl font-bold tracking-wide drop-shadow-lg">
              AGENT
            </h1>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          {/* Profile Image */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: "110px" }}
          >
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src="corporate_girlie.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 px-6 pb-6">
          {/* Name and Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Alexandra Johnson
            </h2>
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              Senior Sales Executive
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-3 mb-6">
            <SocialLink
              icon={<Linkedin size={18} />}
              href="#"
              label="LinkedIn"
            />
            <SocialLink icon={<Twitter size={18} />} href="#" label="Twitter" />
            <SocialLink icon={<Github size={18} />} href="#" label="GitHub" />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

          {/* Profile Information */}
          <div className="space-y-2">
            <ProfileInfo
              icon={<Briefcase size={18} />}
              label="Company"
              value="TechSolutions Inc."
            />
            <ProfileInfo
              icon={<Calendar size={18} />}
              label="Experience"
              value="7 years"
            />
            <ProfileInfo
              icon={<Mail size={18} />}
              label="Email"
              value="alexandra.j@techsolutions.com"
            />
            <ProfileInfo
              icon={<Phone size={18} />}
              label="Phone"
              value="+1 (555) 123-4567"
            />
            <ProfileInfo
              icon={<MapPin size={18} />}
              label="Location"
              value="San Francisco, CA"
            />
          </div>

          {/* Bio */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              About
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Experienced sales professional with expertise in SaaS solutions
              and enterprise client management. Consistently exceeding quarterly
              targets and specializing in building long-term client
              relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
