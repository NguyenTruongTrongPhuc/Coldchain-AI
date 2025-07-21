import { Truck, Bell, AlertTriangle, Thermometer, Droplets, BatteryFull } from 'lucide-react';

const kpiData = [
    { title: "Lô hàng đang đi", value: 12, icon: Truck, color: "text-blue-500" },
    { title: "Cảnh báo nhiệt độ", value: 3, icon: Thermometer, color: "text-orange-500" },
    { title: "Thiết bị sắp hết pin", value: 2, icon: BatteryFull, color: "text-red-500" },
    { title: "Thông báo mới", value: 8, icon: Bell, color: "text-green-500" },
];

const recentShipments = [
    { id: 'VN-240721-001', to: 'Kho Hà Nội', status: 'Đang vận chuyển', progress: 75, temp: 4.5, humidity: 62 },
    { id: 'VN-240721-002', to: 'Kho Đà Nẵng', status: 'Đang vận chuyển', progress: 30, temp: 2.1, humidity: 55 },
    { id: 'VN-240720-005', to: 'Kho Cần Thơ', status: 'Đã hoàn thành', progress: 100, temp: 3.0, humidity: 58 },
    { id: 'VN-240720-004', to: 'Kho Hải Phòng', status: 'Gặp sự cố', progress: 50, temp: 8.2, humidity: 70 },
];

const StatusBadge = ({ status }: { status: string }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center";
    switch (status) {
        case 'Đang vận chuyển':
            return <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`}>{status}</span>;
        case 'Đã hoàn thành':
            return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>{status}</span>;
        case 'Gặp sự cố':
            return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}>{status}</span>;
        default:
            return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>{status}</span>;
    }
};

const DashboardPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tổng quan</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center space-x-4">
                        <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${item.color}`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Shipments Table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Các lô hàng gần đây</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Mã Lô Hàng</th>
                                <th scope="col" className="px-6 py-3">Điểm đến</th>
                                <th scope="col" className="px-6 py-3">Trạng thái</th>
                                <th scope="col" className="px-6 py-3">Tiến độ</th>
                                <th scope="col" className="px-6 py-3 text-center">Nhiệt độ / Độ ẩm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentShipments.map((shipment) => (
                                <tr key={shipment.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{shipment.id}</th>
                                    <td className="px-6 py-4">{shipment.to}</td>
                                    <td className="px-6 py-4"><StatusBadge status={shipment.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${shipment.progress}%` }}></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                        <Thermometer size={16} className="text-red-500" /> <span>{shipment.temp}°C</span>
                                        <Droplets size={16} className="text-blue-500" /> <span>{shipment.humidity}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;