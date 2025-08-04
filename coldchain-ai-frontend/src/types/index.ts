// src/types/index.ts
export interface User {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends LoginCredentials {
    full_name: string;
  }

  export interface Device {
    id: number;
    tracker_id: string;
    name: string;
    status: string;
    connection: string;
    last_location: string | null;
    battery: number | null;
}

export interface Shipment {
    id: number;
    name: string;
    status: string;
    start_location: string | null;
    end_location: string | null;
    device: Device | null;

    // THÊM THUỘC TÍNH CÒN THIẾU
    currentLocation?: { 
        lat: number;
        lng: number;
    };
}

export interface ActivityLog {
    id: number;
    timestamp: string;
    log_type: 'system' | 'user_note';
    content: string;
}

export interface Alert {
    id: number;
    shipment_id: number;
    alert_type: string;
    message: string;
    timestamp: string;
    priority: string;
    status: 'active' | 'resolved';
    resolution_note?: string;
}

export interface Report {
    id: number;
    name: string;
    created_at: string;
    status: 'completed' | 'processing' | 'failed';
    file_path: string | null;
    user_id: number;
}