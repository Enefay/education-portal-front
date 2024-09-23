import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";
import { role } from "../../../App";
import { useNavigate } from "react-router-dom";

const TabPanel = ({ activeTab, onTabChange }) => {
  const [loading, setLoading] = useState(false);
  const [educations, setEducations] = useState([]);
  const navigate = useNavigate(); // navigate hook'u ile yönlendirme yapacağız.

  const fetchEducations = async (url) => {
    setLoading(true);
    try {
      const response = await api.get("Profile" + url);
      setEducations(response.data);
    } catch (error) {
      console.error("API çağrısı başarısız:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "Admin") {
      if (activeTab === "tab1") {
        fetchEducations("/GetContinueEducations");
      } else if (activeTab === "tab2") {
        fetchEducations("/GetComingEducations");
      } else if (activeTab === "tab3") {
        fetchEducations("/GetCompletedEducations");
      }
    }
  }, [activeTab]);

  return (
    <div className="bg-white shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Eğitimler</h2>
      <div className="flex space-x-4 border-b">
        <button
          className={`px-4 py-2 ${activeTab === "tab1" ? "border-blue-500 text-blue-500 border-b-2" : ""}`}
          onClick={() => onTabChange("tab1")}
        >
          Devam Edenler
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "tab2" ? "border-blue-500 text-blue-500 border-b-2" : ""}`}
          onClick={() => onTabChange("tab2")}
        >
          Yakında Başlayacaklar
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "tab3" ? "border-blue-500 text-blue-500 border-b-2" : ""}`}
          onClick={() => onTabChange("tab3")}
        >
          Tamamlananlar
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div>Yükleniyor...</div>
        ) : (
          <div>
            {educations.length > 0 ? (
              <div className="space-y-4">
                {educations.map((education, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 flex justify-between items-center shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{education.title}</h3>
                      <p className="text-gray-500">{education.description}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/education/detail/${education.id}`)} 
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      İncele
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div>Bu sekmede gösterilecek eğitim yok.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabPanel;
