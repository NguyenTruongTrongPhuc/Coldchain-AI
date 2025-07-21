import React, { useState } from 'react';
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
        <main className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md mx-auto p-6">
                <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-4 sm:p-7">
                        <div className="text-center">
                            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Đăng ký</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Đã có tài khoản?
                                <Link href="/login" className="ml-1 text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                    Đăng nhập tại đây
                                </Link>
                            </p>
                        </div>

                        <div className="mt-5">
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm mb-2 dark:text-white">Họ và tên</label>
                                        <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Địa chỉ Email</label>
                                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" required />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Mật khẩu</label>
                                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" required />
                                    </div>
                                    <button type="submit" className="btn-primary">Đăng ký</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}