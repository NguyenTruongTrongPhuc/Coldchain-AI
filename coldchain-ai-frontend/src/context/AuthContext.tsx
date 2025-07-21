// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { LoginCredentials, RegisterData, User } from '@/types';
import { loginUser, registerUser, fetchCurrentUser } from '@/services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUserFromToken = async () => {
            const storedToken = localStorage.getItem('accessToken');
            if (storedToken) {
                try {
                    const response = await fetchCurrentUser();
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        loadUserFromToken();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await loginUser(credentials);
            const { access_token } = response.data;
            localStorage.setItem('accessToken', access_token);
            const userResponse = await fetchCurrentUser();
            setUser(userResponse.data);
            toast.success('Đăng nhập thành công!');
            router.push('/');
        } catch (error) {
            toast.error('Đăng nhập thất bại.');
        }
    };
    
    const register = async (data: RegisterData) => {
        try {
            await registerUser(data);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            router.push('/login');
        } catch (error) {
            toast.error('Đăng ký thất bại. Email có thể đã tồn tại.');
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        router.push('/login');
    };

    const value = { user, isAuthenticated: !!user, isLoading, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};