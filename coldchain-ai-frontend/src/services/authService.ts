// src/services/authService.ts
import apiClient from './api';
import { LoginCredentials, RegisterData } from '@/types';

export const loginUser = (credentials: LoginCredentials) => {
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);

    return apiClient.post('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
};

export const registerUser = (data: RegisterData) => {
    return apiClient.post('/auth/register', data);
};

export const fetchCurrentUser = () => {
    return apiClient.get('/auth/me');
};