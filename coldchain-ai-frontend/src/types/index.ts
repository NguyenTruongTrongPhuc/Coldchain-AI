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