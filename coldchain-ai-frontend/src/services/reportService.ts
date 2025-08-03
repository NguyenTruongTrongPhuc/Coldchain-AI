import apiClient from './api';
import { Report } from '@/types';

// Interface cho dữ liệu gửi lên khi tạo báo cáo
interface ReportCreatePayload {
    report_type: string;
    shipment_id?: number;
    start_date?: string;
    end_date?: string;
}

// Lấy danh sách báo cáo
export const getReports = (): Promise<{ data: Report[] }> => {
    return apiClient.get('/reports');
};

// Gửi yêu cầu tạo báo cáo mới
export const createReport = (payload: ReportCreatePayload): Promise<{ data: Report }> => {
    return apiClient.post('/reports', payload);
};