import { useEffect } from "react";
import api from "../utils/axios"; // Axios instance'ı buradan alıyoruz

const Profile = () => {
  const fetchData = async () => {
    try {
      const response = await api.get("/Category/CategoryList");
      console.log("Veriler: ", response.data);
    } catch (error) {
      console.error("API hatası:", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("Profile sayfası yüklendi");

  }, []);

  return <div>ProfilProfilProfilProfilProfil</div>;
};

export default Profile;
