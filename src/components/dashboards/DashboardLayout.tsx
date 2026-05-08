import React, { useState } from 'react';
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
    User as UserIcon,
    Menu,
    X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { RoleSwitcher } from '../RoleSwitcher';

export const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <div className="flex h-screen overflow-hidden bg-slate-100">
            <button
                className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open dashboard navigation"
            >
                <Menu size={20} />
            </button>
            {sidebarOpen && <div className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-white/10 bg-slate-950/95 pt-7 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="mb-10 flex items-center justify-between px-6">
                    <div className="flex items-center space-x-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
                            <span className="font-black text-white">N</span>
                        </div>
                        <div>
                            <span className="block text-xl font-black">{panelTitle} Panel</span>
                            <span className="text-xs font-bold uppercase tracking-[.16em] text-cyan-200">NexaGen OS</span>
                        </div>
                    </div>
                    <button className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close dashboard navigation">
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-grow space-y-2 px-4">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard/admin' || item.path === '/dashboard/ceo' || item.path === '/dashboard/user'}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => cn(
                                "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300",
                                isActive
                                    ? "bg-white text-slate-950 shadow-xl shadow-cyan-500/10"
                                    : "text-slate-400 hover:translate-x-1 hover:bg-white/10 hover:text-white"
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

                <div className="border-t border-white/10 p-4">
                    <NavLink to="/" className="flex items-center space-x-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white">
                        <Home size={18} />
                        <span>Public Site</span>
                    </NavLink>
                    <button className="mt-2 flex w-full items-center space-x-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-300 transition-all hover:bg-red-500/10 hover:text-red-200">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.18),transparent_30%),#F8FAFC]">
                <div className="p-5 pt-20 lg:p-8">
                    <Outlet />
                </div>
            </main>
            <RoleSwitcher />
        </div>
    );
};
