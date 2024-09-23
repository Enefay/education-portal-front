import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { role } from "../../App";

const Educations = () => {

  const [educations, setEducations] = useState(null);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await api.get("/Educations/EducationList");
      setEducations(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("hata:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Eğitimler</h2>
        {role === "Teacher" && (<button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={() => navigate("/education/create")}>
          Eğitim Oluştur
        </button>)}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-gray-100">Sıra</th>
              <th className="py-2 px-4 border-b bg-gray-100">Eğitim</th>
              <th className="py-2 px-4 border-b bg-gray-100">Gün Başı Fiyatı</th>
              <th className="py-2 px-4 border-b bg-gray-100">Başlangıç Tarihi</th>
              <th className="py-2 px-4 border-b bg-gray-100">Bitiş Tarihi</th>
              {role === "Teacher" && (<th className="py-2 px-4 border-b bg-gray-100">Durum</th>)}
              <th className="py-2 px-4 border-b bg-gray-100 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {educations && educations?.length > 0 && educations.map((education,key) => (
              <tr key={education.id} className="border-b">
                <td className="py-2 px-4">{key+1}</td>
                <td className="py-2 px-4 text-center">{education.title}</td>
                <td className="py-2 px-4 text-center">{education.cost}</td>
                <td className="py-2 px-4 text-center">{new Date(education.startDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 text-center">{new Date(education.endDate).toLocaleDateString()}</td>
                {role === "Teacher" && (
                  <td className="py-2 text-center px-4 border-b bg-gray-100">
                    {education.educationStatus === 0
                      ? "Onay Bekliyor"
                      : education.educationStatus === 1
                        ? "Onaylandı"
                        : education.educationStatus === 2
                          ? "Reddedildi"
                          : "Bilinmeyen Durum"}
                  </td>
                )}

                <td className="py-2 px-4 text-right">
                {role === "Teacher" && (
                  <button
                    onClick={() => navigate("/pendingrequests")}
                    className="bg-green-500 text-white  py-1 px-3 rounded hover:bg-green-600 mr-2"
                  >
                    Katılma Talepleri
                  </button>
                )}
                  <button
                    onClick={() => navigate("/education/detail/" + education.id)}
                    className="bg-yellow-500 text-white  py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                  >
                    İncele
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

export default Educations;
