// src/App.jsx
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import AdminModelUpload from "./pages/Admin/AdminModelUpload";
import Login from "./pages/Login";
import EmailSpamChecker from "./pages/User/EmailSpamChecker";
import UserProfile from "./pages/User/UserProfile";

function App() {
  const userRole = localStorage.getItem("role") || "user";

  const getDefaultPath = () => {
    return userRole === "admin" ? "/admin/model" : "/user/profile";
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Default route redirect */}
          <Route path="/" element={<Navigate to={getDefaultPath()} replace />} />

          <Route path="/" element={<AuthGuard></AuthGuard>}>
            {/* Admin routes */}
            <Route path="admin/model" element={<AdminModelUpload />} />

            {/* User routes */}
            <Route path="user/profile" element={<UserProfile />} />
            <Route path="user/check-email-spam" element={<EmailSpamChecker />} />
          </Route>

          {/* Catch all invalid routes */}
          <Route path="*" element={<Navigate to={getDefaultPath()} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
