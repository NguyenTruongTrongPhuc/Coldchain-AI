import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Plus, ListFilter, Loader2, X, Search, Edit } from 'lucide-react';
import { getShipments, createShipment, updateShipment, getShipmentRoute } from '@/services/shipmentService';
import { getDevices } from '@/services/deviceService';
import { Shipment, Device } from '@/types';
import { toast } from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';
import type { LatLngExpression } from 'leaflet';

// --- DYNAMIC IMPORT BẢN ĐỒ ---
const ShipmentMap = dynamic(() => import('@/components/shipments/ShipmentMap'), { 
    ssr: false, 
    loading: () => <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /> Đang tải bản đồ...</div>
});

// Component Modal (Pop-up)
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-1.5"><X size={20} /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

// Component hiển thị Status Badge
const StatusBadge = ({ status }: { status: string }) => { 
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center"; 
    switch (status) { 
        case 'pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>Chờ xử lý</span>; 
        case 'in_transit': return <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`}>Đang vận chuyển</span>; 
        case 'completed': return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>Đã hoàn thành</span>; 
        case 'failed': return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}>Gặp sự cố</span>;
        default: return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>{status}</span>; 
    }
};

const ShipmentListPage = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedData, setEditedData] = useState<Partial<Shipment>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
    const [newShipmentName, setNewShipmentName] = useState('');
    const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
    const [newShipmentLat, setNewShipmentLat] = useState('');
    const [newShipmentLng, setNewShipmentLng] = useState('');
    const [route, setRoute] = useState<LatLngExpression[]>([]);

    const fetchShipments = useCallback(async () => {
        // Không setLoading(true) ở đây để tránh giật màn hình khi polling
        try {
            const filters = { search: debouncedSearchTerm, status: statusFilter };
            const response = await getShipments(filters);
            setShipments(response.data);
            if (response.data.length > 0 && !selectedShipment) {
                setSelectedShipment(response.data[0]);
            } else if (response.data.length === 0) {
                setSelectedShipment(null);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách lô hàng.");
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, statusFilter, selectedShipment]);

    const fetchAvailableDevices = async () => {
        try {
            const response = await getDevices({});
            setAvailableDevices(response.data);
        } catch (error) {
            toast.error("Không thể tải danh sách thiết bị.");
        }
    };
    
    useEffect(() => {
        setLoading(true);
        fetchShipments();
    }, [fetchShipments]);
    
    const fetchRoute = async (shipmentId: number) => {
        try {
            const response = await getShipmentRoute(shipmentId);
            setRoute(response.data as LatLngExpression[]);
        } catch (error) {
            setRoute([]);
        }
    };

    useEffect(() => {
        if (selectedShipment) {
            fetchRoute(selectedShipment.id);
        }
    }, [selectedShipment]);

    useEffect(() => {
        const moveInterval = setInterval(() => {
            setShipments(prev => prev.map(s => {
                if (s.status === 'in_transit' && s.currentLocation) {
                    return { ...s, currentLocation: { lat: s.currentLocation.lat + (Math.random() - 0.5) * 0.005, lng: s.currentLocation.lng + (Math.random() - 0.5) * 0.005 }};
                }
                return s;
            }));
        }, 5000);
        return () => clearInterval(moveInterval);
    }, []);

    const handleOpenCreateModal = () => {
        fetchAvailableDevices();
        setIsCreateModalOpen(true);
    };
    
    const handleOpenEditModal = (shipment: Shipment) => {
        setEditedData(shipment);
        setIsEditModalOpen(true);
    };

    const handleCreateShipment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newShipmentName || !selectedDeviceId || !newShipmentLat || !newShipmentLng) {
            toast.error("Vui lòng điền đủ thông tin.");
            return;
        }
        const promise = createShipment({ name: newShipmentName, device_id: selectedDeviceId, start_lat: parseFloat(newShipmentLat), start_lng: parseFloat(newShipmentLng) });
        toast.promise(promise, {
            loading: 'Đang tạo lô hàng...',
            success: (res) => {
                fetchShipments();
                setIsCreateModalOpen(false);
                setNewShipmentName('');
                setSelectedDeviceId(null);
                setNewShipmentLat('');
                setNewShipmentLng('');
                return `Tạo lô hàng "${res.data.name}" thành công!`;
            },
            error: (err) => `Tạo thất bại: ${err.response?.data?.detail || 'Lỗi không xác định'}`,
        });
    };
    
    const handleUpdateShipment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedData.id) return;
        
        const promise = updateShipment(editedData.id, { name: editedData.name, status: editedData.status });
        toast.promise(promise, {
            loading: 'Đang cập nhật...',
            success: () => {
                fetchShipments();
                setIsEditModalOpen(false);
                return 'Cập nhật thành công!';
            },
            error: 'Cập nhật thất bại.',
        });
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex-shrink-0 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Theo dõi Lô hàng</h1>
                <button onClick={handleOpenCreateModal} className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    <Plus size={16} />Tạo lô hàng mới
                </button>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="relative w-full max-w-xs"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search size={16} className="text-gray-400" /></div><input type="text" placeholder="Tìm theo tên hoặc mã tracker..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 p-2 text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/></div>
                <div className="flex items-center space-x-2"><ListFilter size={16} className="text-gray-500" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="block w-full border-gray-300 rounded-lg text-sm text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option value="">Tất cả trạng thái</option><option value="pending">Chờ xử lý</option><option value="in_transit">Đang vận chuyển</option><option value="completed">Đã hoàn thành</option><option value="failed">Gặp sự cố</option></select></div>
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-y-auto">
                    {loading ? ( <div className="flex items-center justify-center h-full text-gray-500"><Loader2 className="animate-spin mr-2" /> Đang tải...</div> ) : shipments.length > 0 ? ( <ul className="divide-y divide-gray-200 dark:divide-gray-700"> {shipments.map(shipment => ( <li key={shipment.id} onClick={() => setSelectedShipment(shipment)} className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${selectedShipment?.id === shipment.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''}`}><div className="flex justify-between items-center mb-1"><p className="font-semibold text-sm text-gray-900 dark:text-white">{shipment.name}</p><StatusBadge status={shipment.status} /></div><p className="text-xs text-gray-500 dark:text-gray-400">{shipment.start_location || 'N/A'} → {shipment.end_location || 'N/A'}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Thiết bị: <span className="font-mono">{shipment.device?.tracker_id || 'Chưa gán'}</span></p></li> ))} </ul> ) : ( <div className="flex items-center justify-center h-full text-gray-500"><p>Không có lô hàng nào.</p></div> )}
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col relative z-10">
                    <div className="flex-grow rounded-t-xl overflow-hidden">
                        <ShipmentMap shipments={shipments} selectedShipment={selectedShipment} route={route} />
                    </div>
                    <div className="flex-shrink-0 p-4 border-t dark:border-gray-600">
                        {selectedShipment ? ( <> <div className="flex justify-between items-start"> <h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedShipment.name}</h3> <button onClick={() => handleOpenEditModal(selectedShipment)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"> <Edit size={16} /> </button> </div> <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm"> <div><p className="text-xs text-gray-500 dark:text-gray-400">Trạng thái:</p><p className="font-medium"><StatusBadge status={selectedShipment.status} /></p></div> <div><p className="text-xs text-gray-500 dark:text-gray-400">Thiết bị:</p><p className="font-medium font-mono text-xs">{selectedShipment.device?.tracker_id || 'N/A'}</p></div> <div><p className="text-xs text-gray-500 dark:text-gray-400">Pin:</p><p className="font-medium">{selectedShipment.device?.battery ?? 'N/A'}{selectedShipment.device?.battery ? '%' : ''}</p></div> </div> </> ) : ( <p className="text-sm text-gray-500 p-4 text-center">Chọn một lô hàng để xem chi tiết.</p> )}
                    </div>
                </div>
            </div>

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Tạo lô hàng mới">
                <form onSubmit={handleCreateShipment} className="space-y-4">
                     <div><label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tên lô hàng</label><input type="text" value={newShipmentName} onChange={e => setNewShipmentName(e.target.value)} required className="w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                     <div><label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Gán thiết bị Tracker</label><select value={selectedDeviceId || ''} onChange={e => setSelectedDeviceId(Number(e.target.value))} required className="w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option value="" disabled>-- Chọn một thiết bị --</option>{availableDevices.map(device => ( <option key={device.id} value={device.id}> {device.name} ({device.tracker_id}) </option>))}</select></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Vĩ độ bắt đầu (Lat)</label><input type="number" step="any" value={newShipmentLat} onChange={e=> setNewShipmentLat(e.target.value)} required className="w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                        <div><label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Kinh độ bắt đầu (Lng)</label><input type="number" step="any" value={newShipmentLng} onChange={e=> setNewShipmentLng(e.target.value)} required className="w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700">Hủy</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">Tạo lô hàng</button></div>
                </form>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh sửa lô hàng">
                 <form onSubmit={handleUpdateShipment} className="space-y-4">
                     <div><label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tên lô hàng</label><input type="text" value={editedData.name || ''} onChange={e => setEditedData({...editedData, name: e.target.value})} required className="w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Trạng thái</label><select value={editedData.status || ''} onChange={e => setEditedData({...editedData, status: e.target.value})} className="w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option value="pending">Chờ xử lý</option><option value="in_transit">Đang vận chuyển</option><option value="completed">Đã hoàn thành</option><option value="failed">Gặp sự cố</option></select></div>
                    <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700">Hủy</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">Lưu thay đổi</button></div>
                </form>
            </Modal>
        </div>
    );
};
export default ShipmentListPage;