import React from 'react';
import { Video, LogOut, User, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 px-4 sm:px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Video className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Metstack
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/create-meeting"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base"
            >
              Create Meeting
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}