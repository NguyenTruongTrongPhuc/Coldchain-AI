import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Truck, Thermometer, Bell, Settings, BarChart } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/shipments', label: 'Lô hàng', icon: Truck },
    { href: '/devices', label: 'Thiết bị', icon: Thermometer },
    { href: '/alerts', label: 'Cảnh báo', icon: Bell },
    { href: '/reports', label: 'Báo cáo', icon: BarChart },
    { href: '/settings', label: 'Cài đặt', icon: Settings },
];

const Sidebar = () => {
    const router = useRouter();

    return (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                <Truck className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">ColdChain-AI</span>
            </div>
            <nav className="mt-6 px-4">
                <ul>
                    {navItems.map((item) => {
                        const isActive = router.pathname === item.href;
                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-4 py-2.5 my-1 text-sm font-medium rounded-lg transition-colors duration-200
                                        ${isActive
                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </Link>
                            </li>

                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;