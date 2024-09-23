import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { role } from "../App";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  const handleLogout = () => {
    // Remove token and role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    // Redirect to login page
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-200 h-screen p-4 fixed">
      <ul className="list-none p-0 space-y-4">
        <li>
          <Link
            className={`block text-white py-2 px-4 rounded ${isActive("/") ? "bg-blue-900" : "bg-blue-500 hover:bg-blue-600"}`}
            to="/"
          >
            Anasayfa
          </Link>
        </li>
        <li>
          <Link
            className={`block text-white py-2 px-4 rounded ${isActive("/profile") ? "bg-blue-900" : "bg-blue-500 hover:bg-blue-600"}`}
            to="/profile"
          >
            Profil
          </Link>
        </li>
        <li>
          <Link
            className={`block text-white py-2 px-4 rounded ${isActive("/educations") ? "bg-blue-900" : "bg-blue-500 hover:bg-blue-600"}`}
            to="/educations"
          >
            Eğitimler
          </Link>
        </li>
      {role === "Admin" && (<>

      <li>
          <Link
            className={`block text-white py-2 px-4 rounded ${isActive("/personnels") ? "bg-blue-900" : "bg-blue-500 hover:bg-blue-600"}`}
            to="/personnels"
          >
            Personel Yönetimi
          </Link>
        </li>
        <li>
          <Link
            className={`block text-white py-2 px-4 rounded ${isActive("/categories") ? "bg-blue-900" : "bg-blue-500 hover:bg-blue-600"}`}
            to="/categories"
          >
            Kategoriler
          </Link>
        </li>
        </>  
      )}
        <li className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Çıkış Yap
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
