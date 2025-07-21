// src/pages/index.tsx
import { Truck, Bell, AlertTriangle } from 'lucide-react';

const kpis = [
    { title: 'Lô hàng đang vận chuyển', value: '12', icon: Truck },
    { title: 'Cảnh báo trong 24h', value: '3', icon: Bell },
    { title: 'Lô hàng có nguy cơ', value: '2', icon: AlertTriangle },
];

const DashboardPage = () => {
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {kpis.map((kpi, index) => (
                    <div key={index} className="bg-gray-800 p-6 rounded-lg flex items-center">
                        <kpi.icon className="w-12 h-12 text-blue-400 mr-4" />
                        <div>
                            <p className="text-gray-400 text-sm">{kpi.title}</p>
                            <p className="text-3xl font-bold">{kpi.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Các phần khác của dashboard sẽ được thêm ở đây */}
        </div>
    );
};

export default DashboardPage;