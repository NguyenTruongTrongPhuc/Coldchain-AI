import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet'; // <-- Dòng import bị thiếu
import { Shipment } from '@/types';
import { Truck } from 'lucide-react';

interface ShipmentMapProps {
    shipments: Shipment[];
    selectedShipment: Shipment | null;
    route: LatLngExpression[];
}

const ShipmentMap = ({ shipments, selectedShipment, route }: ShipmentMapProps) => {
    // Vị trí trung tâm mặc định
    const defaultCenter: LatLngExpression = [16.0544, 108.2022]; // DĐà Nẵng
    
    // Xác định vị trí trung tâm của bản đồ
    const position: LatLngExpression = selectedShipment?.currentLocation  
        ? [selectedShipment.currentLocation.lat, selectedShipment.currentLocation.lng]
        : defaultCenter;

    return (
        // MapContainer là component chính của bản đồ
        <MapContainer 
            center={position} 
            zoom={selectedShipment ? 12 : 6} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
        >
            {/* Lớp nền bản đồ từ OpenStreetMap */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Vẽ các marker cho tất cả lô hàng */}
            {shipments.map((shipment) => (
                shipment.currentLocation && (
                    <Marker 
                        key={shipment.id} 
                        position={[shipment.currentLocation.lat, shipment.currentLocation.lng]}
                    >
                        <Popup>
                            <b>{shipment.name}</b><br/>
                            {shipment.status}
                        </Popup>
                    </Marker>
                )
            ))}

            {/* Vẽ đường đi cho lô hàng được chọn */}
            {route && route.length > 0 && (
                <Polyline pathOptions={{ color: 'blue' }} positions={route} />
            )}
        </MapContainer>
    );
};

export default ShipmentMap;