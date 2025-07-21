import React from 'react';
import { Thermometer, Move, AlertTriangle, Filter, CheckCircle } from 'lucide-react';

// --- DỮ LIỆU MÔ PHỎNG ---
const mockAlerts = [
    { id: 'AL-001', type: 'Nhiệt độ cao', shipmentId: 'VN-240721-001', priority: 'Cao', timestamp: '2025-07-21 14:30:05', details: 'Nhiệt độ vượt ngưỡng 8°C, đạt 8.2°C.' },
    { id: 'AL-002', type: 'Va đập mạnh', shipmentId: 'VN-240721-002', priority: 'Trung bình', timestamp: '2025-07-21 11:15:22', details: 'Ghi nhận va đập 2.5G.' },
    { id: 'AL-003', type: 'Nhiệt độ thấp', shipmentId: 'VN-240720-004', priority: 'Cao', timestamp: '2025-07-20 22:01:45', details: 'Nhiệt độ dưới ngưỡng 2°C, đạt 1.8°C.' },
    { id: 'AL-004', type: 'Dự báo nguy cơ', shipmentId: 'VN-240721-001', priority: 'Thấp', timestamp: '2025-07-21 15:00:00', details: 'AI dự báo có 75% khả năng nhiệt độ vượt ngưỡng trong 2 giờ tới.' },
];

const PriorityBadge = ({ priority }: { priority: string }) => {
    const colorClasses = {
        'Cao': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'Trung bình': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Thấp': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${colorClasses[priority as keyof typeof colorClasses]}`}>{priority}</span>;
};

const AlertIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'Nhiệt độ cao':
        case 'Nhiệt độ thấp':
            return <Thermometer className="h-5 w-5 text-red-500" />;
        case 'Va đập mạnh':
            return <Move className="h-5 w-5 text-yellow-500" />;
        case 'Dự báo nguy cơ':
            return <AlertTriangle className="h-5 w-5 text-blue-500" />;
        default:
            return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
};

const AlertsPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Lịch sử Cảnh báo</h1>
                <button className="inline-flex items-center justify-center gap-x-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                    <Filter size={16} className="text-gray-500" />
                    Bộ lọc
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockAlerts.map((alert) => (
                        <li key={alert.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <AlertIcon type={alert.type} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{alert.type} - Lô hàng {alert.shipmentId}</p>
                                        <PriorityBadge priority={alert.priority} />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alert.details}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(alert.timestamp).toLocaleString('vi-VN')}</p>
                                </div>
                                <button className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400">
                                    Xem chi tiết
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AlertsPage;