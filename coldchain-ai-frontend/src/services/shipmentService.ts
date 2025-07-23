// src/services/shipmentService.ts
import apiClient from './api';
import { Shipment } from '@/types';

export const getShipments = (): Promise<{ data: Shipment[] }> => {
    return apiClient.get('/shipments');
};

// Sau này bạn có thể thêm các hàm createShipment, updateShipment...