import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  ChevronDown, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Home as HomeIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isLoggedIn, login, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80",
    notificationCount: 3
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const questionsData = [
    {
      id: 1,
      title: "How to join 2 columns in a data set to make a separate column in SQL",
      description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine...",
      username: "JohnDoe",
      tags: ["SQL", "Database"],
      answers: 5,
      timeAgo: "2 hours ago",
      votes: 12,
      isAnswered: true,
      createdAt: new Date("2024-01-15T10:00:00Z")
    },
    {
      id: 2,
      title: "Best practices for React component optimization",
      description: "I'm working on a large React application and noticed performance issues. What are the most effective ways to optimize React components for better performance?",
      username: "ReactDev",
      tags: ["React", "Performance"],
      answers: 3,
      timeAgo: "4 hours ago",
      votes: 8,
      isAnswered: true,
      createdAt: new Date("2024-01-15T08:00:00Z")
    },
    {
      id: 3,
      title: "Understanding JavaScript closures with practical examples",
      description: "Can someone explain JavaScript closures in simple terms with real-world examples? I've read the documentation but still struggling to understand the concept...",
      username: "JSLearner",
      tags: ["JavaScript", "Closures"],
      answers: 2,
      timeAgo: "6 hours ago",
      votes: 15,
      isAnswered: true,
      createdAt: new Date("2024-01-15T06:00:00Z")
    },
    {
      id: 4,
      title: "How to implement authentication in Next.js 14?",
      description: "I'm building a web application with Next.js 14 and need to implement user authentication. What's the best approach for handling login/logout functionality?",
      username: "NextJSUser",
      tags: ["Next.js", "Authentication"],
      answers: 0,
      timeAgo: "8 hours ago",
      votes: 3,
      isAnswered: false,
      createdAt: new Date("2024-01-15T04:00:00Z")
    },
    {
      id: 5,
      title: "Python list comprehension vs for loops performance",
      description: "Which is more efficient: list comprehensions or traditional for loops in Python? I'm working with large datasets and need to optimize my code.",
      username: "PythonDev",
      tags: ["Python", "Performance"],
      answers: 0,
      timeAgo: "10 hours ago",
      votes: 7,
      isAnswered: false,
      createdAt: new Date("2024-01-15T02:00:00Z")
    },
    {
      id: 6,
      title: "CSS Grid vs Flexbox: When to use which?",
      description: "I'm confused about when to use CSS Grid versus Flexbox. Can someone explain the key differences and use cases for each?",
      username: "CSSNewbie",
      tags: ["CSS", "Layout"],
      answers: 4,
      timeAgo: "12 hours ago",
      votes: 20,
      isAnswered: true,
      createdAt: new Date("2024-01-14T22:00:00Z")
    }
  ];

  const filterOptions = ["Newest", "Unanswered", "Most Voted", "Active"];
  const questionsPerPage = 3;

  // Filter and sort questions based on selected filter and search query
  const filteredQuestions = useMemo(() => {
    let filtered = questionsData.filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });

    // Apply filter logic
    switch (selectedFilter) {
      case "Newest":
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "Unanswered":
        filtered = filtered.filter(q => !q.isAnswered);
        break;
      case "Most Voted":
        filtered = filtered.sort((a, b) => b.votes - a.votes);
        break;
      case "Active":
        filtered = filtered.sort((a, b) => b.answers - a.answers);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    logout();
  };

  const handleAskQuestion = () => {
    navigate("/ask");
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More complex pagination logic for many pages
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">StackIt</h1>
          <div className="flex items-center gap-4">
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* Notification Icon */}
                <div className="relative">
                  <button
                    onClick={() => alert("Notifications")}
                    className="p-2 text-gray-400 hover:text-white transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {user.notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {user.notificationCount}
                      </span>
                    )}
                  </button>
                </div>
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-600 hover:border-gray-400 transition-colors focus:outline-none focus:border-blue-400"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </button>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-700">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-white font-medium text-sm">{user.name}</p>
                              <p className="text-gray-400 text-xs">View Profile</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate("/profile")}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <button
                          onClick={logout}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={()=>{navigate("/login")}}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-full border border-gray-600 transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Action Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          {/* Search bar and menu button row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-600 transition-colors cursor-pointer flex items-center gap-2 text-sm"
              >
                <Menu className="w-4 h-4" />
              </button>
              {filterOpen && (
                <div className="absolute top-full right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 min-w-32">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedFilter(option);
                        setFilterOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Ask new question button row */}
          <div>
            <button 
              onClick={handleAskQuestion}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm"
            >
              Ask New Question
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAskQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-base"
            >
              Ask New Question
            </button>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 text-base"
              >
                {selectedFilter}
                <ChevronDown className="w-4 h-4" />
              </button>
              {filterOpen && (
                <div className="absolute top-full left-0 mt-1 text-white bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 min-w-full">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedFilter(option);
                        setFilterOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors cursor-pointer whitespace-nowrap text-base"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 lg:w-80 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
            <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-gray-900 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 min-h-lvh">
        {/* Results info */}
        <div className="mb-4">
          <p className="text-gray-400 text-sm">
            {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        <div className="space-y-4">
          {currentQuestions.length > 0 ? (
            currentQuestions.map((question) => (
              <div
                key={question.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:bg-gray-750 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-base sm:text-lg font-semibold text-white mb-2 cursor-pointer hover:text-blue-400 transition-colors break-words"
                      onClick={() => handleQuestionClick(question.id)}
                    >
                      {question.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 break-words">
                      {question.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {question.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <span className="text-gray-500">
                          by {question.username}
                        </span>
                        <span className="text-gray-500">
                          {question.timeAgo}
                        </span>
                        <span className="text-gray-500">
                          {question.votes} votes
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 self-start sm:self-auto">
                    <div className={`border rounded-lg px-3 py-1 text-center min-w-16 ${
                      question.isAnswered 
                        ? 'bg-green-700 border-green-600' 
                        : 'bg-gray-700 border-gray-600'
                    }`}>
                      <div className="text-white font-semibold text-sm sm:text-base">
                        {question.answers}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {question.answers === 1 ? 'answer' : 'answers'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400">No questions found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 sm:mt-12 mb-4 sm:mb-8">
            <div className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-2 transition-colors cursor-pointer ${
                  currentPage === 1 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 transition-colors cursor-pointer ${
                  currentPage === totalPages 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}