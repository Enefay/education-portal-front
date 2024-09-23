import { useEffect, useState } from "react";
import api from "../../utils/axios";
import TabPanel from "./Components/TabPanel";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    password: "",
  });
  const [activeTab, setActiveTab] = useState("tab1");

  const fetchData = async () => {
    try {
      const response = await api.get("/Profile/GetUser");
      console.log("Veriler: ", response.data);
      setUser(response.data);
      setFormData({
        email: response.data.email,
        name: response.data.name,
        surname: response.data.surname,
        password: "",
      });
    } catch (error) {
      console.error("Veri alınamadı: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/Profile/update", {
        id: user.id,
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        password: formData.password ? formData.password : null,
      });
    } catch (error) {
      console.error("Güncelleme başarısız: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className=" bg-gray-100">
      <header className="p-4 bg-blue-500 text-white flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Profil Güncelle</h1>
        <span className="text-lg">{user?.roleName}</span>
      </header>

      <div className="flex-grow flex items-center justify-center my-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg grid grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-gray-600 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Ad:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Soyad:</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Yeni Şifre (isteğe bağlı):</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Yeni şifre girin (güncellemek istemiyorsanız boş bırakın)"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Güncelle
            </button>
          </div>
        </form>
      </div>

      {user?.roleName !== "Admin" &&
        <TabPanel activeTab={activeTab} onTabChange={setActiveTab} />
      }

    </div>
  );
};

export default Profile;
