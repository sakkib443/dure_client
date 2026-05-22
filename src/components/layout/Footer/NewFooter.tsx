"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux';
import { logout } from '@/redux/slices/authSlice';
import { FiPhone, FiMapPin } from 'react-icons/fi';
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const NAV_LINKS = [
    { label: 'হোম',              href: '/' },
    { label: 'সব পণ্য',          href: '/products' },
    { label: 'জামদানি',         href: '/jamdani' },
    { label: 'আমাদের সম্পর্কে', href: '/about' },
    { label: 'যোগাযোগ',         href: '/contact' },
];

const POLICIES = [
    { label: 'শর্তাবলী',         href: '/terms' },
    { label: 'গোপনীয়তা নীতি',   href: '/privacy' },
    { label: 'রিফান্ড নীতি',     href: '/refund' },
];

const SOCIALS = [
    { icon: FaFacebookF,  url: '#', label: 'Facebook'  },
    { icon: FaInstagram,  url: '#', label: 'Instagram' },
    { icon: FaYoutube,    url: '#', label: 'YouTube'   },
    { icon: FaWhatsapp,   url: '#', label: 'WhatsApp'  },
];

const PAYMENTS = [
    { label: 'bKash',  color: '#D12053' },
    { label: 'Nagad',  color: '#F6921E' },
    { label: 'Rocket', color: '#8B2F8B' },
    { label: 'VISA',   color: '#1A1F71' },
    { label: 'AMEX',   color: '#006FCF' },
    { label: 'Cash',   color: '#374151' },
];

const NewFooter: React.FC = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router   = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        router.push('/');
    };

    return (
        <footer className="bg-[#E3DEDB] border-t border-gray-300">

            {/* ── Top ── */}
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] text-white font-black flex items-center justify-center text-sm">
                                জ
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-gray-900">Jhamdani</span>
                        </div>
                        <p className="font-bangla text-sm text-gray-600 leading-relaxed mb-4">
                            বাংলাদেশের সেরা জামদানি শাড়ি, ঐতিহ্যবাহী পোশাক ও অলংকার — ঐতিহ্য ও ভালোবাসায় তৈরি।
                        </p>
                        <div className="flex items-start gap-2 mb-4">
                            <FiMapPin size={14} className="text-gray-500 mt-0.5 shrink-0" />
                            <p className="font-bangla text-xs text-gray-600">ঢাকা, বাংলাদেশ</p>
                        </div>
                        {/* Social icons */}
                        <div className="flex items-center gap-2">
                            {SOCIALS.map(({ icon: Icon, url, label }) => (
                                <a key={label} href={url} aria-label={label}
                                   className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-primary)] transition-colors">
                                    <Icon size={13} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bangla text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">দ্রুত লিংক</h4>
                        <ul className="space-y-2.5">
                            {NAV_LINKS.map(({ label, href }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Services */}
                    <div>
                        <h4 className="font-bangla text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">গ্রাহক সেবা</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/contact" className="font-bangla text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">যোগাযোগ করুন</Link></li>
                            <li><Link href="/cart" className="font-bangla text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">আমার কার্ট</Link></li>
                            {isAuthenticated ? (
                                <>
                                    <li><Link href={user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'} className="font-bangla text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">আমার অ্যাকাউন্ট</Link></li>
                                    <li><Link href="/dashboard/user/orders" className="font-bangla text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">আমার অর্ডার</Link></li>
                                    <li><button onClick={handleLogout} className="font-bangla text-sm text-gray-600 hover:text-red-500 transition-colors">লগআউট</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link href="/login" className="font-bangla text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">সাইন ইন</Link></li>
                                    <li><Link href="/register" className="font-bangla text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">নিবন্ধন করুন</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Contact + Payment */}
                    <div>
                        <h4 className="font-bangla text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest">যোগাযোগ করুন</h4>
                        <div className="flex items-center gap-2 mb-3">
                            <FiPhone size={14} className="text-[var(--color-primary)] shrink-0" />
                            <a href="tel:+8801700000000" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">+880 1700-000000</a>
                        </div>
                        <p className="font-bangla text-xs text-gray-500 mb-5">রবি – বৃহস্পতি&nbsp;|&nbsp; সকাল ৯টা – সন্ধ্যা ৬টা</p>

                        <h4 className="font-bangla text-xs font-bold text-gray-900 mb-3 uppercase tracking-widest">পেমেন্ট পদ্ধতি</h4>
                        <div className="flex flex-wrap gap-2">
                            {PAYMENTS.map(({ label, color }) => (
                                <div key={label}
                                     className="bg-white border border-gray-200 rounded px-2.5 py-1 flex items-center justify-center h-8">
                                    <span className="text-[11px] font-bold" style={{ color }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom ── */}
            <div className="border-t border-gray-300">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <p className="font-bangla text-xs text-gray-500">
                            © {new Date().getFullYear()} ঝামদানি। সর্বস্বত্ব সংরক্ষিত।
                        </p>
                        <div className="flex items-center gap-3 flex-wrap justify-center">
                            {POLICIES.map(({ label, href }, i) => (
                                <React.Fragment key={href}>
                                    {i > 0 && <span className="text-gray-400 text-xs">•</span>}
                                    <Link href={href} className="text-xs text-gray-500 hover:text-[var(--color-primary)] transition-colors">{label}</Link>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default NewFooter;
