import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Wifi, WifiOff, BatteryFull, BatteryMedium, BatteryLow, MapPin, Plus, Filter, MoreVertical, Search, Edit, Trash2, Clock, Loader2, X, AlertTriangle } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { getDevices, createDevice, deleteDevice, updateDevice } from '@/services/deviceService';
import { Device } from '@/types';
import { toast } from 'react-hot-toast';

// Component Modal (Pop-up)
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-1.5">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ConnectionStatus = ({ status }: { status: string }) => { const isConnected = status === 'connected'; const IconComponent = isConnected ? Wifi : WifiOff; return (<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}><IconComponent size={14} className="mr-1" />{isConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>);};
const BatteryIndicator = ({ level }: { level: number | null }) => { if (level === null) return null; let Icon = BatteryMedium; let color = 'text-yellow-500'; if (level > 80) { Icon = BatteryFull; color = 'text-green-500'; } else if (level < 20) { Icon = BatteryLow; color = 'text-red-500'; } return (<div className={`flex items-center ${color}`}><Icon size={20} className="mr-1" /><span className="font-medium">{level}%</span></div>);};

const DeviceListPage = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [deviceToEdit, setDeviceToEdit] = useState<Device | null>(null);
    const [editedData, setEditedData] = useState({ tracker_id: '', name: '' });

    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

    const [newTrackerId, setNewTrackerId] = useState('');
    const [newDeviceName, setNewDeviceName] = useState('');

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const params: { search?: string, connection?: string } = {};
            if (debouncedSearchTerm) params.search = debouncedSearchTerm;
            if (statusFilter) params.connection = statusFilter;
            const response = await getDevices(params);
            setDevices(response.data);
        } catch (error) {
            console.error("Failed to fetch devices:", error);
            toast.error("Không thể tải danh sách thiết bị.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [debouncedSearchTerm, statusFilter]);

    const handleAddDevice = async (e: React.FormEvent) => {
        e.preventDefault();
        const promise = createDevice({ tracker_id: newTrackerId, name: newDeviceName });

        toast.promise(promise, {
            loading: 'Đang thêm thiết bị...',
            success: (res) => {
                fetchDevices();
                setIsModalOpen(false);
                setNewTrackerId('');
                setNewDeviceName('');
                return `Thêm thiết bị ${res.data.name} thành công!`;
            },
            error: (err) => {
                 return err.response?.data?.detail || "Thêm thiết bị thất bại.";
            },
        });
    };

    const handleDeleteDevice = async () => {
        if (!deviceToDelete) return;

        const promise = deleteDevice(deviceToDelete.id);

        toast.promise(promise, {
            loading: 'Đang xóa thiết bị...',
            success: () => {
                fetchDevices(); // Tải lại danh sách sau khi xóa
                setDeviceToDelete(null); // Đóng modal xác nhận
                return `Xóa thiết bị ${deviceToDelete.name} thành công!`;
            },
            error: (err) => `Xóa thất bại: ${err.response?.data?.detail || 'Lỗi không xác định'}`,
        });
    };

    const openEditModal = (device: Device) => {
        setDeviceToEdit(device);
        setEditedData({ tracker_id: device.tracker_id, name: device.name });
        setActiveMenu(null); // Đóng menu dropdown
    };

    const handleUpdateDevice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deviceToEdit) return;

        const promise = updateDevice(deviceToEdit.id, editedData);

        toast.promise(promise, {
            loading: 'Đang cập nhật...',
            success: () => {
                fetchDevices(); // Tải lại danh sách
                setDeviceToEdit(null); // Đóng modal
                return 'Cập nhật thiết bị thành công!';
            },
            error: (err) => `Cập nhật thất bại: ${err.response?.data?.detail || 'Lỗi không xác định'}`,
        });
    };
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quản lý Thiết bị</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    <Plus size={16} />
                    Thêm thiết bị mới
                </button>
            </div>
            
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search size={16} className="text-gray-400" /></div>
                    <input type="text" placeholder="Tìm theo mã hoặc tên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 p-2 text-gray-900 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/>
                </div>
                <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full border-gray-300 rounded-lg text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="connected">Đã kết nối</option>
                        <option value="disconnected">Mất kết nối</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr><th scope="col" className="px-6 py-3">Mã Tracker</th><th scope="col" className="px-6 py-3">Tên Gợi nhớ</th><th scope="col" className="px-6 py-3">Trạng thái</th><th scope="col" className="px-6 py-3">Vị trí cuối</th><th scope="col" className="px-6 py-3">Pin</th><th scope="col" className="px-6 py-3 text-center">Hành động</th></tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center p-8"><Loader2 className="inline-block animate-spin mr-2" /> Đang tải dữ liệu...</td></tr>
                            ) : devices.length > 0 ? (
                                devices.map((device) => (
                                    <tr key={device.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-mono text-xs text-gray-900 whitespace-nowrap dark:text-white"><Link href={`/devices/${device.id}`} className="hover:underline hover:text-blue-500">{device.tracker_id}</Link></th>
                                        <td className="px-6 py-4">{device.name}</td>
                                        <td className="px-6 py-4"><ConnectionStatus status={device.connection} /></td>
                                        <td className="px-6 py-4"><div className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400" />{device.last_location || 'N/A'}</div></td>
                                        <td className="px-6 py-4"><BatteryIndicator level={device.battery} /></td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="relative"><button onClick={() => setActiveMenu(activeMenu === device.id ? null : device.id)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><MoreVertical size={16} /></button>
                                                {activeMenu === device.id && (
                                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border dark:border-gray-600">
                                                        <Link href={`/devices/${device.id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><Clock size={14} className="mr-2" /> Xem chi tiết & Real-time</Link>
                                                        <button onClick={() => openEditModal(device)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                            <Edit size={14} className="mr-2" /> Chỉnh sửa thông tin
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setDeviceToDelete(device);
                                                                setActiveMenu(null); // Đóng menu dropdown
                                                            }} 
                                                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        >
                                                            <Trash2 size={14} className="mr-2" /> Xóa thiết bị
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="text-center p-8 text-gray-500">Không có thiết bị nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm thiết bị mới">
                <form onSubmit={handleAddDevice} className="space-y-4">
                    <div>
                        <label htmlFor="tracker_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Mã Tracker (ID)</label>
                        <input type="text" id="tracker_id" value={newTrackerId} onChange={e => setNewTrackerId(e.target.value)} required className="mt-1 block w-full text-gray-900 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="device_name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tên gợi nhớ</label>
                        <input type="text" id="device_name" value={newDeviceName} onChange={e => setNewDeviceName(e.target.value)} required className="mt-1 block w-full text-gray-900 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700">Hủy</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">Thêm thiết bị</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!deviceToDelete} onClose={() => setDeviceToDelete(null)} title="Xác nhận xóa">
                <div className="text-center">
                    <AlertTriangle className="mx-auto mb-4 h-14 w-14 text-red-500" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa thiết bị <br />
                        <span className="font-bold font-mono">{deviceToDelete?.tracker_id}</span>?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <button onClick={handleDeleteDevice} className="px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700">
                            Vâng, tôi chắc chắn
                        </button>
                        <button onClick={() => setDeviceToDelete(null)} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700">
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!deviceToEdit} onClose={() => setDeviceToEdit(null)} title="Chỉnh sửa thiết bị">
                <form onSubmit={handleUpdateDevice} className="space-y-4">
                    <div>
                        <label htmlFor="edit_tracker_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Mã Tracker (ID)</label>
                        <input type="text" id="edit_tracker_id" value={editedData.tracker_id} onChange={e => setEditedData({...editedData, tracker_id: e.target.value})} required className="mt-1 block w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="edit_device_name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tên gợi nhớ</label>
                        <input type="text" id="edit_device_name" value={editedData.name} onChange={e => setEditedData({...editedData, name: e.target.value})} required className="mt-1 block w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={() => setDeviceToEdit(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700">Hủy</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">Lưu thay đổi</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
export default DeviceListPage;