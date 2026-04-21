import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, User, Activity, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

export const RoleSwitcher: React.FC = () => {
    const roles = [
        { name: 'Public', path: '/', icon: Globe, color: 'hover:text-blue-500' },
        { name: 'Admin', path: '/dashboard/admin', icon: Shield, color: 'hover:text-red-500' },
        { name: 'CEO', path: '/dashboard/ceo', icon: Activity, color: 'hover:text-nexagen-gold' },
        { name: 'User', path: '/dashboard/user', icon: User, color: 'hover:text-nexagen-green' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="glass px-6 py-3 rounded-2xl flex items-center space-x-6 shadow-2xl border border-white/40 ring-1 ring-black/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mr-2 border-r border-gray-200 pr-6">
                    Dev Switcher
                </span>
                <div className="flex items-center space-x-4">
                    {roles.map((role) => (
                        <NavLink
                            key={role.path}
                            to={role.path}
                            className={({ isActive }) => cn(
                                "flex items-center space-x-2 text-xs font-bold transition-all duration-300",
                                role.color,
                                isActive ? "text-nexagen-dark scale-110" : "text-gray-400"
                            )}
                        >
                            <role.icon size={14} />
                            <span>{role.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};
