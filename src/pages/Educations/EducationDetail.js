import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { role } from "../../App";


const EducationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const url = "https://localhost:7081";
    const [education, setEducation] = useState({
        title: "",
        description: "",
        categoryId: "",
        category: {
            name: ""
        },
        quota: "",
        cost: "",
        startDate: "",
        endDate: "",
        contents: [],
    });

    const [statusMessage, setStatusMessage] = useState(""); // Duruma göre mesaj
    const [actionButton, setActionButton] = useState(""); // Duruma göre buton

    useEffect(() => {
        if (id) {
            fetchEducationById(id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchEducationById = async (educationId) => {
        const response = await api.get(`/Educations/GetEducationById?id=${educationId}`);
        const response2 = await api.get(`/EducationUsers/GetEducationUserById?educationId=${educationId}`);
        setEducation(response.data);
        handleStatus(response.data,response2.data); // Duruma göre mesaj ve butonları ayarla
    };

    const handleStatus = (education, educationUser) => {
        const now = new Date();
        const startDate = new Date(education.startDate);
        const endDate = new Date(education.endDate);
    
        if (educationUser) {
            // Öğrencinin talebi varsa
            if (educationUser.joinRequestStatus === 1 || educationUser.leaveRequestStatus === 1) {
                setStatusMessage("Talebiniz onay bekliyor.");
                setActionButton(<button className="bg-gray-500 text-white py-2 px-4 rounded" disabled>İşlem Bekleniyor</button>);
            } else if (educationUser.joinRequestStatus === 2 && now < startDate) {
                setStatusMessage("Eğitime katıldınız. Ayrılma talebi oluşturabilirsiniz.");
                setActionButton(
                    <button onClick={requestLeave} className="bg-red-500 text-white py-2 px-4 rounded">Ayrılma Talebi Oluştur</button>
                );
            }else if(educationUser.joinRequestStatus === 0)
            {
                setStatusMessage("Tekrar katılma talebi oluşturabilirsiniz.");
                setActionButton(
                    <button onClick={requestJoin} className="bg-green-500 text-white py-2 px-4 rounded">Tekrar Katıl</button>
                );
            }
                 else {
                setStatusMessage("Bu eğitime katıldınız.");
            }
        } else if (now < startDate) {
            setStatusMessage("Eğitime Katıl");
            setActionButton(
                <button onClick={requestJoin} className="bg-green-500 text-white py-2 px-4 rounded">Eğitime Katılma Talebi Oluştur</button>
            );
        } else if (now > endDate) {
            setStatusMessage("Bu eğitimin süresi dolmuştur.");
            setActionButton(<button className="bg-gray-500 text-white py-2 px-4 rounded" disabled>Katılım Kapalı</button>);
        } else {
            setStatusMessage("Eğitim devam ediyor.");
            setActionButton(<button className="bg-red-500 text-white py-2 px-4 rounded" disabled>Eğitim Devam Ediyor</button>);
        }
    };
    
    // API ile katılma talebi oluşturma
    const requestJoin = async () => {
        try {
            await api.post(`/EducationUsers/JoinEducation/${id}`);
            setStatusMessage("Katılma talebi gönderildi.");
            setActionButton(<button className="bg-gray-500 text-white py-2 px-4 rounded" disabled>İşlem Bekleniyor</button>);
        } catch (error) {
            console.error(error);
        }
    };
    
    // API ile ayrılma talebi oluşturma
    const requestLeave = async () => {
        try {
            await api.post(`/EducationUsers/LeaveEducation/${id}`);
            setStatusMessage("Ayrılma talebi gönderildi.");
            setActionButton(<button className="bg-gray-500 text-white py-2 px-4 rounded" disabled>İşlem Bekleniyor</button>);
        } catch (error) {
            console.error(error);
        }
    };
    


    const answer = async (answ) => {
        const data = {
            id:parseInt(id),
            answer:answ
        }
        try {
        await api.put("/Educations/EvaluateEducation", data)
            navigate("/educations")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="container mx-auto p-6">
            {role === "Teacher" && (
                <button onClick={() => navigate("/education/create/" + id)} className="float-end px-4 py-2 bg-green-500 text-white rounded-md">
                Düzenle
            </button>
            )}
            <div className="bg-white shadow-md rounded p-4">
                <h1 className="text-3xl font-bold mb-4">{education.title}</h1>
                <p className="text-lg text-gray-700 mb-2">{education.description}</p>
                <p className="text-gray-600">Kategori: {education.category.name}</p>
                <p className="text-gray-600">Kontenjan: {education.quota}</p>
                <p className="text-gray-600">Ücret: {education.cost} ₺</p>
                <p className="text-gray-600">Başlangıç Tarihi: {new Date(education.startDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Bitiş Tarihi: {new Date(education.endDate).toLocaleDateString()}</p>
            </div>

            <div className="mt-6">
                <h2 className="text-2xl font-bold">İçerikler</h2>
                <ul className="space-y-4 mt-4">
                    {education.contents.map((content, key) => (
                        <li key={content.id} className="bg-gray-100 p-4 rounded shadow-md">
                            <p>İçerik {key + 1} : {content.type === 3 ? "Video" : "PDF"}</p>
                            {content.type !== 3 && (
                                <a href={`${url}/files/${content.filePath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                                    PDF Dosyasını Görüntüle
                                </a>
                            )}
                            {content.type === 3 && (
                                <video controls className="mt-2" style={{ height: 250, widows: 250 }}>
                                    <source src={`${url}/files/${content.filePath}`} type="video/mp4" />
                                    Tarayıcınız video etiketini desteklemiyor.
                                </video>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {role === "Student" &&
                <div className="mt-6">
                    <p className="text-lg font-semibold text-red-500">{statusMessage}</p>
                    <div className="mt-4">{actionButton}</div>
                </div>
            }
            {role === "Admin" &&
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={() => answer(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-300"
                    >
                        Reddet
                    </button>

                    <button
                        onClick={() => answer(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300"
                    >
                        Onayla
                    </button>
                </div>

            }
        </div>
    );
};

export default EducationDetail;
