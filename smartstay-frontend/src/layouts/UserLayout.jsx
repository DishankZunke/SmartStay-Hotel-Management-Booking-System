import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();               // clears token + user
    navigate("/login");     // redirect
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">SmartStay</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
