import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Battery, Signal, Map } from 'lucide-react';

// --- HÀM TẠO DỮ LIỆU REAL-TIME MÔ PHỎNG ---
const generateInitialData = () => {
    let data = [];
    const now = new Date();
    for (let i = 10; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5000); // Dữ liệu mỗi 5 giây
        data.push({
            time: time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            temp: (Math.random() * (4.5 - 3.5) + 3.5).toFixed(1),
            humidity: (Math.random() * (65 - 55) + 55).toFixed(1),
        });
    }
    return data;
};

const DeviceDetailPage = () => {
    const router = useRouter();
    const { id } = router.query; // Lấy ID thiết bị từ URL

    // State cho dữ liệu real-time
    const [chartData, setChartData] = useState(generateInitialData());
    const [currentStats, setCurrentStats] = useState({
        temp: 4.2,
        humidity: 61,
        battery: 94,
        signal: 'Tốt',
    });
    
    // Mô phỏng việc nhận dữ liệu mới mỗi 5 giây
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const newTemp = (Math.random() * (4.5 - 3.5) + 3.5).toFixed(1);
            const newHumidity = (Math.random() * (65 - 55) + 55).toFixed(1);
            
            // Cập nhật biểu đồ
            setChartData(prevData => {
                const newData = [...prevData.slice(1), {
                    time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    temp: newTemp,
                    humidity: newHumidity,
                }];
                return newData;
            });

            // Cập nhật thẻ KPI
            setCurrentStats(prev => ({
                ...prev,
                temp: parseFloat(newTemp),
                humidity: parseInt(newHumidity),
                battery: prev.battery > 0 ? prev.battery - 1 : 0, // Giảm pin từ từ
            }));

        }, 5000); // 5 giây

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm text-gray-500">Chi tiết thiết bị</p>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white font-mono">{id}</h1>
            </div>

            {/* Thẻ KPI Real-time */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700"><div className="flex items-center"><Thermometer className="mr-2 text-red-500" /><div><p className="text-xs text-gray-500">Nhiệt độ</p><p className="font-bold text-lg">{currentStats.temp}°C</p></div></div></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700"><div className="flex items-center"><Droplets className="mr-2 text-blue-500" /><div><p className="text-xs text-gray-500">Độ ẩm</p><p className="font-bold text-lg">{currentStats.humidity}%</p></div></div></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700"><div className="flex items-center"><Battery className="mr-2 text-green-500" /><div><p className="text-xs text-gray-500">Pin</p><p className="font-bold text-lg">{currentStats.battery}%</p></div></div></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700"><div className="flex items-center"><Signal className="mr-2 text-indigo-500" /><div><p className="text-xs text-gray-500">Tín hiệu GPS</p><p className="font-bold text-lg">{currentStats.signal}</p></div></div></div>
            </div>

            {/* Khu vực biểu đồ và bản đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Biểu đồ Real-time */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Lịch sử nhiệt độ & độ ẩm (5 phút gần nhất)</h3>
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

                {/* Bản đồ vị trí */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-700 flex flex-col">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Vị trí hiện tại</h3>
                    <div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                         <div className="text-center">
                            <Map size={48} className="mx-auto mb-2" />
                            <p className="font-semibold">Bản đồ vị trí thiết bị</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetailPage;