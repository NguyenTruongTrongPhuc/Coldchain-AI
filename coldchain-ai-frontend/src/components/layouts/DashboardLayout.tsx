// src/components/layouts/DashboardLayout.tsx
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }: { children: ReactNode }) => (
    <div className="flex h-screen bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">{children}</main>
        </div>
    </div>
);

export default DashboardLayout;