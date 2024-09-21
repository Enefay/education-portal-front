import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const PersonnelForm = () => {
  const { id } = useParams(); 
  const [personnel, setPersonnel] = useState({
    email: "",
    name: "",
    surname: "",
    roleName: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPersonnelById(id);
    }
  }, [id]);

  const fetchPersonnelById = async (personnelId) => {
    const response = await api.get(`/Users/get/${personnelId}`);
    setPersonnel(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(personnel,"personnel")
      setPersonnel({
        ...personnel,
        password: "",
      })
    try {
      if (id) {
        await api.put(`/Users/update`, personnel);
      } else {
        await api.post("/Users/create", personnel);
      }
      navigate("/personnels");
    } catch (error) {
      console.log("İşlem başarısız. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-8 mt-10">
      <h2 className="text-xl font-bold mb-6">{id ? "Personel Güncelle" : "Yeni Personel Oluştur"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="text"
            value={personnel.email}
            onChange={(e) => setPersonnel({ ...personnel, email: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
          <label className="block text-sm font-medium text-gray-700">Ad</label>
          <input
            type="text"
            value={personnel.name}
            onChange={(e) => setPersonnel({ ...personnel, name: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
          <label className="block text-sm font-medium text-gray-700">Soyad</label>
          <input
            type="text"
            value={personnel.surname}
            onChange={(e) => setPersonnel({ ...personnel, surname: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            value={personnel.roleName}
            onChange={(e) => setPersonnel({ ...personnel, roleName: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
            required
          >
            <option value="">Rol Seçin</option>
            <option value="Admin">Admin</option>
            <option value="Teacher">Öğretmen</option>
          </select>


          {!id && (
            <>

            <label className="block text-sm font-medium text-gray-700">Şifre</label>
          <input
            type="password"
            value={personnel.password}
            onChange={(e) => setPersonnel({ ...personnel, password: e.target.value })}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
            </>

          )}
         

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

export default PersonnelForm;
