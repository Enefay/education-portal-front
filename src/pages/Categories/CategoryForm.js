import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios"; 

const CategoryForm = () => {
  const { id } = useParams(); 
  const [category, setCategory] = useState({
    name:""
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchCategoryById(id);
    }
  }, [id]);

  const fetchCategoryById = async (categoryId) => {
      const response = await api.get(`/Category/GetCategoryById?id=${categoryId}`);
      setCategory(response.data); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/Category/UpdateCategory?id=${id}`, category);
        console.log("Kategori başarıyla güncellendi.");
      } else {
        await api.post("/Category/CreateCategory", category);
        console.log("Yeni kategori başarıyla oluşturuldu.");
      }
      navigate("/categories"); 
    } catch (error) {
      console.log("İşlem başarısız. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-8 mt-10">
      <h2 className="text-xl font-bold mb-6">{id ? "Kategori Güncelle" : "Yeni Kategori Oluştur"}</h2>
      
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Kategori Adı</label>
            <input
              type="text"
              value={category.name}
              onChange={(e) => setCategory({...category, name: e.target.value})}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-700 w-full"
          >
            {id ? "Güncelle" : "Oluştur"}
          </button>
        </form>
    </div>
  );
};

export default CategoryForm;
