import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="mx-auto px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4"></div>
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

export default AdminLayout;
