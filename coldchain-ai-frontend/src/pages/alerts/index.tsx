import React, { useState, useEffect } from 'react';
import { Thermometer, Move, AlertTriangle, Filter, X, Loader2 } from 'lucide-react';
import { getAlerts, resolveAlert, AlertFilters } from '@/services/alertService';
import { Alert } from '@/types';
import { toast } from 'react-hot-toast';

// Component Modal (Pop-up)
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-1.5"><X size={20} /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const PriorityBadge = ({ priority }: { priority: string }) => { const colorClasses = { 'Cao': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', 'Trung bình': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', 'Thấp': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', }; return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${colorClasses[priority as keyof typeof colorClasses]}`}>{priority}</span>; };
const AlertIcon = ({ type }: { type: string }) => { switch (type) { case 'Nhiệt độ cao': case 'Nhiệt độ thấp': return <Thermometer className="h-5 w-5 text-red-500" />; case 'Va đập mạnh': return <Move className="h-5 w-5 text-yellow-500" />; case 'Dự báo nguy cơ': return <AlertTriangle className="h-5 w-5 text-blue-500" />; default: return <AlertTriangle className="h-5 w-5 text-gray-500" />; }};

const AlertsPage = () => {
    const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [resolutionNote, setResolutionNote] = useState('');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [filters, setFilters] = useState<Omit<AlertFilters, 'status'>>({});
    const [tempFilters, setTempFilters] = useState<Omit<AlertFilters, 'status'>>({});

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await getAlerts({ status: activeTab, ...filters });
            setAlerts(response.data);
        } catch (error) {
            toast.error("Không thể tải danh sách cảnh báo.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAlerts();
    }, [activeTab, filters]);

    const handleResolveAlert = async () => {
        if (!selectedAlert) return;
        const promise = resolveAlert(selectedAlert.id, { resolution_note: resolutionNote });
        
        toast.promise(promise, {
            loading: 'Đang xử lý...',
            success: () => {
                fetchAlerts(); // Tải lại danh sách cho tab hiện tại
                closeDetailModal();
                return 'Cảnh báo đã được xử lý.';
            },
            error: 'Xử lý thất bại.',
        });
    };

    const openDetailModal = (alert: Alert) => {
        setSelectedAlert(alert);
    };

    const closeDetailModal = () => {
        setSelectedAlert(null);
        setIsResolving(false);
        setResolutionNote('');
    };
    
    const handleApplyFilters = () => {
        setFilters(tempFilters);
        setIsFilterPanelOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quản lý Cảnh báo</h1>
                <button onClick={() => setIsFilterPanelOpen(true)} className="inline-flex items-center justify-center gap-x-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                    <Filter size={16} className="text-gray-500" />
                    Bộ lọc nâng cao
                </button>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('active')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'active' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Đang hoạt động</button>
                    <button onClick={() => setActiveTab('resolved')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'resolved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Đã xử lý</button>
                </nav>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full p-8 text-gray-500"><Loader2 className="animate-spin mr-2" /> Đang tải...</div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {alerts.length > 0 ? alerts.map((alert) => (
                            <li key={alert.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0"><AlertIcon type={alert.alert_type} /></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{alert.alert_type} - Lô hàng {alert.shipment_id}</p>
                                            {alert.status === 'active' ? <PriorityBadge priority={alert.priority} /> : <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Đã xử lý</span>}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{alert.message}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(alert.timestamp).toLocaleString('vi-VN')}</p>
                                    </div>
                                    <button onClick={() => openDetailModal(alert)} className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400">Xem chi tiết</button>
                                </div>
                            </li>
                        )) : <p className="p-8 text-center text-gray-500">Không có cảnh báo nào.</p>}
                    </ul>
                )}
            </div>
            
            <Modal isOpen={!!selectedAlert} onClose={closeDetailModal} title="Chi tiết Cảnh báo">
                {selectedAlert && (
                    <div className="space-y-4 text-sm">
                        <div className="space-y-2 text-gray-600 dark:text-gray-300">
                            <p><strong className="font-semibold text-gray-900 dark:text-white">ID:</strong> <span className="font-mono">{selectedAlert.id}</span></p>
                            <p><strong className="font-semibold text-gray-900 dark:text-white">Lô hàng:</strong> {selectedAlert.shipment_id}</p>
                            <p><strong className="font-semibold text-gray-900 dark:text-white">Thời gian:</strong> {new Date(selectedAlert.timestamp).toLocaleString('vi-VN')}</p>
                            <p><strong className="font-semibold text-gray-900 dark:text-white">Mức độ:</strong> <PriorityBadge priority={selectedAlert.priority} /></p>
                            <p><strong className="font-semibold text-gray-900 dark:text-white">Chi tiết:</strong> {selectedAlert.message}</p>
                            {selectedAlert.status === 'resolved' && (
                                <p><strong className="font-semibold text-gray-900 dark:text-white">Ghi chú xử lý:</strong> {selectedAlert.resolution_note}</p>
                            )}
                        </div>

                        {selectedAlert.status === 'active' && (
                            <>
                                {isResolving ? (
                                    <div className="pt-4 border-t dark:border-gray-600">
                                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Thêm ghi chú xử lý</label>
                                        <textarea value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} rows={3} className="w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ví dụ: Đã liên hệ tài xế..."/>
                                        <div className="flex justify-end pt-4 space-x-2">
                                            <button onClick={() => setIsResolving(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700">Hủy</button>
                                            <button onClick={handleResolveAlert} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">Xác nhận xử lý</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end pt-4 border-t dark:border-gray-600">
                                        <button onClick={() => setIsResolving(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">Đánh dấu đã xử lý</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </Modal>

            <div className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800 shadow-lg ${isFilterPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <h5 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"><Filter size={16} className="mr-2"/>Bộ lọc nâng cao</h5>
                <button onClick={() => setIsFilterPanelOpen(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"><X size={16}/></button>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Mã lô hàng</label>
                        <input type="text" onChange={e => setTempFilters({...tempFilters, shipment_id: e.target.value})} className="mt-1 block w-full text-gray-900 border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
                 <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button onClick={() => { setTempFilters({}); setFilters({}); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700">Xóa lọc</button>
                    <button onClick={handleApplyFilters} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">Áp dụng</button>
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;