// src/services/deviceService.ts
import apiClient from './api';
import { Device, ActivityLog } from '@/types';

// Định nghĩa kiểu cho các tham số
interface GetDevicesParams {
    search?: string;
    connection?: string;
    skip?: number;
    limit?: number;
}

interface DeviceCreationData {
    tracker_id: string;
    name: string;
}

export const getDevices = (params: GetDevicesParams): Promise<{ data: Device[] }> => {
    return apiClient.get('/devices', { params });
};

export const getDeviceById = (id: string): Promise<{ data: Device }> => {
    return apiClient.get(`/devices/${id}`);
};

// Hàm mới để lấy lịch sử hoạt động
export const getDeviceLogs = (id: string): Promise<{ data: ActivityLog[] }> => {
    return apiClient.get(`/devices/${id}/logs`);
};

export const createDevice = (deviceData: DeviceCreationData): Promise<{ data: Device }> => {
    return apiClient.post('/devices', deviceData);
};