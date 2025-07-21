// src/pages/register.tsx
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register({ full_name: fullName, email, password });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-white">Tạo tài khoản</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Họ và tên</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Mật khẩu</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md" required />
                    </div>
                    <button type="submit" className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Đăng ký</button>
                </form>
                <p className="text-sm text-center text-gray-400">Đã có tài khoản? <Link href="/login" className="font-medium text-blue-400 hover:underline">Đăng nhập</Link></p>
            </div>
        </div>
    );
}