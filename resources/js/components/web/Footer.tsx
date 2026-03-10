import { Link } from '@inertiajs/react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
    return (
        <footer className="border-t border-[#E8E2D6] bg-white">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-12 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">
                            <img src="/images/logo/logo.png" alt="LegalDocs" className="h-9 w-auto object-contain" />

                            <span className="bg-gradient-to-r from-[#3D2B1F] to-[#A68A64] bg-clip-text text-lg font-semibold text-transparent">
                                LegalDocs
                            </span>
                        </div>

                        <p className="mt-4 text-sm text-[#70665E]">
                            Create legally structured documents using AI-powered templates designed for businesses and professionals.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-[#3D2B1F]">Product</h4>

                        <ul className="space-y-2 text-sm text-[#70665E]">
                            <li>
                                <Link href="/products" className="hover:text-[#1A1614]">
                                    Templates
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#1A1614]">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#services" className="hover:text-[#1A1614]">
                                    Services
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-[#3D2B1F]">Company</h4>

                        <ul className="space-y-2 text-sm text-[#70665E]">
                            <li>
                                <Link href="/#about" className="hover:text-[#1A1614]">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacts" className="hover:text-[#1A1614]">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-[#1A1614]">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-[#3D2B1F]">Legal</h4>

                        <ul className="space-y-2 text-sm text-[#70665E]">
                            <li>
                                <Link href={route('legal', { tab: 'terms' })} className="hover:text-[#1A1614]">
                                    Terms & Conditions
                                </Link>
                            </li>

                            <li>
                                <Link href={route('legal', { tab: 'privacy' })} className="hover:text-[#1A1614]">
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link href={route('legal', { tab: 'cookies' })} className="hover:text-[#1A1614]">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-[#E8E2D6] pt-6 md:flex-row">
                    <p className="text-sm text-[#70665E]">© {new Date().getFullYear()} LegalDocs. All rights reserved.</p>

                    <div className="flex items-center gap-4">
                        <a className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E2D6] bg-white text-[#3D2B1F] transition hover:bg-[#F6F2EA]">
                            <FaFacebookF size={14} />
                        </a>

                        <a className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E2D6] bg-white text-[#3D2B1F] transition hover:bg-[#F6F2EA]">
                            <FaInstagram size={14} />
                        </a>

                        <a className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E2D6] bg-white text-[#3D2B1F] transition hover:bg-[#F6F2EA]">
                            <FaLinkedinIn size={14} />
                        </a>

                        <a className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E2D6] bg-white text-[#3D2B1F] transition hover:bg-[#F6F2EA]">
                            <FaXTwitter size={14} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
