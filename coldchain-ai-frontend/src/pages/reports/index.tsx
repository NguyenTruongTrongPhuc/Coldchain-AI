import React from 'react';
import { FileText, Download, BarChart2, AlertCircle, Clock, Plus } from 'lucide-react';

// --- DỮ LIỆU MÔ PHỎNG ---
const summaryData = [
    { title: "Tổng số báo cáo", value: 42, icon: FileText },
    { title: "Tỷ lệ hư hỏng trung bình", value: "2.5%", icon: AlertCircle },
    { title: "Thời gian vận chuyển TB", value: "3.2 ngày", icon: Clock },
];

const mockReports = [
    { id: 'REP-001', name: 'Báo cáo hành trình SH-001', date: '2025-07-20', type: 'PDF' },
    { id: 'REP-002', name: 'Dữ liệu cảm biến thô Q2/2025', date: '2025-07-01', type: 'CSV' },
    { id: 'REP-003', name: 'Báo cáo tổng hợp tháng 06/2025', date: '2025-07-01', type: 'PDF' },
    { id: 'REP-004', name: 'Báo cáo sự cố lô hàng SH-004', date: '2025-06-28', type: 'PDF' },
];

const ReportsPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Báo cáo & Phân tích</h1>
                <button className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    <Plus size={16} />
                    Tạo báo cáo mới
                </button>
            </div>

            {/* Thẻ KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {summaryData.map((item, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
                            <item.icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Bảng báo cáo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Tên Báo cáo</th>
                                <th scope="col" className="px-6 py-3">Ngày tạo</th>
                                <th scope="col" className="px-6 py-3">Định dạng</th>
                                <th scope="col" className="px-6 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockReports.map((report) => (
                                <tr key={report.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{report.name}</td>
                                    <td className="px-6 py-4">{report.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.type === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{report.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline inline-flex items-center">
                                            <Download size={14} className="mr-1" />
                                            Tải xuống
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;