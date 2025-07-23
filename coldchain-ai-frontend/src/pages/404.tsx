import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

const Custom404 = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">404 - Không tìm thấy trang</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Xin lỗi, chúng tôi không thể tìm thấy trang bạn yêu cầu.</p>
            <Link href="/" className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Quay về Trang chủ
            </Link>
        </div>
    );
};

export default Custom404;