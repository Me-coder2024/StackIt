import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronRight, 
  Bookmark, 
  Bell, 
  Check, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Link, 
  Code, 
  X,
  Home,
  Eye,
  MessageCircle,
  Share2,
  Flag,
  User,
  LogOut
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Question = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();
  const [answerText, setAnswerText] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [questionVotes, setQuestionVotes] = useState(15);
  const [answerVotes, setAnswerVotes] = useState({ 1: 23, 2: 18 });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(234);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const [user, setUser] = useState({
    name: "John Doe",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80",
    notificationCount: 3
  });

  const question = {
    id: 1,
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine both the columns to make a separate column containing Full name. I have tried using CONCAT function but it's not working properly. Can someone help me with the correct syntax and approach?",
    username: "John Smith",
    userAvatar: "https://readdy.ai/api/search-image?query=professional%20male%20developer%20avatar%20portrait%20with%20clean%20background%20modern%20style&width=40&height=40&seq=user001&orientation=squarish",
    tags: ["SQL", "Database"],
    votes: questionVotes,
    timeAgo: "2 hours ago",
    views: viewCount,
    createdAt: new Date("2024-01-15T10:00:00Z")
  };

  const [answers, setAnswers] = useState([
    {
      id: 1,
      content: "You can use the CONCAT function or the || operator to join columns in SQL. Here are the main approaches:",
      details: [
        "The CONCAT Function: SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM your_table;",
        "The || Operator: SELECT first_name || ' ' || last_name AS full_name FROM your_table;",
        "The CONCAT_WS Function: SELECT CONCAT_WS(' ', first_name, last_name) AS full_name FROM your_table;",
      ],
      username: "Sarah Johnson",
      userAvatar: "https://readdy.ai/api/search-image?query=professional%20female%20developer%20avatar%20portrait%20with%20clean%20background%20modern%20style&width=40&height=40&seq=user002&orientation=squarish",
      votes: answerVotes[1],
      timeAgo: "1 hour ago",
      isAccepted: true,
    },
    {
      id: 2,
      content: "Here's a more detailed explanation with examples for different SQL databases:",
      details: [
        "For MySQL: SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;",
        "For PostgreSQL: SELECT first_name || ' ' || last_name AS full_name FROM users;",
        "For SQL Server: SELECT first_name + ' ' + last_name AS full_name FROM users;",
        "Always handle NULL values: SELECT COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') AS full_name FROM users;",
      ],
      username: "Mike Chen",
      userAvatar: "https://readdy.ai/api/search-image?query=professional%20male%20developer%20avatar%20portrait%20with%20clean%20background%20modern%20style&width=40&height=40&seq=user003&orientation=squarish",
      votes: answerVotes[2],
      timeAgo: "45 minutes ago",
      isAccepted: false,
    },
  ]);

  // Text editor formatting states
  const [textFormats, setTextFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left'
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Increment view count when component mounts
  useEffect(() => {
    setViewCount(prev => prev + 1);
  }, []);

  const handleVote = (type, targetType = 'question', targetId = null) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    const voteKey = `${targetType}-${targetId || 'main'}`;
    const currentVote = userVotes[voteKey];

    // Prevent multiple votes of the same type
    if (currentVote === type) {
      alert('You have already voted on this item.');
      return;
    }

    // Update user votes tracking
    setUserVotes(prev => ({
      ...prev,
      [voteKey]: type
    }));

    // Update vote counts
    if (targetType === 'question') {
      setQuestionVotes(prev => {
        if (currentVote === 'up' && type === 'down') return prev - 2;
        if (currentVote === 'down' && type === 'up') return prev + 2;
        return type === 'up' ? prev + 1 : prev - 1;
      });
    } else if (targetType === 'answer') {
      setAnswerVotes(prev => ({
        ...prev,
        [targetId]: (() => {
          const current = prev[targetId];
          if (currentVote === 'up' && type === 'down') return current - 2;
          if (currentVote === 'down' && type === 'up') return current + 2;
          return type === 'up' ? current + 1 : current - 1;
        })()
      }));
    }
  };

  const handleBookmark = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleSubmitAnswer = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    
    if (answerText.trim()) {
      const newAnswer = {
        id: answers.length + 1,
        content: answerText,
        details: [],
        username: "Current User",
        userAvatar: "https://readdy.ai/api/search-image?query=professional%20user%20avatar%20portrait%20with%20clean%20background%20modern%20style&width=32&height=32&seq=currentuser&orientation=squarish",
        votes: 0,
        timeAgo: "Just now",
        isAccepted: false,
      };
      
      setAnswers(prev => [...prev, newAnswer]);
      setAnswerVotes(prev => ({ ...prev, [newAnswer.id]: 0 }));
      setAnswerText("");
      alert('Answer submitted successfully!');
    }
  };

  const handleLogin = () => {
    navigate('/login');
    setShowLoginPopup(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    alert('Navigate to profile page');
  };

  const handleNotificationClick = () => {
    alert('Navigate to notifications page');
  };

  const handleSignup = () => {
    // Simulate signup process
    localStorage.setItem('authToken', 'dummy-token');
    navigate('/signup');
    setShowLoginPopup(false);
  };

  const handleTextFormat = (format) => {
    setTextFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: question.title,
        text: question.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleReport = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    alert('Report functionality would be implemented here');
  };

  const getVoteButtonClass = (voteType, targetType, targetId) => {
    const voteKey = `${targetType}-${targetId || 'main'}`;
    const currentVote = userVotes[voteKey];
    
    if (currentVote === voteType) {
      return voteType === 'up' 
        ? 'text-green-400' 
        : 'text-red-400';
    }
    
    return voteType === 'up' 
      ? 'text-gray-400 hover:text-green-400' 
      : 'text-gray-400 hover:text-red-400';
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white"
      style={{ width: "100%", minHeight: "1024px" }}
    >
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">StackIt</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {navigate('/')}}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            {isLoggedIn ? (
            // Logged in user UI
            <div className="flex items-center gap-4">
              {/* Notification Icon */}
              <div className="relative">
                <button 
                  onClick={handleNotificationClick}
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
                
                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {/* User Info */}
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
                      
                      {/* Menu Items */}
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      
                      <button
                        onClick={handleLogout}
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
            // Not logged in - show login button
            <button 
              onClick={handleLogin}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-full border border-gray-600 transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base"
            >
              Login
            </button>
          )}
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700 px-8 py-3">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => alert('Navigate to questions')}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Questions
          </button>
          <ChevronRight className="w-3 h-3 text-gray-500" />
          <span className="text-gray-400">How to join 2...</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-8 py-6 flex-1">
        {/* Question Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleVote('up', 'question')}
                className={`p-2 transition-colors cursor-pointer ${getVoteButtonClass('up', 'question')}`}
              >
                <ChevronUp className="w-6 h-6" />
              </button>
              <span className="text-white font-semibold text-lg">
                {questionVotes}
              </span>
              <button
                onClick={() => handleVote('down', 'question')}
                className={`p-2 transition-colors cursor-pointer ${getVoteButtonClass('down', 'question')}`}
              >
                <ChevronDown className="w-6 h-6" />
              </button>
              <button 
                onClick={handleBookmark}
                className={`p-2 transition-colors cursor-pointer mt-2 ${
                  isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-4">
                {question.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-base leading-relaxed mb-6">
                {question.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={question.userAvatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-400 text-sm">
                    {question.username}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {question.timeAgo}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Eye className="w-4 h-4" />
                    {viewCount} views
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleReport}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-semibold text-white">
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-6">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className={`bg-gray-800 border rounded-lg p-6 ${
                  answer.isAccepted 
                    ? 'border-green-600 bg-green-900/10' 
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleVote('up', 'answer', answer.id)}
                      className={`p-2 transition-colors cursor-pointer ${getVoteButtonClass('up', 'answer', answer.id)}`}
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <span className="text-white font-semibold">
                      {answerVotes[answer.id]}
                    </span>
                    <button
                      onClick={() => handleVote('down', 'answer', answer.id)}
                      className={`p-2 transition-colors cursor-pointer ${getVoteButtonClass('down', 'answer', answer.id)}`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    {answer.isAccepted && (
                      <div className="p-2 text-green-400 mt-2">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {answer.isAccepted && (
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Accepted Answer</span>
                      </div>
                    )}
                    
                    <p className="text-gray-300 text-base mb-4">
                      {answer.content}
                    </p>

                    {answer.details.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {answer.details.map((detail, index) => (
                          <div
                            key={index}
                            className="bg-gray-900 border border-gray-700 rounded p-3"
                          >
                            <code className="text-green-400 text-sm font-mono">
                              {detail}
                            </code>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <img
                        src={answer.userAvatar}
                        alt="User Avatar"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-gray-400 text-sm">
                        {answer.username}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {answer.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Answer Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Submit Your Answer
          </h3>

          {/* Rich Text Editor Toolbar */}
          <div className="bg-gray-700 border border-gray-600 rounded-t-lg p-3 flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => handleTextFormat('bold')}
              className={`p-2 transition-colors cursor-pointer ${
                textFormats.bold ? 'text-white bg-gray-600' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleTextFormat('italic')}
              className={`p-2 transition-colors cursor-pointer ${
                textFormats.italic ? 'text-white bg-gray-600' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleTextFormat('underline')}
              className={`p-2 transition-colors cursor-pointer ${
                textFormats.underline ? 'text-white bg-gray-600' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Underline className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1"></div>
            <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <AlignRight className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-600 mx-1"></div>
            <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <List className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <ListOrdered className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <Link className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <Code className="w-4 h-4" />
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Write your answer here... Be specific and provide examples if possible."
            className="w-full h-40 bg-gray-700 border border-gray-600 rounded-b-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm"
          />

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-400">
              {answerText.length > 0 && (
                <span>{answerText.length} characters</span>
              )}
            </div>
            <button
              onClick={handleSubmitAnswer}
              disabled={!answerText.trim()}
              className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap ${
                answerText.trim() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          </div>
        </div>

        {/* Login Popup */}
        {showLoginPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Login Required
                </h3>
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-300 mb-6">
                You need to be logged in to perform this action. Please login or signup to continue.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleLogin}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Login
                </button>
                <button 
                  onClick={handleSignup}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg border border-gray-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Signup
                </button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  Note: Users can only vote once per item. Multiple votes are not allowed.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Question;