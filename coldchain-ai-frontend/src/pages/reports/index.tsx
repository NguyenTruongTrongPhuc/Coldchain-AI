import React, { useState, useEffect } from 'react';
import { FileText, Download, Plus, X, Loader2 } from 'lucide-react';
import { getReports, createReport } from '@/services/reportService'; // Giả sử bạn đã tạo service này
import { Report } from '@/types'; // Giả sử bạn đã tạo type này
import { toast } from 'react-hot-toast';


// Component Modal
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-1.5"><X size={20} /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const ReportsPage = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [reportType, setReportType] = useState('');
    const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(1); // Giả lập chọn lô hàng đầu tiên

    const fetchReports = async () => {
        try {
            // Không set loading ở đây để tránh giật màn hình khi polling
            const response = await getReports();
            setReports(response.data);
        } catch (error) {
            toast.error("Không thể tải danh sách báo cáo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchReports();
    }, []);

    const handleCreateReport = async () => {
        setIsCreateModalOpen(false);
        
        const promise = createReport({ 
            report_type: reportType, 
            shipment_id: reportType === 'journey' ? (selectedShipmentId ?? undefined) : undefined 
        });

        toast.promise(promise, {
            loading: 'Đang gửi yêu cầu...',
            success: (res) => {
                // Thêm báo cáo mới vào đầu danh sách với trạng thái 'processing'
                setReports(prev => [res.data, ...prev]);
                
                // --- PHẦN NÂNG CẤP CHÍNH: BẮT ĐẦU POLLING ---
                const interval = setInterval(async () => {
                    const updatedReports = await getReports();
                    const newReport = updatedReports.data.find(r => r.id === res.data.id);
                    if (newReport && newReport.status === 'completed') {
                        clearInterval(interval); // Dừng polling khi đã hoàn thành
                        fetchReports(); // Tải lại toàn bộ danh sách để chắc chắn
                        toast.success(`Báo cáo "${newReport.name}" đã tạo xong!`);
                    }
                }, 5000); // Kiểm tra lại sau mỗi 5 giây
                
                return 'Đã gửi yêu cầu tạo báo cáo.';
            },
            error: 'Gửi yêu cầu thất bại.',
        });
        
        setReportType('');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Báo cáo & Phân tích</h1>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    <Plus size={16} />
                    Tạo báo cáo mới
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full p-8 text-gray-500"><Loader2 className="animate-spin mr-2" /> Đang tải...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Tên Báo cáo</th>
                                    <th scope="col" className="px-6 py-3">Ngày tạo</th>
                                    <th scope="col" className="px-6 py-3">Trạng thái</th>
                                    <th scope="col" className="px-6 py-3 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{report.name}</td>
                                        <td className="px-6 py-4">{new Date(report.created_at).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-6 py-4">
                                            {report.status === 'completed' ? (
                                                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Hoàn thành</span>
                                            ) : (
                                                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center w-fit"><Loader2 size={12} className="animate-spin mr-1"/>Đang xử lý</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a 
                                                href={report.status === 'completed' ? `${process.env.NEXT_PUBLIC_API_URL}/reports/${report.id}/download` : '#'}
                                                className={`font-medium inline-flex items-center ${report.status === 'completed' ? 'text-blue-600 dark:text-blue-500 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
                                                onClick={(e) => { if (report.status !== 'completed') e.preventDefault(); }}
                                            >
                                                <Download size={14} className="mr-1" />
                                                Tải xuống
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Tạo báo cáo mới">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">1. Chọn loại báo cáo</label>
                        <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">-- Vui lòng chọn --</option>
                            <option value="journey">Báo cáo hành trình</option>
                            <option value="summary">Báo cáo tổng hợp</option>
                        </select>
                    </div>

                    {reportType === 'journey' && (
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-white">2. Chọn lô hàng</label>
                             <select onChange={e => setSelectedShipmentId(parseInt(e.target.value))} className="w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                {/* Sau này sẽ lấy danh sách lô hàng từ API */}
                                <option value={1}>Lô hàng Vắc-xin Moderna HN</option>
                                <option value={2}>Lô Hàng Rau Củ Đà Lạt</option>
                            </select>
                        </div>
                    )}
                    
                    <div className="flex justify-end pt-4">
                        <button onClick={handleCreateReport} disabled={!reportType} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                           Yêu cầu tạo
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ReportsPage;