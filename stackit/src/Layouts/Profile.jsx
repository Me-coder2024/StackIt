import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft,
  Edit3,
  Calendar,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Mail,
  Trophy,
  MessageCircle,
  ThumbsUp,
  Award,
  User,
  Bell,
  LogOut,
  Settings,
  Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const dropdownRef = useRef(null);

  const [user, setUser] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    bio: "Full-stack developer with 5+ years of experience in React, Node.js, and Python. Passionate about clean code and helping others learn programming.",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    github: "johndoe",
    linkedin: "johndoe",
    joinDate: "January 2022",
    notificationCount: 3,
    stats: {
      reputation: 1250,
      questionsAsked: 12,
      answersGiven: 45,
      helpfulVotes: 234,
      badges: 8
    }
  });

  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: user.bio,
    location: user.location,
    website: user.website,
    github: user.github,
    linkedin: user.linkedin
  });

  // Sample user activity data
  const recentQuestions = [
    {
      id: 1,
      title: "How to optimize React component re-renders?",
      votes: 15,
      answers: 3,
      timeAgo: "2 days ago",
      status: "answered"
    },
    {
      id: 2,
      title: "Best practices for error handling in Node.js",
      votes: 8,
      answers: 2,
      timeAgo: "1 week ago",
      status: "answered"
    },
    {
      id: 3,
      title: "Understanding JavaScript promises vs async/await",
      votes: 22,
      answers: 5,
      timeAgo: "2 weeks ago",
      status: "answered"
    }
  ];

  const recentAnswers = [
    {
      id: 1,
      questionTitle: "How to join 2 columns in a data set to make a separate column in SQL",
      votes: 12,
      accepted: true,
      timeAgo: "1 day ago"
    },
    {
      id: 2,
      questionTitle: "Best practices for React component optimization",
      votes: 8,
      accepted: false,
      timeAgo: "3 days ago"
    },
    {
      id: 3,
      questionTitle: "Understanding JavaScript closures with practical examples",
      votes: 15,
      accepted: true,
      timeAgo: "1 week ago"
    }
  ];

  const badges = [
    { name: "Problem Solver", icon: "🏆", description: "Solved 10+ questions", earned: "2 months ago" },
    { name: "Helpful", icon: "👍", description: "Received 50+ helpful votes", earned: "3 months ago" },
    { name: "Mentor", icon: "🎓", description: "Helped 5+ new users", earned: "1 month ago" },
    { name: "Consistent", icon: "📅", description: "Active for 30+ days", earned: "4 months ago" }
  ];

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

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user.name,
      bio: user.bio,
      location: user.location,
      website: user.website,
      github: user.github,
      linkedin: user.linkedin
    });
    setIsEditing(false);
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">StackIt</h1>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* Notification Icon */}
                <div className="relative">
                  <button
                    onClick={() => navigate("/notifications")}
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
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
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
                onClick={() => navigate("/login")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-full border border-gray-600 transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Profile Header */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="text-2xl font-bold text-white bg-gray-700 border border-gray-600 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                    )}
                    <p className="text-gray-400">@{user.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="w-full text-gray-300 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-300">{user.bio}</p>
                  )}
                </div>

                {/* User Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-white"
                      />
                    ) : (
                      <span>{user.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Globe className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-white"
                      />
                    ) : (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        {user.website}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Github className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.github}
                        onChange={(e) => setEditForm({...editForm, github: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-white"
                      />
                    ) : (
                      <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        {user.github}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Linkedin className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.linkedin}
                        onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-white"
                      />
                    ) : (
                      <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        {user.linkedin}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{user.stats.reputation}</div>
              <div className="text-gray-400 text-sm">Reputation</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{user.stats.questionsAsked}</div>
              <div className="text-gray-400 text-sm">Questions</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{user.stats.answersGiven}</div>
              <div className="text-gray-400 text-sm">Answers</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <ThumbsUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{user.stats.helpfulVotes}</div>
              <div className="text-gray-400 text-sm">Helpful Votes</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{user.stats.badges}</div>
              <div className="text-gray-400 text-sm">Badges</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8 px-6">
                {['overview', 'questions', 'answers', 'badges'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Questions</h3>
                    <div className="space-y-3">
                      {recentQuestions.slice(0, 3).map((question) => (
                        <div key={question.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <h4 
                              className="text-white font-medium cursor-pointer hover:text-blue-400 transition-colors"
                              onClick={() => handleQuestionClick(question.id)}
                            >
                              {question.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                              <span>{question.votes} votes</span>
                              <span>{question.answers} answers</span>
                              <span>{question.timeAgo}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            question.status === 'answered' ? 'bg-green-700 text-green-300' : 'bg-gray-600 text-gray-300'
                          }`}>
                            {question.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Answers</h3>
                    <div className="space-y-3">
                      {recentAnswers.slice(0, 3).map((answer) => (
                        <div key={answer.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <h4 className="text-white font-medium cursor-pointer hover:text-blue-400 transition-colors">
                              {answer.questionTitle}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                              <span>{answer.votes} votes</span>
                              <span>{answer.timeAgo}</span>
                            </div>
                          </div>
                          {answer.accepted && (
                            <span className="px-2 py-1 bg-green-700 text-green-300 rounded text-xs">
                              ✓ Accepted
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="space-y-4">
                  {recentQuestions.map((question) => (
                    <div key={question.id} className="p-4 bg-gray-700 rounded-lg">
                      <h4 
                        className="text-white font-medium cursor-pointer hover:text-blue-400 transition-colors mb-2"
                        onClick={() => handleQuestionClick(question.id)}
                      >
                        {question.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{question.votes} votes</span>
                        <span>{question.answers} answers</span>
                        <span>{question.timeAgo}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          question.status === 'answered' ? 'bg-green-700 text-green-300' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {question.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'answers' && (
                <div className="space-y-4">
                  {recentAnswers.map((answer) => (
                    <div key={answer.id} className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="text-white font-medium cursor-pointer hover:text-blue-400 transition-colors mb-2">
                        {answer.questionTitle}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{answer.votes} votes</span>
                        <span>{answer.timeAgo}</span>
                        {answer.accepted && (
                          <span className="px-2 py-1 bg-green-700 text-green-300 rounded text-xs">
                            ✓ Accepted
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'badges' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {badges.map((badge, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{badge.icon}</span>
                        <h4 className="text-white font-medium">{badge.name}</h4>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{badge.description}</p>
                      <p className="text-gray-500 text-xs">Earned {badge.earned}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}