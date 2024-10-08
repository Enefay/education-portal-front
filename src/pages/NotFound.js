import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">Sayfa Bulunamadı</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
};

export default NotFound;
