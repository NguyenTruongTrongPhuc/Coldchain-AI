import React, { useState, useEffect } from 'react';
import { Plus, Map, ListFilter, Loader2 } from 'lucide-react';
import { getShipments } from '@/services/shipmentService';
import { Shipment } from '@/types';

// Component hiển thị Status Badge
const StatusBadge = ({ status }: { status: string }) => { 
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center"; 
    switch (status) { 
        case 'pending': 
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>Chờ xử lý</span>; 
        case 'in_transit': 
            return <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`}>Đang vận chuyển</span>; 
        case 'completed': 
            return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>Đã hoàn thành</span>; 
        default: 
            return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>{status}</span>; 
    }
};

const ShipmentListPage = () => {
    // State để lưu dữ liệu thật từ API
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [loading, setLoading] = useState(true);

    // useEffect để gọi API khi trang được tải
    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const response = await getShipments();
                setShipments(response.data);
                // Tự động chọn lô hàng đầu tiên trong danh sách để hiển thị
                if (response.data.length > 0) {
                    setSelectedShipment(response.data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch shipments:", error);
                // Có thể thêm toast thông báo lỗi ở đây
            } finally {
                setLoading(false);
            }
        };
        fetchShipments();
    }, []);

    return (
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
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <Loader2 className="animate-spin mr-2" /> Đang tải...
                        </div>
                    ) : shipments.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {shipments.map(shipment => (
                                <li key={shipment.id} onClick={() => setSelectedShipment(shipment)} className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${selectedShipment?.id === shipment.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{shipment.name}</p>
                                        <StatusBadge status={shipment.status} />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{shipment.start_location || 'N/A'} → {shipment.end_location || 'N/A'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Thiết bị: <span className="font-mono">{shipment.device?.tracker_id || 'Chưa gán'}</span></p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Không có lô hàng nào.</p>
                        </div>
                    )}
                </div>

                {/* Cột bản đồ (phải) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    <div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-t-xl flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <Map size={48} className="mx-auto mb-2" />
                            <p className="font-semibold">Bản đồ sẽ hiển thị ở đây</p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 p-4 border-t dark:border-gray-600">
                        {selectedShipment ? (
                            <>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedShipment.name}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500">Trạng thái:</p>
                                        <p className="font-medium"><StatusBadge status={selectedShipment.status} /></p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Thiết bị:</p>
                                        <p className="font-medium font-mono text-xs">{selectedShipment.device?.tracker_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Pin:</p>
                                        <p className="font-medium">{selectedShipment.device?.battery ?? 'N/A'}{selectedShipment.device?.battery ? '%' : ''}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 p-4 text-center">Chọn một lô hàng để xem chi tiết.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentListPage;