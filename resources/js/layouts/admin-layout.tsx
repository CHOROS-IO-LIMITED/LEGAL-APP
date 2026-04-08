import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronsUpDown, CreditCard, FileText, LayoutDashboard, LogOut, PanelLeftClose, Settings } from 'lucide-react';
import { useState } from 'react';

interface User {
    name: string;
    email: string;
}

interface AdminLayoutProps {
    user: User;
    children: React.ReactNode;
}

function getInitialCollapsed(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sidebar-collapsed') === 'true';
}

export default function AdminLayout({ user, children }: AdminLayoutProps) {
    const { url } = usePage();
    const [collapsed, setCollapsed] = useState<boolean>(getInitialCollapsed);

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem('sidebar-collapsed', next.toString());
            return next;
        });
    };

    const isActive = (path: string) => url.startsWith(path);

    const itemBase = `group relative flex items-center py-2 text-sm transition-all duration-200 ${
        collapsed ? 'justify-center px-2 gap-0' : 'px-3 gap-3'
    }`;

    const labelStyle: React.CSSProperties = {
        opacity: collapsed ? 0 : 1,
        transform: collapsed ? 'translateX(-6px)' : 'translateX(0)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        pointerEvents: collapsed ? 'none' : 'auto',
        width: collapsed ? 0 : 'auto',
    };

    const SectionLabel = ({ label }: { label: string }) => (
        <div className={`relative py-1 transition-all duration-200 ${collapsed ? 'flex justify-center px-2' : 'px-3'}`} style={{ height: '1.5rem' }}>
            <span
                className="absolute inset-0 flex items-center px-3 text-xs font-semibold tracking-wider text-[#6B635B] uppercase"
                style={{ opacity: collapsed ? 0 : 1 }}
            >
                {label}
            </span>

            <span className="absolute inset-0 flex items-center justify-center" style={{ opacity: collapsed ? 1 : 0 }}>
                <span className="block h-px w-6 bg-[#6B635B]/50 dark:bg-gray-600" />
            </span>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div
                className="relative hidden md:flex"
                style={{
                    minWidth: collapsed ? '5rem' : '16rem',
                    maxWidth: collapsed ? '5rem' : '16rem',
                    transition: 'min-width 0.25s ease, max-width 0.25s ease',
                    flexShrink: 0,
                }}
            >
                <div className="flex w-full flex-col overflow-hidden border-r bg-white dark:border-gray-700 dark:bg-gray-800">
                    {/* Header */}
                    <div className="flex h-16 items-center justify-center border-b px-4 dark:border-gray-700">
                        <Link href="/" className="flex w-full items-center justify-center">
                            <img
                                src={collapsed ? '/images/logo/icon-logo.png' : '/images/logo/daver-logo.png'}
                                alt="Daver"
                                className={`object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)] transition-all duration-200 ${
                                    collapsed ? 'h-8' : 'h-14'
                                }`}
                            />
                        </Link>
                    </div>

                    {/* Nav */}
                    <div className="flex-1 overflow-hidden py-4">
                        <nav className="grid gap-4 px-2 text-sm font-medium">
                            <div className="flex flex-col gap-2">
                                <SectionLabel label="Navigation" />

                                <Link href={route('admin.dashboard')}>
                                    <div className={`${itemBase} h-10 ${isActive('/admin/dashboard') ? 'bg-[#F2EDE4]' : 'hover:bg-[#F4EFE6]'}`}>
                                        <span
                                            className={`absolute top-0 left-0 h-full w-[2px] ${isActive('/admin/dashboard') ? 'bg-[#3D2B1F]' : 'group-hover:bg-[#3D2B1F]/40'}`}
                                        />
                                        <LayoutDashboard
                                            size={18}
                                            className={isActive('/admin/dashboard') ? 'text-[#3D2B1F]' : 'text-[#A68A64] group-hover:text-[#3D2B1F]'}
                                        />
                                        <span style={labelStyle}>Dashboard</span>
                                    </div>
                                </Link>

                                <Link href={route('admin.my-products')}>
                                    <div className={`${itemBase} h-10 ${isActive('/admin/my-products') ? 'bg-[#F2EDE4]' : 'hover:bg-[#F4EFE6]'}`}>
                                        <span
                                            className={`absolute top-0 left-0 h-full w-[2px] ${isActive('/admin/my-products') ? 'bg-[#3D2B1F]' : 'group-hover:bg-[#3D2B1F]/40'}`}
                                        />
                                        <FileText
                                            size={18}
                                            className={
                                                isActive('/admin/my-products') ? 'text-[#3D2B1F]' : 'text-[#A68A64] group-hover:text-[#3D2B1F]'
                                            }
                                        />
                                        <span style={labelStyle}>Products</span>
                                    </div>
                                </Link>

                                <Link href={route('admin.billings')}>
                                    <div className={`${itemBase} h-10 ${isActive('/admin/billings') ? 'bg-[#F2EDE4]' : 'hover:bg-[#F4EFE6]'}`}>
                                        <span
                                            className={`absolute top-0 left-0 h-full w-[2px] ${isActive('/admin/billings') ? 'bg-[#3D2B1F]' : 'group-hover:bg-[#3D2B1F]/40'}`}
                                        />
                                        <CreditCard
                                            size={18}
                                            className={isActive('/admin/billings') ? 'text-[#3D2B1F]' : 'text-[#A68A64] group-hover:text-[#3D2B1F]'}
                                        />
                                        <span style={labelStyle}>Billings</span>
                                    </div>
                                </Link>
                            </div>
                        </nav>
                    </div>

                    {/* User */}
                    <div className="border-t border-[#E7E1D7] px-4 py-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={`group flex w-full items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3 px-2 py-2 text-sm hover:bg-[#F4EFE6]`}
                                >
                                    <Avatar className="h-8 w-8 rounded-none">
                                        <AvatarImage src="/api/placeholder/32/32" />
                                        <AvatarFallback className="bg-[#A68A64] text-white">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>

                                    {!collapsed && (
                                        <div className="flex flex-1 flex-col px-2">
                                            <span className="text-sm text-[#1A1614]">{user.name}</span>
                                            <span className="text-xs text-[#6B635B]">{user.email}</span>
                                        </div>
                                    )}

                                    {!collapsed && <ChevronsUpDown size={14} className="text-[#A68A64]" />}
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-48 rounded-none">
                                <DropdownMenuLabel className="text-[#6B635B]">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <Link href={route('admin.settings')}>
                                    <DropdownMenuItem className="cursor-pointer rounded-none">
                                        <Settings size={16} className="text-[#A68A64]" />
                                        Settings
                                    </DropdownMenuItem>
                                </Link>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem className="cursor-pointer rounded-none" asChild>
                                    <Link href={route('auth.logout')}>
                                        <LogOut size={16} className="text-[#A68A64]" />
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={toggleCollapsed}
                    className="group absolute top-5 -right-3 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#E7E1D7] bg-white shadow-sm transition hover:scale-105 hover:bg-[#F4EFE6] active:scale-95 dark:border-gray-700 dark:bg-gray-800"
                >
                    <PanelLeftClose
                        size={14}
                        style={{
                            transition: 'transform 0.25s ease',
                            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                    />
                    <span className="absolute top-1/2 left-full ml-2 -translate-y-1/2 bg-[#3D2B1F] px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {collapsed ? 'Open Panel' : 'Close Panel'}
                    </span>
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center border-b bg-white px-4 md:hidden md:px-6 dark:border-gray-700 dark:bg-gray-800">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="mr-2 flex h-10 w-10 items-center justify-center rounded-none border border-[#E7E1D7] bg-white shadow-sm hover:bg-[#F4EFE6] focus:ring-2 focus:ring-[#3D2B1F] focus:outline-none active:scale-95 dark:border-gray-700 dark:bg-gray-800">
                                <LayoutDashboard size={20} className="text-[#A68A64]" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="start"
                            className="w-64 rounded-none border bg-white p-2 shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-[#6B635B] uppercase">Navigation</span>

                            <Link href={route('admin.dashboard')}>
                                <DropdownMenuItem className="flex items-center gap-3 rounded-none px-3 py-2 text-[#6B635B] hover:bg-[#F4EFE6] dark:hover:bg-gray-700">
                                    <LayoutDashboard size={18} className="text-[#A68A64]" />
                                    Dashboard
                                </DropdownMenuItem>
                            </Link>

                            <Link href={route('admin.my-products')}>
                                <DropdownMenuItem className="flex items-center gap-3 rounded-none px-3 py-2 text-[#6B635B] hover:bg-[#F4EFE6] dark:hover:bg-gray-700">
                                    <FileText size={18} className="text-[#A68A64]" />
                                    Products
                                </DropdownMenuItem>
                            </Link>

                            <Link href={route('admin.billings')}>
                                <DropdownMenuItem className="flex items-center gap-3 rounded-none px-3 py-2 text-[#6B635B] hover:bg-[#F4EFE6] dark:hover:bg-gray-700">
                                    <CreditCard size={18} className="text-[#A68A64]" />
                                    Billings
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex flex-1 items-center justify-end gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 rounded-none px-2 py-1 hover:bg-[#F4EFE6] focus:ring-2 focus:ring-[#3D2B1F] focus:outline-none dark:hover:bg-gray-700">
                                    <Avatar className="h-8 w-8 rounded-none">
                                        <AvatarFallback className="bg-[#A68A64] text-white">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>

                                    <span className="text-sm text-[#1A1614] dark:text-gray-200">{user.name}</span>

                                    <ChevronDown size={16} className="text-[#A68A64]" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-48 rounded-none border bg-white p-0 shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                <DropdownMenuLabel className="text-[#6B635B] dark:text-gray-300">
                                    <div className="flex flex-col">
                                        <span>{user.name}</span>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <Link href={route('admin.settings')}>
                                    <DropdownMenuItem className="gap-3 rounded-none text-[#1A1614] hover:bg-[#F4EFE6] dark:text-gray-200 dark:hover:bg-gray-700">
                                        <Settings size={16} className="text-[#A68A64]" />
                                        Settings
                                    </DropdownMenuItem>
                                </Link>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem asChild>
                                    <Link
                                        href={route('auth.logout')}
                                        className="gap-3 rounded-none text-[#1A1614] hover:bg-[#F4EFE6] dark:text-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <LogOut size={16} className="text-[#A68A64]" />
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {children}
            </div>
        </div>
    );
}
