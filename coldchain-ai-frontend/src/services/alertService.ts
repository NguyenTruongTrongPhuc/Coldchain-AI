// src/services/alertService.ts
import apiClient from './api';
import { Alert } from '@/types';

// Interface cho các tham số lọc
export interface AlertFilters {
    status: 'active' | 'resolved';
    priorities?: string[];
    alert_types?: string[];
    start_date?: string;
    end_date?: string;
    shipment_id?: string;
}

// Lấy danh sách cảnh báo với bộ lọc
export const getAlerts = (filters: AlertFilters): Promise<{ data: Alert[] }> => {
    return apiClient.get('/alerts', { params: filters });
};

interface AlertResolvePayload {
    resolution_note: string;
}

// Đánh dấu một cảnh báo là đã xử lý
export const resolveAlert = (alertId: number, payload: AlertResolvePayload): Promise<{ data: Alert }> => {
    return apiClient.post(`/alerts/${alertId}/resolve`, payload);
};