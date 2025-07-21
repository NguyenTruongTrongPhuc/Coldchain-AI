import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Truck, Thermometer, BatteryFull, Bell, Move, AlertTriangle } from 'lucide-react';

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- DỮ LIỆU MÔ PHỎNG MỚI ---
const initialKpiData = [
    { id: 'shipments', title: "Lô hàng đang đi", value: 12, icon: Truck, color: "text-blue-500" },
    { id: 'temp_alerts', title: "Cảnh báo nhiệt độ", value: 3, icon: Thermometer, color: "text-orange-500" },
    { id: 'battery_alerts', title: "Thiết bị sắp hết pin", value: 2, icon: BatteryFull, color: "text-red-500" },
    { id: 'notifications', title: "Thông báo mới", value: 8, icon: Bell, color: "text-green-500" },
];

const mockCriticalAlerts = [
    { id: 'AL-001', type: 'Nhiệt độ cao', shipmentId: 'VN-240721-001', priority: 'Cao' },
    { id: 'AL-003', type: 'Nhiệt độ thấp', shipmentId: 'VN-240720-004', priority: 'Cao' },
    { id: 'AL-002', type: 'Va đập mạnh', shipmentId: 'VN-240721-002', priority: 'Trung bình' },
];

const DashboardPage = () => {
    const [kpiData, setKpiData] = useState(initialKpiData);
    
    // Cấu hình layout cho các widget, thêm 2 widget mới
    const [layouts, setLayouts] = useState({
        lg: [
            // 4 KPI cards ở trên
            { i: 'shipments', x: 0, y: 0, w: 1, h: 1 },
            { i: 'temp_alerts', x: 1, y: 0, w: 1, h: 1 },
            { i: 'battery_alerts', x: 2, y: 0, w: 1, h: 1 },
            { i: 'notifications', x: 3, y: 0, w: 1, h: 1 },
            // 2 widget mới ở dưới
            { i: 'live_map', x: 0, y: 1, w: 3, h: 3, isResizable: false },
            { i: 'critical_alerts', x: 3, y: 1, w: 1, h: 3 },
        ]
    });

    // Mô phỏng live update
    useEffect(() => {
        const interval = setInterval(() => {
            setKpiData(currentData => currentData.map(item => (Math.random() > 0.7 ? { ...item, value: item.value + 1 } : item)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const onLayoutChange = (layout: any, allLayouts: any) => {
        setLayouts(allLayouts);
    };

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tổng quan</h1>
                <div className="flex items-center space-x-2 text-sm text-green-500">
                    <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
                    <span>Live</span>
                </div>
            </div>

            <ResponsiveGridLayout
                layouts={layouts}
                onLayoutChange={onLayoutChange}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
                rowHeight={120}
            >
                {/* Render các KPI cards */}
                {kpiData.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center space-x-4 cursor-move">
                        <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${item.color}`}><item.icon className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                        </div>
                    </div>
                ))}

                {/* Widget bản đồ Live */}
                <div key="live_map" className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex-shrink-0">Bản đồ theo dõi trực tiếp</h3>
                    <div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                        (Placeholder cho Bản đồ)
                    </div>
                </div>

                {/* Widget cảnh báo quan trọng */}
                <div key="critical_alerts" className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex-shrink-0">Cảnh báo quan trọng</h3>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto">
                        {mockCriticalAlerts.map(alert => (
                             <li key={alert.id} className="py-3">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${alert.priority === 'Cao' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                                        {alert.type.includes('Nhiệt độ') ? <Thermometer size={16} className="text-red-500" /> : <Move size={16} className="text-yellow-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.type}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Lô hàng: {alert.shipmentId}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </ResponsiveGridLayout>
        </div>
    );
};

export default DashboardPage;