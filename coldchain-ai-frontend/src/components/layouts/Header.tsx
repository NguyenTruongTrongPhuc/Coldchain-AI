// src/components/layouts/Header.tsx
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    return (
        <header className="bg-gray-800 p-4 flex justify-between items-center text-white">
            <div></div>
            <div className="flex items-center">
                <span>Chào, {user?.full_name || 'User'}</span>
                <button onClick={logout} className="ml-4 p-2 rounded-full hover:bg-gray-700" title="Đăng xuất"><LogOut size={20} /></button>
            </div>
        </header>
    );
};

export default Header;