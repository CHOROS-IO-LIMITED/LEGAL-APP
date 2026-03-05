import { Link, usePage } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
    const { url } = usePage(); // get current URL
    const [active, setActive] = useState('home');

    useEffect(() => {
        if (url === '/products') setActive('products');
        else setActive('home'); // default to home
    }, [url]);

    const menu = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/#about' },
        { name: 'Products', href: '/products' },
        { name: 'Services', href: '/#services' },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <header className="border-b border-[#E8E2D6] bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <div className="text-xl font-bold text-[#1A1614]">
                    Legal <span className="text-[#A68A64]">App</span>
                </div>

                {/* Nav */}
                <nav className="flex flex-1 justify-center space-x-10 text-sm font-medium text-[#70665E]">
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

                {/* Sign in */}
                <div>
                    <button className="flex items-center gap-2 rounded-md bg-[#3D2B1F] px-6 py-2 text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md">
                        Sign In
                        <LogIn className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
