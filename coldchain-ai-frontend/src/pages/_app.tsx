// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Wrapper component để xử lý layout và bảo vệ route
const AppWrapper = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    const isPublicPage = ['/login', '/register'].includes(router.pathname);
    const auth = useAuth();

    useEffect(() => {
        if (!auth.isLoading && !auth.isAuthenticated && !isPublicPage) {
            router.push('/login');
        }
    }, [auth.isLoading, auth.isAuthenticated, isPublicPage, router]);

    if (auth.isLoading) {
        return <div className="flex h-screen items-center justify-center">Đang tải ứng dụng...</div>;
    }

    if (isPublicPage) {
        return <Component {...pageProps} />;
    }
    
    // Nếu đã đăng nhập và không phải trang public, hiển thị layout dashboard
    if (auth.isAuthenticated) {
        return (
            <DashboardLayout>
                <Component {...pageProps} />
            </DashboardLayout>
        );
    }
    
    // Fallback để tránh render trang private khi chưa xác thực
    return null; 
};

export default function App(props: AppProps) {
    return (
        <AuthProvider>
            <Toaster position="top-right" />
            <AppWrapper {...props} />
        </AuthProvider>
    );
}