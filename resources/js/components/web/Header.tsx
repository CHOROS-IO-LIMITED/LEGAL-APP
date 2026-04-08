import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
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

    const [activeIndex, setActiveIndex] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    const menu = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Products', href: '/products' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact', href: '/contacts' },
    ];

    const dashboardRoute = {
        admin: route('admin.dashboard'),
        user: route('user.dashboard'),
    }[auth.user?.role ?? 'user'];

    // Detect active page
    useEffect(() => {
        if (url.startsWith('/products')) setActiveIndex(2);
        else if (url === '/') setActiveIndex(0);
        else if (url.startsWith('/about')) setActiveIndex(1);
        else if (url.startsWith('/blogs')) setActiveIndex(3);
        else if (url.startsWith('/contacts')) setActiveIndex(4);
        else setActiveIndex(-1);
    }, [url]);

    // Move underline smoothly
    useEffect(() => {
        const index = hoverIndex ?? activeIndex;

        if (index === -1) {
            setUnderlineStyle({ left: 0, width: 0 });
            return;
        }

        const element = document.querySelector(`.nav-link-${index}`) as HTMLElement | null;

        if (element) {
            setUnderlineStyle({
                left: element.offsetLeft,
                width: element.offsetWidth,
            });
        }
    }, [activeIndex, hoverIndex]);

    useEffect(() => {
        setMobileOpen(false);
    }, [url]);

    return (
        <header className="sticky top-0 z-50 border-b border-[#E8E2D6] bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-2">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <img
                        src="/images/logo/daver-logo.png"
                        alt="LegalDocs"
                        className="h-16 w-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
                    />
                </Link>
                {/* Mobile Toggle */}
                <button onClick={() => setMobileOpen((prev) => !prev)} className="md:hidden">
                    {mobileOpen ? <X className="h-6 w-6 text-[#3D2B1F]" /> : <Menu className="h-6 w-6 text-[#3D2B1F]" />}
                </button>

                {/* Desktop Nav */}
                <nav className="relative hidden justify-center space-x-10 text-sm font-medium text-[#70665E] md:flex">
                    {menu.map((item, idx) => {
                        const isActive = activeIndex === idx;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveIndex(idx)}
                                onMouseEnter={() => setHoverIndex(idx)}
                                onMouseLeave={() => setHoverIndex(null)}
                                className={`nav-link-${idx} relative py-1 transition-colors ${isActive ? 'font-semibold text-[#3D2B1F]' : 'hover:text-[#1A1614]'}`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}

                    <motion.span
                        className="absolute bottom-0 h-[2px] bg-[#3D2B1F]"
                        animate={{ left: underlineStyle.left, width: underlineStyle.width }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
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
                            className="group flex h-9 items-center justify-center gap-2 border border-[#3D2B1F] bg-[#3D2B1F] px-4 text-sm font-semibold text-white transition hover:bg-[#2F2118]"
                        >
                            <span>Sign In</span>
                            <LogIn size={16} className="transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute top-full left-0 w-full border-t border-[#E8E2D6] bg-white shadow-md md:hidden"
                    >
                        <div className="flex flex-col space-y-4 px-6 py-4 text-sm font-medium text-[#70665E]">
                            {menu.map((item, idx) => {
                                const isActive = activeIndex === idx;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => {
                                            setActiveIndex(idx);
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
                                    <Link
                                        href={route('auth.login')}
                                        className="flex h-10 items-center justify-center gap-2 border border-[#3D2B1F] bg-[#3D2B1F] px-4 text-sm font-semibold text-white transition hover:bg-[#2F2118]"
                                    >
                                        <span>Sign In</span>
                                        <LogIn size={16} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
