import React, { useEffect } from "react";
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Layouts/Home";
import Question from "./Layouts/Question";
import AskQuestion from "./Layouts/AskQuestion";
import Login from "./Layouts/Login";
import { AuthProvider } from "./contexts/AuthContext"; // <-- import
import SignUp from "./Layouts/SignUp";

export default function App() {
  useEffect(() => {
		createChat({
			webhookUrl: 'http://localhost:5678/webhook/624c7637-20b4-46f7-884c-40fc6b7f7a3f/chat'
		});
	}, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/question/:id" element={<Question />} />
          <Route path="/ask" element={<AskQuestion />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}