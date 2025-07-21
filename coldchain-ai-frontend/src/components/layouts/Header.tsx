import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
            <div>
                {/* Có thể thêm thanh tìm kiếm ở đây */}
            </div>
            <div className="flex items-center">
                <div className="relative">
                    <button className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-600 flex items-center justify-center">
                            <span className="text-lg font-semibold text-blue-700 dark:text-white">
                                {user?.full_name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="text-left hidden md:block">
                            <div className="font-semibold text-sm text-gray-800 dark:text-white">{user?.full_name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                        </div>
                    </button>
                </div>
                <button
                    onClick={logout}
                    className="ml-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    title="Đăng xuất"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;