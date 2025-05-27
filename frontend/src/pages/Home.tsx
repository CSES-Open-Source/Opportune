import React from "react";
import { FiBriefcase, FiLink } from "react-icons/fi";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import {
  LuBuilding2,
  LuUsers,
  LuCode,
  LuMessageSquare,
  LuFileText,
  LuCircleCheck,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { FaDiscord } from "react-icons/fa6";

const OpportuneLogo = "/assets/OpportuneLogo.png";

const Home: React.FC = () => {
  const features = [
    {
      icon: <LuBuilding2 className="w-8 h-8" />,
      title: "Companies Directory",
      description:
        "Browse top tech companies like Google, Meta, Apple, and more. Get insider insights and company-specific preparation tips.",
      color: "bg-blue-500",
    },
    {
      icon: <LuUsers className="w-8 h-8" />,
      title: "Alumni Network",
      description:
        "Connect with UCSD alumni working at your dream companies. Get mentorship and referrals from industry professionals.",
      color: "bg-purple-500",
    },
    {
      icon: <LuCode className="w-8 h-8" />,
      title: "LeetCode Practice",
      description:
        "Access curated coding problems from real interviews. Practice with company-specific question sets and difficulty levels.",
      color: "bg-green-500",
    },
    {
      icon: <LuMessageSquare className="w-8 h-8" />,
      title: "Interview Prep",
      description:
        "Get ready with behavioral questions, technical challenges, and real interview experiences from fellow students.",
      color: "bg-orange-500",
    },
    {
      icon: <LuFileText className="w-8 h-8" />,
      title: "Application Tracking",
      description:
        "Keep track of all your applications, deadlines, and interview stages in one organized dashboard.",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="h-screen overflow-auto bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <LuCircleCheck className="w-4 h-4 mr-2" />
              Trusted by many UCSD Students
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Gateway to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Dream Internships
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with UCSD alumni, practice coding interviews, and land
              internships at top tech companies. Everything you need for your
              career journey, all in one place.
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {
                "From company research to interview prep, we've got every aspect of your internship search covered."
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Internship?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join many UCSD students who have successfully secured internships at
            top tech companies. Your future career starts here.
          </p>
          <div className="flex flex-row gap-4 items-center justify-center">
            <Link
              to="/companies"
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Browse Companies
              <FiBriefcase className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link
              to="/connect"
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              View Alumni Directory
              <FiLink className="w-5 h-5 ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Logo and Main Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <img
                    src={OpportuneLogo}
                    className="w-7 h-7"
                    alt="Opportune Logo"
                  />
                </div>
                <span className="text-xl font-bold">Opportune</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering UCSD students to achieve their career goals through
                community-driven resources and connections.
              </p>
            </div>

            {/* CSES OpenSource Info */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold">Open Source Project</h3>
              <div className="text-gray-400 text-sm space-y-2">
                <p>
                  Developed by{" "}
                  <span className="text-white font-medium">
                    CSES OpenSource
                  </span>
                </p>
                <p>
                  An open source project made by UCSD students, for UCSD
                  students. Check out our{" "}
                  <a
                    className="underline text-blue-300 hover:text-blue-400"
                    href="https://github.com/CSES-Open-Source/Opportune"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Repo
                  </a>{" "}
                  to contribute!
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-semibold">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/ucsdcses"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/cses_ucsd"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a
                  href="https://github.com/CSES-Open-Source"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="w-6 h-6" />
                </a>
                <a
                  href="https://discord.com/invite/UkdACyy2h8"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Discord"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDiscord className="w-6 h-6" />
                </a>
                <a
                  href="https://linktr.ee/csesucsd"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Linktree"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiLinktree className="w-6 h-6" />
                </a>
                <a
                  href="https://csesucsd.com/"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="CSES Website"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-6 h-6 bg-gray-400 hover:bg-white transition-colors duration-200 rounded flex items-center justify-center text-xs font-bold text-gray-900">
                    CSE
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                <p>&copy; 2025 Opportune. All rights reserved.</p>
              </div>
              <div className="text-gray-400 text-sm">
                <p>Made with passion by UCSD students</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
