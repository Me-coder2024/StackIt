import React, { useState, useRef, useEffect } from 'react';
import { 
  FaBell, 
  FaUser, 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl, 
  FaAlignLeft, 
  FaAlignCenter, 
  FaAlignRight, 
  FaLink, 
  FaCode, 
  FaChevronDown,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { Home as HomeIcon, Bell, User, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

const AskQuestion = () => {
    const { isLoggedIn, login, logout } = useAuth();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [user, setUser] = useState({
      name: "John Doe",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facepad&facepad=2&w=256&h=256&q=80",
      notificationCount: 3
    });
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [category, setCategory] = useState("General");
    const [showPreview, setShowPreview] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef(null);

    const categories = [
        "General",
        "Programming",
        "Web Development",
        "Database",
        "Mobile Development",
        "DevOps",
    ];

    // Validation function
    const validateForm = () => {
        const newErrors = {};
        
        if (!title.trim()) {
            newErrors.title = "Title is required";
        } else if (title.length < 10) {
            newErrors.title = "Title must be at least 10 characters long";
        } else if (title.length > 200) {
            newErrors.title = "Title must be less than 200 characters";
        }

        if (!description.trim()) {
            newErrors.description = "Description is required";
        } else if (description.length < 20) {
            newErrors.description = "Description must be at least 20 characters long";
        }

        if (tags.trim()) {
            const tagArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
            if (tagArray.length > 5) {
                newErrors.tags = "Maximum 5 tags allowed";
            }
            if (tagArray.some(tag => tag.length > 20)) {
                newErrors.tags = "Each tag must be less than 20 characters";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Rich text editor functions
    const insertTextAtCursor = (text) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = description.substring(start, end);
        
        let newText;
        switch (text) {
            case 'bold':
                newText = `**${selectedText || 'bold text'}**`;
                break;
            case 'italic':
                newText = `*${selectedText || 'italic text'}*`;
                break;
            case 'underline':
                newText = `<u>${selectedText || 'underlined text'}</u>`;
                break;
            case 'code':
                newText = `\`${selectedText || 'code'}\``;
                break;
            case 'link':
                newText = `[${selectedText || 'link text'}](url)`;
                break;
            case 'ul':
                newText = `\n- ${selectedText || 'list item'}\n`;
                break;
            case 'ol':
                newText = `\n1. ${selectedText || 'list item'}\n`;
                break;
            default:
                newText = text;
        }

        const newDescription = description.substring(0, start) + newText + description.substring(end);
        setDescription(newDescription);
        
        // Set cursor position after insertion
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + newText.length, start + newText.length);
        }, 0);
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Simulate API call
            const questionData = {
                title: title.trim(),
                description: description.trim(),
                tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
                category,
                createdAt: new Date().toISOString(),
                author: "Current User", // This would come from auth context
            };

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Question submitted:", questionData);
            
            // Show success message or redirect
            alert("Question submitted successfully!");
            
            // Reset form
            handleCancel();
            
        } catch (error) {
            console.error("Error submitting question:", error);
            alert("Error submitting question. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setTitle("");
        setDescription("");
        setTags("");
        setCategory("General");
        setErrors({});
        setShowPreview(false);
    };

    const handleTagsChange = (e) => {
        const value = e.target.value;
        setTags(value);
        
        // Real-time validation for tags
        if (value.trim()) {
            const tagArray = value.split(",").map(tag => tag.trim()).filter(tag => tag);
            if (tagArray.length > 5) {
                setErrors(prev => ({ ...prev, tags: "Maximum 5 tags allowed" }));
            } else {
                setErrors(prev => ({ ...prev, tags: undefined }));
            }
        } else {
            setErrors(prev => ({ ...prev, tags: undefined }));
        }
    };

    const getCharacterCount = (text, max) => {
        return `${text.length}/${max}`;
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowProfileDropdown(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <HomeIcon className="w-4 h-4" />
                    Home
                  </button>
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
                      onClick={login}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-full border border-gray-600 transition-colors cursor-pointer whitespace-nowrap text-sm sm:text-base"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="px-8 py-8 flex-1">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-8">
                        Ask New Question
                    </h2>

                    <div className="space-y-8">
                        {/* Title */}
                        <div>
                            <label className="block text-white text-lg mb-3">
                                Title *
                                <span className="text-sm text-gray-400 ml-2">
                                    {getCharacterCount(title, 200)}
                                </span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors text-sm ${
                                    errors.title ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                                }`}
                                placeholder="Enter your question title"
                                maxLength={200}
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white text-lg mb-3">
                                Description *
                            </label>

                            {/* Rich Text Editor Toolbar */}
                            <div className="bg-gray-700 border border-gray-600 rounded-t-lg px-4 py-2 flex items-center gap-2 border-b-0 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => insertTextAtCursor('bold')}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded cursor-pointer transition-colors"
                                    title="Bold"
                                >
                                    <FaBold />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertTextAtCursor('italic')}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded cursor-pointer transition-colors"
                                    title="Italic"
                                >
                                    <FaItalic />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertTextAtCursor('underline')}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded cursor-pointer transition-colors"
                                    title="Underline"
                                >
                                    <FaUnderline />
                                </button>
                                <div className="w-px h-6 bg-gray-600 mx-1"></div>
                                <button
                                    type="button"
                                    onClick={() => insertTextAtCursor('ul')}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded cursor-pointer transition-colors"
                                    title="Bullet List"
                                >
                                    <FaListUl />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertTextAtCursor('ol')}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded cursor-pointer transition-colors"
                                    title="Numbered List"
                                >
                                    <FaListOl />
                                </button>
                                <div className="w-px h-6 bg-gray-600 mx-1"></div>
                                <button
                                    type="button"
                                    onClick={() => insertTextAtCursor('link')}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded cursor-pointer transition-colors"
                                    title="Insert Link"
                                >
                                    <FaLink />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertTextAtCursor('code')}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded cursor-pointer transition-colors"
                                    title="Inline Code"
                                >
                                    <FaCode />
                                </button>
                            </div>

                            <textarea
                                ref={textareaRef}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={`w-full bg-gray-800 border rounded-b-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors text-sm resize-none border-t-0 ${
                                    errors.description ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                                }`}
                                rows={12}
                                placeholder="Provide detailed description of your question..."
                            />
                            {errors.description && (
                                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-white text-lg mb-3">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={handleTagsChange}
                                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors text-sm ${
                                    errors.tags ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                                }`}
                                placeholder="Enter tags separated by commas (e.g., javascript, react, programming)"
                            />
                            <p className="text-gray-400 text-xs mt-2">
                                Add up to 5 tags to help others find your question
                            </p>
                            {errors.tags && (
                                <p className="text-red-400 text-sm mt-1">{errors.tags}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-white text-lg mb-3">Category</label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm appearance-none cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option
                                            key={cat}
                                            value={cat}
                                            className="bg-gray-800 text-white"
                                        >
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Preview Toggle */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 transition-colors cursor-pointer flex items-center gap-2"
                            >
                                {showPreview ? <FaEyeSlash /> : <FaEye />}
                                {showPreview ? "Hide Preview" : "Show Preview"}
                            </button>
                        </div>

                        {/* Preview */}
                        {showPreview && (
                            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    Preview
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-lg font-medium text-white mb-2">
                                            {title || "Your question title will appear here"}
                                        </h4>
                                    </div>
                                    <div className="text-gray-300 whitespace-pre-wrap">
                                        {description || "Your question description will appear here"}
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {tags
                                            .split(",")
                                            .map(tag => tag.trim())
                                            .filter(tag => tag)
                                            .map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-600"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Category: {category}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-center gap-4 pt-8">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg border border-gray-600 transition-colors cursor-pointer"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Question"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AskQuestion;