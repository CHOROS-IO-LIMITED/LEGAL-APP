import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type User = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
};

type PageProps = {
    auth: {
        user: User | null;
    };
} & Record<string, unknown>;

export default function Header() {
    const { url, props } = usePage<PageProps>();
    const { auth } = props;

    const [active, setActive] = useState('home');
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [url]);

    useEffect(() => {
        if (url.startsWith('/products')) setActive('products');
        else if (url === '/') setActive('home');
        else if (url.startsWith('/about')) setActive('about');
        else if (url.startsWith('/blogs')) setActive('blogs');
        else if (url.startsWith('/contacts')) setActive('contact');
        else setActive('home');
    }, [url]);

    const menu = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Products', href: '/products' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact', href: '/contacts' },
    ];

    // const dashboardRoute = auth.user?.role === 'admin' ? route('admin.dashboard') : route('user.dashboard');
    const dashboardRoute = {
        admin: route('admin.dashboard'),
        user: route('user.dashboard'),
    }[auth.user?.role ?? 'user'];

    return (
        <header className="sticky top-0 z-50 border-b border-[#E8E2D6] bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <img src="/images/logo/logo.png" alt="LegalDocs" className="h-10 w-auto object-contain" />

                    <span className="bg-gradient-to-r from-[#3D2B1F] to-[#A68A64] bg-clip-text text-lg font-semibold tracking-tight text-transparent">
                        LegalDocs
                    </span>
                </Link>

                <button onClick={() => setMobileOpen((prev) => !prev)} className="md:hidden">
                    {mobileOpen ? <X className="h-6 w-6 text-[#3D2B1F]" /> : <Menu className="h-6 w-6 text-[#3D2B1F]" />}
                </button>

                {/* Nav */}
                <nav className="hidden flex-1 justify-center space-x-10 text-sm font-medium text-[#70665E] md:flex">
                    {menu.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setActive(item.name.toLowerCase())}
                            className={`transition-colors ${
                                active === item.name.toLowerCase()
                                    ? 'border-b-2 border-[#3D2B1F] pb-1 font-semibold text-[#3D2B1F]'
                                    : 'hover:text-[#1A1614]'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Auth Section */}
                <div className="hidden md:block">
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-[#F6F2EA]">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3D2B1F] text-sm font-semibold text-white">
                                        {auth.user.name.slice(0, 2).toUpperCase()}
                                    </div>

                                    <div className="hidden text-left sm:block">
                                        <p className="text-sm font-semibold text-[#3D2B1F]">{auth.user.name}</p>
                                        <p className="text-xs text-[#70665E]">My Account</p>
                                    </div>

                                    <ChevronDown className="h-4 w-4 text-[#70665E]" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem asChild>
                                    <Link href={dashboardRoute} className="flex items-center gap-2">
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem asChild>
                                    <Link href={route('auth.logout')} className="flex items-center gap-2 text-red-600">
                                        <LogOut size={16} />
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            href={route('auth.login')}
                            className="flex items-center gap-2 rounded-md bg-[#3D2B1F] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        >
                            Sign In
                            <LogIn className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            </div>

            <div
                className={`absolute top-full left-0 w-full overflow-hidden border-t border-[#E8E2D6] bg-white shadow-md transition-all duration-300 md:hidden ${
                    mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col space-y-4 px-6 py-4 text-sm font-medium text-[#70665E]">
                    {menu.map((item) => {
                        const isActive = active === item.name.toLowerCase();

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => {
                                    setActive(item.name.toLowerCase());
                                    setMobileOpen(false);
                                }}
                                className={`py-1 transition-colors ${isActive ? 'font-semibold text-[#3D2B1F]' : 'hover:text-[#1A1614]'}`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="border-t pt-4">
                        {auth.user ? (
                            <>
                                <Link href={dashboardRoute} className="flex items-center gap-2 py-2">
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Link>

                                <Link href={route('auth.logout')} className="flex items-center gap-2 py-2 text-red-600">
                                    <LogOut size={16} />
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <Link href={route('auth.login')} className="flex items-center gap-2 rounded-md bg-[#3D2B1F] px-4 py-2 text-white">
                                Sign In
                                <LogIn size={16} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
