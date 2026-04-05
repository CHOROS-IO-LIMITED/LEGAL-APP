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
import { ChevronDown, ClipboardPlus, LayoutDashboard, PanelLeftClose, Receipt, Settings } from 'lucide-react';

interface User {
    name: string;
    email: string;
}

interface UserLayoutProps {
    user: User;
    children: React.ReactNode;
}

export default function UserLayout({ user, children }: UserLayoutProps) {
    const { url } = usePage();

    // Reliable active state check
    const isActive = (routeName: string) => {
        return route().current(routeName);
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="hidden w-64 flex-col border-r bg-white md:flex dark:border-gray-700 dark:bg-gray-800">
                <div className="flex h-16 items-center justify-between border-b px-4 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo/dd-logo.png" alt="LegalDocs" className="h-10 w-auto object-contain" />
                        <span className="bg-gradient-to-r from-[#3D2B1F] to-[#A68A64] bg-clip-text text-lg font-semibold tracking-tight text-transparent">
                            Daver & Daver
                        </span>
                    </Link>

                    <button
                        className="flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        onClick={() => console.log('Close sidebar')} // testing lang
                    >
                        <PanelLeftClose size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto py-4">
                    <nav className="grid items-start gap-4 px-2 text-sm font-medium">
                        {/* Action Section */}
                        <div className="flex flex-col gap-2">
                            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-[#6B635B] uppercase">Action</span>

                            <Link href="/products/details" className="w-full">
                                <div className="group relative flex w-full items-center gap-3 px-3 py-2 text-sm text-[#6B635B] transition-all duration-150 hover:bg-[#F4EFE6] hover:text-[#1A1614]">
                                    <span className="absolute top-0 left-0 h-full w-[2px] bg-[#3D2B1F]/0 transition-all duration-150 group-hover:bg-[#3D2B1F]/40" />

                                    <ClipboardPlus size={18} className="text-[#A68A64] transition-all duration-150 group-hover:text-[#3D2B1F]" />
                                    <span className="font-medium tracking-tight">Add Document</span>
                                </div>
                            </Link>
                        </div>

                        {/* Menu Section */}
                        <div className="flex flex-col gap-2">
                            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-[#6B635B] uppercase">Menu</span>

                            <Link href={route('user.dashboard')} className="w-full">
                                <div
                                    className={`group relative flex w-full items-center gap-3 px-3 py-2 text-sm transition-all duration-150 ${
                                        isActive('user.dashboard')
                                            ? 'bg-[#F2EDE4] text-[#1A1614]'
                                            : 'text-[#6B635B] hover:bg-[#F4EFE6] hover:text-[#1A1614]'
                                    }`}
                                >
                                    {isActive('user.dashboard') && <span className="absolute top-0 left-0 h-full w-[2px] bg-[#3D2B1F]" />}
                                    {!isActive('user.dashboard') && (
                                        <span className="absolute top-0 left-0 h-full w-[2px] bg-[#3D2B1F]/0 transition-all duration-150 group-hover:bg-[#3D2B1F]/40" />
                                    )}

                                    <LayoutDashboard
                                        size={18}
                                        className={`transition-all duration-150 ${
                                            isActive('user.dashboard') ? 'text-[#3D2B1F]' : 'text-[#A68A64] group-hover:text-[#3D2B1F]'
                                        }`}
                                    />
                                    <span className="font-medium tracking-tight">Dashboard</span>
                                </div>
                            </Link>

                            <Link href={route('user.invoice')} className="w-full">
                                <div
                                    className={`group relative flex w-full items-center gap-3 px-3 py-2 text-sm transition-all duration-150 ${
                                        isActive('user.invoice')
                                            ? 'bg-[#F2EDE4] text-[#1A1614]'
                                            : 'text-[#6B635B] hover:bg-[#F4EFE6] hover:text-[#1A1614]'
                                    }`}
                                >
                                    {isActive('user.invoice') && <span className="absolute top-0 left-0 h-full w-[2px] bg-[#3D2B1F]" />}
                                    {!isActive('user.invoice') && (
                                        <span className="absolute top-0 left-0 h-full w-[2px] bg-[#3D2B1F]/0 transition-all duration-150 group-hover:bg-[#3D2B1F]/40" />
                                    )}

                                    <Receipt
                                        size={18}
                                        className={`transition-all duration-150 ${
                                            isActive('user.invoice') ? 'text-[#3D2B1F]' : 'text-[#A68A64] group-hover:text-[#3D2B1F]'
                                        }`}
                                    />
                                    <span className="font-medium tracking-tight">Invoice</span>
                                </div>
                            </Link>
                        </div>
                    </nav>
                </div>

                {/* User Info */}
                <div className="border-t border-[#E7E1D7] px-4 py-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="group flex w-full items-center gap-3 px-2 py-2 text-sm font-medium text-[#1A1614] transition-all duration-150 hover:bg-[#F4EFE6] focus:ring-2 focus:ring-[#3D2B1F]/40 focus:outline-none">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/api/placeholder/32/32" alt={user.name} />
                                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-medium tracking-tight">{user.name}</span>
                                    <span className="text-xs text-[#6B635B]">{user.email}</span>
                                </div>
                                <ChevronDown className="ml-auto h-4 w-4 text-[#A68A64] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48 rounded-none border border-[#E7E1D7] bg-white p-0 shadow-md">
                            <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-[#6B635B]">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="border-[#E7E1D7]" />

                            <Link href={route('user.settings')}>
                                <DropdownMenuItem className="group flex items-center gap-3 rounded-none px-3 py-2 text-sm text-[#6B635B] transition-all duration-150 hover:bg-[#F4EFE6] hover:text-[#1A1614]">
                                    <Settings size={16} className="text-[#A68A64] transition-colors duration-150 group-hover:text-[#3D2B1F]" />
                                    <span className="font-medium tracking-tight">Settings</span>
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuSeparator className="border-[#E7E1D7]" />

                            <DropdownMenuItem asChild>
                                <Link
                                    href={route('auth.logout')}
                                    className="group flex items-center gap-3 rounded-none px-3 py-2 text-sm text-[#6B635B] transition-all duration-150 hover:bg-[#F4EFE6] hover:text-[#1A1614]"
                                >
                                    <Receipt size={16} className="text-[#A68A64] transition-colors duration-150 group-hover:text-[#3D2B1F]" />
                                    <span className="font-medium tracking-tight">Logout</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* <header className="flex h-16 items-center border-b bg-white px-4 md:px-6 dark:border-gray-700 dark:bg-gray-800">
                    <Button variant="outline" size="icon" className="mr-2 md:hidden">
                        <LayoutDashboard size={20} />
                    </Button>
                    <div className="flex flex-1 items-center justify-between">
                        <div className="ml-auto flex items-center gap-4">
                            <Separator orientation="vertical" className="h-8" />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/api/placeholder/32/32" alt={user.name} />
                                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="hidden text-sm font-medium md:inline-flex">{user.name}</span>
                                        <ChevronDown size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span>{user.name}</span>
                                            <span className="text-xs text-gray-500">{user.email}</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link href={route('user.settings')} className="w-full">
                                        <DropdownMenuItem className="flex w-full cursor-pointer items-center gap-2">
                                            <Settings size={16} />
                                            Settings
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('auth.logout')} className="flex w-full cursor-pointer">
                                            Logout
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header> */}
                {children}
            </div>
        </div>
    );
}
