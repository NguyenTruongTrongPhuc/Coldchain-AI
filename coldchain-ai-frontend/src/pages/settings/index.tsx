import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const SettingsPage = () => {
    const { user } = useAuth();
    // State mô phỏng cho các cài đặt
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
    });

    const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications({
            ...notifications,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Cài đặt</h1>

            {/* Card thông tin tài khoản */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin tài khoản</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Họ và tên</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={user?.full_name || ''}
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={user?.email || ''}
                            disabled
                        />
                    </div>
                    <button className="text-sm text-blue-600 hover:underline">Đổi mật khẩu</button>
                </div>
            </div>

            {/* Card cài đặt thông báo */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cài đặt thông báo</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Thông báo qua Email</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nhận các cảnh báo quan trọng và báo cáo qua email.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="email" checked={notifications.email} onChange={handleNotificationChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                     <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Thông báo qua SMS</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nhận các cảnh báo khẩn cấp qua tin nhắn (yêu cầu cấu hình số điện thoại).</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="sms" checked={notifications.sms} onChange={handleNotificationChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

             <div className="flex justify-end">
                <button className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;