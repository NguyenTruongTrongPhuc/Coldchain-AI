import React, { useState } from 'react';
import { Plus, Map, ListFilter } from 'lucide-react';

// --- DỮ LIỆU MÔ PHỎNG ---
const mockShipments = [
    { 
        id: 'VN-240721-001', 
        status: 'Đang vận chuyển', 
        from: 'Kho TP.HCM', 
        to: 'Kho Hà Nội', 
        driver: 'Nguyễn Văn A', 
        temp: '4.5°C', 
        eta: '22:00 22/07/2025',
        currentLocation: { lat: 10.8231, lng: 106.6297 }, // TPHCM
    },
    { 
        id: 'VN-240721-002', 
        status: 'Đang vận chuyển', 
        from: 'Kho Đà Nẵng', 
        to: 'Kho Cần Thơ', 
        driver: 'Trần Thị B', 
        temp: '2.1°C', 
        eta: '08:30 22/07/2025',
        currentLocation: { lat: 16.0544, lng: 108.2022 }, // Đà Nẵng
    },
    { 
        id: 'VN-240720-005', 
        status: 'Đã hoàn thành', 
        from: 'Kho Cần Thơ', 
        to: 'Kho Hải Phòng', 
        driver: 'Lê Văn C', 
        temp: '3.0°C', 
        eta: 'Hoàn thành',
        currentLocation: { lat: 20.8648, lng: 106.6834 }, // Hải Phòng
    },
];
// ----------------------------------------------------

const StatusBadge = ({ status }: { status: string }) => {
    // ... (Component này bạn có thể copy từ trang Dashboard nếu muốn)
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center";
    switch (status) {
        case 'Đang vận chuyển':
            return <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`}>{status}</span>;
        case 'Đã hoàn thành':
            return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>{status}</span>;
        default:
            return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>{status}</span>;
    }
};


const ShipmentListPage = () => {
    const [selectedShipment, setSelectedShipment] = useState(mockShipments[0]);

    return (
        // Sử dụng flex-col và h-full để layout chiếm toàn bộ chiều cao
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Theo dõi Lô hàng</h1>
                <div className="flex space-x-2">
                     <button className="inline-flex items-center justify-center gap-x-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                        <ListFilter size={16} className="text-gray-500" />
                        Lọc / Tìm kiếm
                    </button>
                    <button className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        <Plus size={16} />
                        Tạo lô hàng mới
                    </button>
                </div>
            </div>

            {/* Main content: List và Map */}
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                {/* Cột danh sách (trái) */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-y-auto">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {mockShipments.map(shipment => (
                            <li key={shipment.id} 
                                onClick={() => setSelectedShipment(shipment)}
                                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedShipment.id === shipment.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{shipment.id}</p>
                                    <StatusBadge status={shipment.status} />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {shipment.from} → {shipment.to}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tài xế: {shipment.driver}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cột bản đồ (phải) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    {/* Placeholder cho bản đồ */}
                    <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-t-xl flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <Map size={48} className="mx-auto mb-2" />
                            <p className="font-semibold">Bản đồ sẽ hiển thị ở đây</p>
                            <p className="text-xs">Cần tích hợp Google Maps API để hoạt động</p>
                        </div>
                    </div>
                    {/* Panel thông tin chi tiết */}
                    <div className="flex-shrink-0 p-4 border-t dark:border-gray-600">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedShipment.id}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm">
                            <div>
                                <p className="text-xs text-gray-500">Trạng thái:</p>
                                <p className="font-medium"><StatusBadge status={selectedShipment.status} /></p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Nhiệt độ hiện tại:</p>
                                <p className="font-medium">{selectedShipment.temp}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Dự kiến đến (ETA):</p>
                                <p className="font-medium">{selectedShipment.eta}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentListPage;