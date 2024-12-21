import { Link, Outlet, useNavigate } from "react-router-dom";

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="mx-auto px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-4">
                <Link to="/user/profile" className="font-bold hover:text-blue-200 transition">
                  Profile
                </Link>
                <Link to="/user/check-email-spam" className="font-bold hover:text-blue-200 transition">
                  Email Spam Checker
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleLogout} className="hover:text-blue-200 font-bold transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
