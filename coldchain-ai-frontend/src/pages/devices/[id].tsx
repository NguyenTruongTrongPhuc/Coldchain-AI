import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Battery, Signal, Map, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { getDeviceById, getDeviceLogs } from '@/services/deviceService';
import { Device, ActivityLog } from '@/types';

const DeviceDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [device, setDevice] = useState<Device | null>(null);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof id === 'string') {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    // Gọi đồng thời cả hai API
                    const [deviceRes, logsRes] = await Promise.all([
                        getDeviceById(id),
                        getDeviceLogs(id)
                    ]);
                    setDevice(deviceRes.data);
                    setLogs(logsRes.data);
                } catch (error) {
                    console.error("Failed to fetch device details:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id]);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /> Đang tải...</div>;
    }

    if (!device) {
        return <div className="text-center">Không tìm thấy thiết bị.</div>;
    }

    // Chuyển đổi dữ liệu log thành dữ liệu cho biểu đồ (lấy 10 điểm gần nhất)
    const chartData = logs.slice(0, 10).reverse().map(log => ({
        time: new Date(log.timestamp).toLocaleTimeString('vi-VN'),
        // Giả sử content log có dạng "Nhiệt độ: 4.2°C, Độ ẩm: 61%"
        temp: parseFloat(log.content.match(/Nhiệt độ: ([\d.]+)/)?.[1] || '0'),
        humidity: parseFloat(log.content.match(/Độ ẩm: ([\d.]+)/)?.[1] || '0'),
    }));

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-gray-500">{device.tracker_id}</p>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{device.name}</h1>
            </div>

            {/* Thẻ KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700"><div className="flex items-center"><Thermometer className="mr-2 text-red-500" /><div><p className="text-xs text-gray-500">Nhiệt độ</p><p className="font-bold text-lg">N/A</p></div></div></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700"><div className="flex items-center"><Droplets className="mr-2 text-blue-500" /><div><p className="text-xs text-gray-500">Độ ẩm</p><p className="font-bold text-lg">N/A</p></div></div></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700"><div className="flex items-center"><Battery className="mr-2 text-green-500" /><div><p className="text-xs text-gray-500">Pin</p><p className="font-bold text-lg">{device.battery ?? 'N/A'}%</p></div></div></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700"><div className="flex items-center"><Signal className="mr-2 text-indigo-500" /><div><p className="text-xs text-gray-500">Trạng thái</p><p className="font-bold text-lg">{device.connection}</p></div></div></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Biểu đồ */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Lịch sử Cảm biến</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="time" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                <Legend />
                                <Line type="monotone" dataKey="temp" name="Nhiệt độ (°C)" stroke="#ef4444" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="humidity" name="Độ ẩm (%)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lịch sử hoạt động */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 flex flex-col">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 px-2">Lịch sử hoạt động</h3>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto flex-grow">
                        {logs.map(log => (
                            <li key={log.id} className="py-3 px-2">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                                        {log.log_type === 'user_note' ? <MessageSquare size={16} className="text-blue-500"/> : <Clock size={16} className="text-gray-500"/>}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800 dark:text-gray-200">{log.content}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(log.timestamp).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetailPage;