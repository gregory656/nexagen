import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Calendar,
    Star,
    DollarSign,
    ChevronRight,
    LogOut,
    Home,
    Zap,
    Activity,
    User as UserIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { RoleSwitcher } from '../RoleSwitcher';

export const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const path = location.pathname;

    const isAdmin = path.includes('/dashboard/admin');
    const isCEO = path.includes('/dashboard/ceo');

    const adminMenu = [
        { name: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Requests', path: '/dashboard/admin/requests', icon: MessageSquare },
        { name: 'Bookings', path: '/dashboard/admin/bookings', icon: Calendar },
        { name: 'Reviews', path: '/dashboard/admin/reviews', icon: Star },
        { name: 'Donations', path: '/dashboard/admin/donations', icon: DollarSign },
    ];

    const ceoMenu = [
        { name: 'Strategic Overview', path: '/dashboard/ceo', icon: Activity },
        { name: 'Priority Comms', path: '/dashboard/ceo/messages', icon: Zap },
        { name: 'CEO Meetings', path: '/dashboard/ceo/meetings', icon: Calendar },
    ];

    const userMenu = [
        { name: 'My Activity', path: '/dashboard/user', icon: UserIcon },
        { name: 'My Requests', path: '/dashboard/user/requests', icon: MessageSquare },
        { name: 'My Bookings', path: '/dashboard/user/bookings', icon: Calendar },
    ];

    const menuItems = isAdmin ? adminMenu : isCEO ? ceoMenu : userMenu;
    const panelTitle = isAdmin ? 'Admin' : isCEO ? 'CEO' : 'User';

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-nexagen-dark text-white flex flex-col pt-8">
                <div className="px-8 mb-12 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-nexagen-dark font-bold">N</span>
                    </div>
                    <span className="text-xl font-bold">{panelTitle} Panel</span>
                </div>

                <nav className="flex-grow space-y-1 px-4">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard/admin' || item.path === '/dashboard/ceo' || item.path === '/dashboard/user'}
                            className={({ isActive }) => cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-nexagen-green text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon size={18} />
                                <span>{item.name}</span>
                            </div>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <NavLink to="/" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all text-sm">
                        <Home size={18} />
                        <span>Public Site</span>
                    </NavLink>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm mt-2">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto bg-[#F8FAFC]">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
            <RoleSwitcher />
        </div>
    );
};
