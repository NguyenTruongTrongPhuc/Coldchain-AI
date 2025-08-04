import apiClient from './api';
import { Shipment } from '@/types';

interface ShipmentFilters {
    search?: string;
    status?: string;
}

export const getShipments = (filters: ShipmentFilters): Promise<{ data: Shipment[] }> => {
    return apiClient.get('/shipments', { params: filters });
};

interface ShipmentCreatePayload {
    name: string;
    device_id: number;
    start_location?: string;
    end_location?: string;
    start_lat: number;
    start_lng: number;
}

export const createShipment = (payload: ShipmentCreatePayload): Promise<{ data: Shipment }> => {
    return apiClient.post('/shipments', payload);
};

// --- HÀM CÒN THIẾU ---
interface ShipmentUpdatePayload {
    name?: string;
    status?: string;
}

export const updateShipment = (id: number, payload: ShipmentUpdatePayload): Promise<{ data: Shipment }> => {
    return apiClient.put(`/shipments/${id}`, payload);
};

export const getShipmentRoute = (id: number): Promise<{ data: number[][] }> => {
    return apiClient.get(`/shipments/${id}/simulated_route`);
};