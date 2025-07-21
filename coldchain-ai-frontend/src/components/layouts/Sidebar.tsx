// src/components/layouts/Sidebar.tsx
import Link from 'next/link';
import { LayoutDashboard, Truck, Thermometer, Bell } from 'lucide-react';

const Sidebar = () => (
    <div className="w-64 bg-gray-800 text-white p-5 flex flex-col">
        <div className="text-2xl font-bold mb-10">ColdChain-AI</div>
        <nav>
            <ul>
                <li className="mb-4"><Link href="/" className="flex items-center p-2 rounded-md hover:bg-gray-700"><LayoutDashboard className="mr-3" />Dashboard</Link></li>
                <li className="mb-4"><Link href="/shipments" className="flex items-center p-2 rounded-md hover:bg-gray-700"><Truck className="mr-3" />Lô hàng</Link></li>
                <li className="mb-4"><Link href="/devices" className="flex items-center p-2 rounded-md hover:bg-gray-700"><Thermometer className="mr-3" />Thiết bị</Link></li>
                <li className="mb-4"><Link href="/alerts" className="flex items-center p-2 rounded-md hover:bg-gray-700"><Bell className="mr-3" />Cảnh báo</Link></li>
            </ul>
        </nav>
    </div>
);

export default Sidebar;