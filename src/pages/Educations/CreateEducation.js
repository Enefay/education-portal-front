import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";

const CreateEducation = () => {
  const { id } = useParams();

  const userId = parseInt(localStorage.getItem("userId"), 10);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    quota: "",
    educationStatus: 0,
    cost: "",
    startDate: "",
    endDate: "",
    instructorId: userId,
    contents: [],
  });

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await api.get("Category/CategoryList");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchEducationById = async (educationId) => {
    const response = await api.get(`/Educations/GetEducationById?id=${id}`);
    setFormData(response.data);
  };
  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchEducationById(id);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "cost") {
      newValue = parseFloat(value);
    } else if (name === "quota" || name === "categoryId") {
      newValue = parseInt(value, 10);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };


  const handleContentChange = (index, event) => {
    const { name, value, files } = event.target;
    const newContents = [...formData.contents];
    if (name === "file") {

      newContents[index] = {
        ...newContents[index],
        file: files[0],
      };
    } else {
      newContents[index] = {
        ...newContents[index],
        [name]: parseInt(value, 10),
      };
    }
    setFormData({ ...formData, contents: newContents });
  };

  const addContent = () => {
    setFormData({
      ...formData,
      contents: [
        ...formData.contents,
        { type: "", file: null, filePath: "", educationId: null },
      ],
    });
  };

  const removeContent = (index) => {
    const newContents = formData.contents.filter((_, i) => i !== index);
    setFormData({ ...formData, contents: newContents });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("categoryId", formData.categoryId);
    form.append("quota", formData.quota);
    form.append("educationStatus", 0);
    form.append("cost", formData.cost);
    form.append("startDate", formData.startDate);
    form.append("endDate", formData.endDate);
    form.append("instructorId", userId);


    formData.contents.forEach((content, index) => {
      form.append(`contents[${index}].id`, content.id || "");  
      form.append(`contents[${index}].type`, content.type);
      form.append(`contents[${index}].educationId`, id);
      if (content.file) {
        form.append(`contents[${index}].filePath`, content.file.name);
        form.append(`contents[${index}].file`, content.file);
      } else {
        form.append(`contents[${index}].filePath`, content.filePath || "");
      }
    });
    
    

    console.log(formData, "asdas")
    if (id) {
      form.append("id", id);
    }
    try {
      if (id) {
        await api.post(`/Educations/UpdateEducation`, form); // Güncelleme işlemi
      } else {
        await api.post(`/Educations/CreateEducation`, form); // Eğitim oluşturma işlemi
      }
    } catch (error) {
      console.error("Error creating education:", error);
    }

  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-6">Eğitim Oluşturma</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Baslik */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Başlık</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Aciklama */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        {/* kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Kategori</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          >
            <option value="">Bir kategori seçiniz.</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Kota */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Kota</label>
          <input
            type="number"
            name="quota"
            value={formData.quota}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Gun basi fiyat */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gün başına fiyat</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            step="0.01"
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Baslangic */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Bitis */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        {/* Icerikler */}
        <div>
          <label className="block text-sm font-medium text-gray-700">İçerikler</label>
          {formData.contents.map((content, index) => (
            <div key={index} className="space-y-4 border p-4 rounded mb-4">
              {/* icerik turu */}
              <div>
                <label className="block text-sm font-medium text-gray-700">İçerik Türü</label>
                <select
                  name="type"
                  value={content.type}
                  onChange={(e) => handleContentChange(index, e)}
                  className="mt-1 p-2 border rounded w-full"
                  required
                >
                  <option value="">Bir İçerik Türü Seçiniz.</option>
                  <option value="0">Kitap</option>
                  <option value="1">Makale</option>
                  <option value="2">Sunum</option>
                  <option value="3">Video</option>
                </select>
              </div>

              {/* dosya yukleme */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {content.type === 3 ? "Video Yükle" : "PDF Yükle"}
                </label>
                <input
                  type="file"
                  name="file"
                  accept={content.type === 3 ? "video/*" : ".pdf"}
                  onChange={(e) => handleContentChange(index, e)}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>

              {/* icerik kaldirma */}
              <button
                type="button"
                onClick={() => removeContent(index)}
                className="text-red-500 hover:text-red-700"
              >
                İçeriği kaldır
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addContent}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            İçerik Ekle
          </button>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {id ? "Onayda Bekleyen Eğitimi Güncelle" : "Eğitimi Onaya gönder"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEducation;
