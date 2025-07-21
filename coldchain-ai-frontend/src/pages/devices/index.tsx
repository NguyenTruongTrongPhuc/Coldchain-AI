import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Wifi, WifiOff, BatteryFull, BatteryMedium, BatteryLow, MapPin, Plus, Filter, MoreVertical, Search, Edit, Trash2, Clock } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

// --- DỮ LIỆU MÔ PHỎNG ---
const mockDevices = [
    { id: 'GPS-TRACKER-001', name: 'Thùng hàng A12', status: 'active', connection: 'connected', lastLocation: 'Quận 1, TP.HCM', battery: 95 },
    { id: 'GPS-TRACKER-002', name: 'Xe tải 51H-12345', status: 'active', connection: 'connected', lastLocation: 'Hải Châu, Đà Nẵng', battery: 78 },
    { id: 'GPS-TRACKER-003', name: 'Thùng hàng B05', status: 'inactive', connection: 'disconnected', lastLocation: 'Hoàn Kiếm, Hà Nội', battery: 15 },
    { id: 'GPS-TRACKER-004', name: 'Xe đông lạnh 29C-67890', status: 'active', connection: 'connected', lastLocation: 'Ninh Kiều, Cần Thơ', battery: 55 },
    { id: 'GPS-TRACKER-005', name: 'Container C7', status: 'active', connection: 'disconnected', lastLocation: 'Cầu Giấy, Hà Nội', battery: 82 },
];
// ----------------------------------------------------

const ConnectionStatus = ({ status }: { status: string }) => { const isConnected = status === 'connected'; const IconComponent = isConnected ? Wifi : WifiOff; return (<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}><IconComponent size={14} className="mr-1" />{isConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>);};
const BatteryIndicator = ({ level }: { level: number }) => { let Icon = BatteryMedium; let color = 'text-yellow-500'; if (level > 80) { Icon = BatteryFull; color = 'text-green-500'; } else if (level < 20) { Icon = BatteryLow; color = 'text-red-500'; } return (<div className={`flex items-center ${color}`}><Icon size={20} className="mr-1" /><span className="font-medium">{level}%</span></div>);};

const DeviceListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const filteredDevices = useMemo(() => {
        return mockDevices.filter(device => {
            const matchesSearch = device.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || device.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const matchesFilter = statusFilter === 'all' || device.connection === statusFilter;
            return matchesSearch && matchesFilter;
        });
    }, [debouncedSearchTerm, statusFilter]);
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quản lý Thiết bị</h1>
                <button className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={16} />Thêm thiết bị mới</button>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="relative w-full max-w-xs"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search size={16} className="text-gray-400" /></div><input type="text" placeholder="Tìm theo mã hoặc tên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 p-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"/></div>
                <div className="flex items-center space-x-2"><Filter size={16} className="text-gray-500" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="block w-full border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"><option value="all">Tất cả trạng thái</option><option value="connected">Đã kết nối</option><option value="disconnected">Mất kết nối</option></select></div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                             <tr>
                                <th scope="col" className="px-6 py-3">Mã Tracker</th><th scope="col" className="px-6 py-3">Tên Gợi nhớ</th><th scope="col" className="px-6 py-3">Trạng thái</th><th scope="col" className="px-6 py-3">Vị trí cuối</th><th scope="col" className="px-6 py-3">Pin</th><th scope="col" className="px-6 py-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDevices.map((device) => (
                                <tr key={device.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-mono text-xs text-gray-900 whitespace-nowrap dark:text-white">
                                        <Link href={`/devices/${device.id}`} className="hover:underline hover:text-blue-500">
                                            {device.id}
                                        </Link>
                                    </th>
                                    <td className="px-6 py-4">{device.name}</td>
                                    <td className="px-6 py-4"><ConnectionStatus status={device.connection} /></td>
                                    <td className="px-6 py-4"><div className="flex items-center"><MapPin size={16} className="mr-2 text-gray-400" />{device.lastLocation}</div></td>
                                    <td className="px-6 py-4"><BatteryIndicator level={device.battery} /></td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="relative">
                                            <button onClick={() => setActiveMenu(activeMenu === device.id ? null : device.id)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <MoreVertical size={16} />
                                            </button>
                                            {activeMenu === device.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border dark:border-gray-600">
                                                    <a href={`/devices/${device.id}`} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><Clock size={14} className="mr-2" /> Xem chi tiết & Real-time</a>
                                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><Edit size={14} className="mr-2" /> Chỉnh sửa</a>
                                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"><Trash2 size={14} className="mr-2" /> Xóa</a>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredDevices.length === 0 && (<div className="text-center p-8 text-gray-500">Không tìm thấy thiết bị nào phù hợp.</div>)}
                </div>
            </div>
        </div>
    );
};
export default DeviceListPage;