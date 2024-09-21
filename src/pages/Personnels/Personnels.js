import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Personnels = () => {
  const [personnels, setPersonnels] = useState([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await api.get("/Users/list");
      setPersonnels(response.data);
    } catch (error) {
      console.error("API hatası:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (id) => {
    navigate("/personnel/edit/" + id);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu işlemi geri alamazsınız!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'Hayır'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.delete(`/Users/delete/${id}`);
        fetchData();
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Personeller</h2>
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={() => navigate("/personnel/create")}>
          Personel Oluştur
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-gray-100">ID</th>
              <th className="py-2 px-4 border-b bg-gray-100">Personel Adı</th>
              <th className="py-2 px-4 border-b bg-gray-100">Personel Rolü</th>
              <th className="py-2 px-4 border-b bg-gray-100 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {personnels.map((personnel) => (
              <tr key={personnel.id} className="border-b">
                <td className="py-2 px-4">{personnel.id}</td>
                <td className="py-2 px-4 text-center">{personnel.name}</td>
                <td className="py-2 px-4 text-center">{personnel.roles === "Teacher" ? "Öğretmen" : personnel.roles} </td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleUpdate(personnel.id)}
                    className="bg-yellow-500 text-white  py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                  >
                    Güncelle
                  </button>
                  <button
                    onClick={() => handleDelete(personnel.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Personnels;
