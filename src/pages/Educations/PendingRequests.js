import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastify için stil dosyasını ekleyin
import api from "../../utils/axios";

const PendingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // Hepsini Seç durumu

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        const response = await api.get("/EducationUsers/GetPendingRequests");
        setRequests(response.data);
    };

    const handleCheckboxChange = (id) => {
        setSelectedRequests((prev) =>
            prev.includes(id) ? prev.filter(requestId => requestId !== id) : [...prev, id]
        );
    };

    const handleApprove = async () => {
        if (selectedRequests.length === 0) {
            toast.warning("Lütfen en az bir talep seçin!"); // Eğer checkbox işaretli değilse uyarı göster
            return;
        }

    const requestIds = selectedRequests.map(id => parseInt(id));
    const data = {
        requestIds,  
        approve: true  
    };
    await api.put("/EducationUsers/EvaluateRequests", data);
        fetchPendingRequests(); // Yenile
    };

    const handleReject = async () => {
        if (selectedRequests.length === 0) {
            toast.warning("Lütfen en az bir talep seçin!"); // Eğer checkbox işaretli değilse uyarı göster
            return;
        }
        const requestIds = selectedRequests.map(id => parseInt(id));
    const data = {
        requestIds,  
        approve: true  
    };

        await api.put("/EducationUsers/EvaluateRequests", data);
        fetchPendingRequests(); // Yenile
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRequests([]); // Tümünü kaldır
        } else {
            const allIds = requests.map(request => request.id);
            setSelectedRequests(allIds); // Tümünü ekle
        }
        setSelectAll(!selectAll); // Select all durumunu tersine çevir
    };

    return (
        <div className="container mx-auto p-6">
            <ToastContainer /> {/* Toast mesajlarının gösterileceği alan */}
            <h1 className="text-3xl font-bold mb-4">Onay Bekleyen Talepler</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            /> {/* Hepsini Seç */}
                        </th>
                        <th className="py-2 px-4 border-b">Eğitim</th>
                        <th className="py-2 px-4 border-b">Katılımcı</th>
                        <th className="py-2 px-4 border-b">Talep Durumu</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">
                                <input
                                    type="checkbox"
                                    checked={selectedRequests.includes(request.id)}
                                    onChange={() => handleCheckboxChange(request.id)}
                                />
                            </td>
                            <td className="py-2 px-4 border-b">{request.educationTitle}</td>
                            <td className="py-2 px-4 border-b">{request.participantName}</td>
                            <td className="py-2 px-4 border-b">
                                {request.joinRequestStatus === 1 ? "Katılma Talebi Bekliyor" : "Ayrılma Talebi Bekliyor"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button onClick={handleApprove} className="bg-green-500 text-white py-2 px-4 rounded mr-2">
                    Seçilenleri Onayla
                </button>
                <button onClick={handleReject} className="bg-red-500 text-white py-2 px-4 rounded">
                    Seçilenleri Reddet
                </button>
            </div>
        </div>
    );
};

export default PendingRequests;
