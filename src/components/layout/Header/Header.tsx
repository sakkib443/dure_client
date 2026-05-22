"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    FiShoppingCart, FiSearch, FiX, FiUpload, FiUser, FiHeart,
    FiPhone, FiMenu, FiChevronDown,
} from 'react-icons/fi';
import { FaFacebookF, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/redux';
import { setImageSearching, setImageSearchResults, clearImageSearch } from '@/redux/slices/imageSearchSlice';
import { logout } from '@/redux/slices/authSlice';

/* ─── Palette ────────────────────────────────────────────────────── */
const MAROON   = '#6B0F1A';
const GOLD     = '#C9A227';
const DEEP     = '#2D1008';
const CREAM    = '#FDF6EC';
const SOFT_BG  = '#F5EDE0'; // warm soft beige

/* ─── Nav links ─────────────────────────────────────────────────── */
const NAV_LINKS = [
    { label: 'হোম',              href: '/',                                icon: '🏠' },
    { label: 'সব পণ্য',          href: '/products',                         icon: '🧺' },
    { label: 'জামদানি',          href: '/products?category=jamdani-saree',  icon: '🥻' },
    { label: 'নতুন কালেকশন',    href: '/products?sort=newest',             icon: '✨' },
    { label: 'যোগাযোগ',         href: '/contact',                          icon: '📞' },
];

/* ─── Bengali floral / leaf SVG pattern for header background ──── */
const FloralPatternBg = () => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <pattern id="banglaFloral" x="0" y="0" width="120" height="80" patternUnits="userSpaceOnUse">
                {/* Stylised lotus / shapla petals */}
                <path d="M60 10 Q65 20 60 30 Q55 20 60 10Z" fill={MAROON} opacity="0.045" />
                <path d="M60 10 Q70 18 62 28" fill="none" stroke={MAROON} strokeWidth="0.5" opacity="0.05" />
                <path d="M60 10 Q50 18 58 28" fill="none" stroke={MAROON} strokeWidth="0.5" opacity="0.05" />
                {/* Small leaf left */}
                <path d="M20 55 Q28 45 36 55 Q28 50 20 55Z" fill={GOLD} opacity="0.04" />
                <path d="M28 50 L28 60" stroke={GOLD} strokeWidth="0.4" opacity="0.05" />
                {/* Small leaf right */}
                <path d="M90 50 Q98 40 106 50 Q98 45 90 50Z" fill={GOLD} opacity="0.04" />
                <path d="M98 45 L98 55" stroke={GOLD} strokeWidth="0.4" opacity="0.05" />
                {/* Tiny dots — alpona style */}
                <circle cx="10" cy="15" r="1" fill={MAROON} opacity="0.04" />
                <circle cx="110" cy="70" r="1" fill={MAROON} opacity="0.04" />
                <circle cx="45" cy="70" r="0.8" fill={GOLD} opacity="0.04" />
                <circle cx="75" cy="5" r="0.8" fill={GOLD} opacity="0.04" />
                {/* Curved vine */}
                <path d="M0 40 Q30 30 60 40 Q90 50 120 40" fill="none" stroke={MAROON} strokeWidth="0.4" opacity="0.035" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#banglaFloral)" />
    </svg>
);

/* ─── Bottom motif strip ────────────────────────────────────────── */
const MotifStrip = () => (
    <div className="w-full overflow-hidden" style={{ height: 4 }}>
        <svg width="100%" height="4" preserveAspectRatio="xMidYMid slice">
            <defs>
                <pattern id="strip" x="0" y="0" width="24" height="4" patternUnits="userSpaceOnUse">
                    <path d="M0 2 L6 0 L12 2 L6 4Z" fill={GOLD} opacity="0.5" />
                    <path d="M12 2 L18 0 L24 2 L18 4Z" fill={MAROON} opacity="0.3" />
                </pattern>
            </defs>
            <rect width="100%" height="4" fill="url(#strip)" />
        </svg>
    </div>
);

/* ─── Divider for mobile drawer ────────────────────────────────── */
const MotifDivider = () => (
    <div className="flex items-center gap-2 w-full my-4">
        <span className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD}50)` }} />
        <span style={{ color: GOLD, fontSize: '0.55rem', opacity: 0.7 }}>✦ ✦ ✦</span>
        <span className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${GOLD}50)` }} />
    </div>
);

/* ─── Logo ──────────────────────────────────────────────────────── */
function BanglaLogo({ small, light }: { small?: boolean; light?: boolean }) {
    const textColor = light ? CREAM : DEEP;
    const subColor  = light ? `${GOLD}CC` : `${MAROON}AA`;
    return (
        <Link href="/" className="select-none flex items-center gap-2.5 group">
            {/* Icon: stylised জ in a circle */}
            <div
                className="flex items-center justify-center rounded-full shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{
                    width:  small ? 34 : 42,
                    height: small ? 34 : 42,
                    background: `linear-gradient(135deg, ${MAROON}, ${MAROON}DD)`,
                    boxShadow: `0 2px 8px ${MAROON}30`,
                    border: `2px solid ${GOLD}60`,
                }}
            >
                <span
                    className="font-display font-black"
                    style={{ color: GOLD, fontSize: small ? '1rem' : '1.3rem', lineHeight: 1 }}
                >
                    জ
                </span>
            </div>
            {/* Text */}
            <div className="flex flex-col">
                <span
                    className="font-display font-black leading-none tracking-tight"
                    style={{ fontSize: small ? '1.2rem' : '1.5rem', color: textColor }}
                >
                    ঝামদানি
                </span>
                {!small && (
                    <span
                        className="font-bangla leading-none mt-0.5"
                        style={{ fontSize: '0.55rem', color: subColor, letterSpacing: '0.08em' }}
                    >
                        ঐতিহ্যের শ্রেষ্ঠ সংগ্রহ
                    </span>
                )}
            </div>
        </Link>
    );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                          MAIN HEADER                              */
/* ═══════════════════════════════════════════════════════════════════ */
const Header: React.FC = () => {
    const pathname = usePathname();
    const router   = useRouter();
    const searchParams = useSearchParams();   // reactive → re-renders on query change
    const dispatch = useAppDispatch();

    const [isMobileMenuOpen,  setIsMobileMenuOpen]  = useState(false);
    const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
    const [isDragging,        setIsDragging]        = useState(false);
    const [isProfileOpen,     setIsProfileOpen]     = useState(false);
    const [scrolled,          setScrolled]          = useState(false);

    const profileRef   = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const cartItems = useAppSelector(s => s.cart.items);
    const { user, isAuthenticated } = useAppSelector(s => s.auth);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    useEffect(() => {
        const fn = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node))
                setIsProfileOpen(false);
        };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        setIsProfileOpen(false);
        router.push('/');
    };

    /* ── image search ── */
    const handleImageUpload = useCallback(async (file: File) => {
        setIsImageSearchOpen(false);
        dispatch(setImageSearching(true));
        try {
            const { analyzeImage } = await import('@/utils/imageSearch');
            const analysis = await analyzeImage(file);
            const imageUrl = URL.createObjectURL(file);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labels: analysis.labels,
                    colors: analysis.colors.map((c: any) => c.name),
                    colorHexes: analysis.colors.map((c: any) => c.hex),
                    keywords: analysis.keywords,
                }),
            });
            const data = await res.json();
            if (data.success) {
                dispatch(setImageSearchResults({
                    products: data.data.products,
                    searchMeta: { ...data.data.searchMeta, colors: analysis.colors },
                    previewImage: imageUrl,
                }));
                router.push('/products');
            } else { dispatch(setImageSearching(false)); }
        } catch { dispatch(setImageSearching(false)); }
    }, [dispatch, router]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
    };
    const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true);  };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop      = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file?.type.startsWith('image/')) handleImageUpload(file);
    };
    const handlePaste = useCallback((e: ClipboardEvent) => {
        if (!isImageSearchOpen) return;
        const items = e.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.startsWith('image/')) {
                    const file = items[i].getAsFile();
                    if (file) { handleImageUpload(file); break; }
                }
            }
        }
    }, [isImageSearchOpen, handleImageUpload]);
    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [handlePaste]);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        const [hrefPath, hrefQuery] = href.split('?');
        if (pathname !== hrefPath) return false;
        // Plain link (e.g. /products) is active only when NO filter query is set
        if (!hrefQuery) return !searchParams.has('category') && !searchParams.has('sort');
        // Query link (e.g. /products?category=...) — every param must match
        const hrefParams = new URLSearchParams(hrefQuery);
        for (const [key, val] of hrefParams.entries()) {
            if (searchParams.get(key) !== val) return false;
        }
        return true;
    };

    /* ── Icon button helper ── */
    const IconBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
        <button
            {...props}
            className="relative p-2 rounded-lg transition-all duration-200 text-[#5a3e2b] hover:text-[var(--color-primary)] hover:bg-[#6B0F1A]/8"
        >
            {children}
        </button>
    );

    return (
        <>
            {/* ════════════════════════ MAIN HEADER ════════════════════ */}
            <header
                style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    background: SOFT_BG,
                    transition: 'box-shadow 0.3s ease',
                    boxShadow: scrolled ? '0 2px 20px rgba(45,16,8,0.12)' : 'none',
                }}
            >
                {/* Floral bg pattern */}
                <div className="relative">
                    <FloralPatternBg />

                    <div className="container mx-auto px-4 relative">
                        <div className="flex items-center justify-between gap-4" style={{ height: 70 }}>

                            {/* ── Logo ── */}
                            <div onClick={() => dispatch(clearImageSearch())}>
                                <BanglaLogo />
                            </div>

                            {/* ── Desktop Nav ── */}
                            <nav className="hidden lg:flex items-center gap-1">
                                {NAV_LINKS.map(({ label, href }) => {
                                    const active = isActive(href);
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            className="relative font-bangla font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                                            style={{
                                                fontSize: '0.9rem',
                                                color: active ? MAROON : '#5a3e2b',
                                                background: active ? `${MAROON}0C` : 'transparent',
                                            }}
                                            onMouseEnter={e => {
                                                if (!active) {
                                                    (e.currentTarget as HTMLElement).style.color = MAROON;
                                                    (e.currentTarget as HTMLElement).style.background = `${MAROON}08`;
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (!active) {
                                                    (e.currentTarget as HTMLElement).style.color = '#5a3e2b';
                                                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            {label}
                                            {/* Active underline */}
                                            {active && (
                                                <span
                                                    className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full"
                                                    style={{ background: `linear-gradient(to right, ${MAROON}, ${GOLD})` }}
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* ── Right Actions ── */}
                            <div className="flex items-center gap-0.5">

                                {/* Search */}
                                <IconBtn onClick={() => setIsImageSearchOpen(true)} aria-label="ছবি দিয়ে খুঁজুন">
                                    <FiSearch size={19} />
                                </IconBtn>

                                {/* Cart */}
                                <Link
                                    href="/cart"
                                    className="hidden lg:flex relative p-2 rounded-lg transition-all duration-200 text-[#5a3e2b] hover:text-[var(--color-primary)] hover:bg-[#6B0F1A]/8"
                                    aria-label="কার্ট"
                                >
                                    <FiShoppingCart size={19} />
                                    {cartItems.length > 0 && (
                                        <span
                                            className="absolute -top-0.5 -right-0.5 text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold"
                                            style={{ background: MAROON, color: CREAM, border: `1.5px solid ${SOFT_BG}` }}
                                        >
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>

                                {/* Wishlist */}
                                <Link
                                    href="/dashboard/user/wishlist"
                                    className="hidden lg:flex p-2 rounded-lg transition-all duration-200 text-[#5a3e2b] hover:text-[var(--color-primary)] hover:bg-[#6B0F1A]/8"
                                    aria-label="উইশলিস্ট"
                                >
                                    <FiHeart size={18} />
                                </Link>

                                {/* Auth */}
                                {isAuthenticated && user ? (
                                    <div className="hidden lg:block relative" ref={profileRef}>
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2 ml-1 pl-1 pr-3 py-1.5 rounded-full transition-all duration-200"
                                            style={{
                                                background: isProfileOpen ? `${MAROON}0C` : 'transparent',
                                                border: `1px solid ${isProfileOpen ? MAROON + '25' : 'transparent'}`,
                                            }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${MAROON}08`; }}
                                            onMouseLeave={e => { if (!isProfileOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                        >
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" style={{ border: `2px solid ${GOLD}50` }} />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black" style={{ background: MAROON, color: CREAM }}>
                                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-bangla text-xs font-medium" style={{ color: '#5a3e2b' }}>
                                                {(user.name || '').split(' ')[0] || 'অ্যাকাউন্ট'}
                                            </span>
                                            <FiChevronDown size={13} style={{ color: '#5a3e2b80', transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                        </button>

                                        <AnimatePresence>
                                            {isProfileOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden z-50"
                                                    style={{ background: '#fff', border: `1px solid #e8ddd3`, borderRadius: 8, boxShadow: '0 12px 40px rgba(45,16,8,0.12)' }}
                                                >
                                                    <div className="px-4 py-3" style={{ background: `${SOFT_BG}`, borderBottom: '1px solid #e8ddd3' }}>
                                                        <p className="font-bangla text-sm font-bold truncate" style={{ color: DEEP }}>{user.name || 'ব্যবহারকারী'}</p>
                                                        <p className="text-[11px] truncate mt-0.5" style={{ color: '#8a7560', fontFamily: 'Poppins, sans-serif' }}>{user.email}</p>
                                                    </div>
                                                    <div className="py-1">
                                                        {[
                                                            { href: user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user', icon: <FiUser size={14} />, label: 'ড্যাশবোর্ড' },
                                                            { href: '/dashboard/user/orders', icon: <FiShoppingCart size={14} />, label: 'আমার অর্ডার' },
                                                            { href: '/dashboard/user/wishlist', icon: <FiHeart size={14} />, label: 'উইশলিস্ট' },
                                                        ].map(item => (
                                                            <Link key={item.href} href={item.href}
                                                                  className="font-bangla flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                                                                  style={{ color: '#5a3e2b' }}
                                                                  onClick={() => setIsProfileOpen(false)}>
                                                                <span style={{ color: MAROON }}>{item.icon}</span> {item.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <div className="py-1" style={{ borderTop: '1px solid #e8ddd3' }}>
                                                        <button onClick={handleLogout} className="font-bangla w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                                            <FiX size={14} /> লগআউট
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="hidden lg:flex items-center gap-1.5 ml-2 px-4 py-2 rounded-lg font-bangla text-sm font-semibold transition-all duration-200"
                                        style={{ background: MAROON, color: CREAM }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = DEEP; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = MAROON; }}
                                    >
                                        <FiUser size={14} /> প্রবেশ করুন
                                    </Link>
                                )}

                                {/* Mobile hamburger */}
                                <IconBtn
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    aria-label="মেনু"
                                    className="lg:hidden"
                                >
                                    <FiMenu size={22} />
                                </IconBtn>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom motif strip */}
                <MotifStrip />
            </header>

            {/* ════════════════════════ MOBILE DRAWER ══════════════════ */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-[100] lg:hidden"
                            style={{ background: 'rgba(45,16,8,0.6)', backdropFilter: 'blur(3px)' }}
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed top-0 right-0 bottom-0 w-72 z-[101] shadow-2xl lg:hidden flex flex-col overflow-hidden"
                            style={{ background: CREAM }}
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-5 py-3.5" style={{ background: MAROON }}>
                                <BanglaLogo small light />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: `${CREAM}CC` }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = `${CREAM}CC`; }}>
                                    <FiX size={22} />
                                </button>
                            </div>

                            {/* Nav links */}
                            <div className="flex-1 overflow-y-auto px-4 py-5" style={{ background: CREAM }}>
                                <p className="font-bangla text-[10px] font-bold uppercase tracking-widest mb-3 px-2" style={{ color: `${MAROON}60` }}>মেনু</p>
                                <nav className="flex flex-col gap-0.5">
                                    {NAV_LINKS.map(({ label, href, icon }) => {
                                        const active = isActive(href);
                                        return (
                                            <Link
                                                key={href} href={href}
                                                className="font-bangla flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-semibold transition-all"
                                                style={{
                                                    background: active ? `${MAROON}0D` : 'transparent',
                                                    color: active ? MAROON : DEEP,
                                                    borderLeft: active ? `3px solid ${GOLD}` : '3px solid transparent',
                                                }}
                                            >
                                                <span>{icon}</span>
                                                {label}
                                                {active && <span className="ml-auto text-xs" style={{ color: GOLD }}>◆</span>}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <MotifDivider />

                                <p className="font-bangla text-[10px] font-bold uppercase tracking-widest mb-3 px-2" style={{ color: `${MAROON}60` }}>আমার অ্যাকাউন্ট</p>
                                <div className="flex flex-col gap-0.5">
                                    {[
                                        { href: '/dashboard/user',          icon: <FiUser size={16} />,         label: 'আমার অ্যাকাউন্ট' },
                                        { href: '/dashboard/user/wishlist', icon: <FiHeart size={16} />,        label: 'উইশলিস্ট' },
                                        { href: '/cart',                    icon: <FiShoppingCart size={16} />,  label: 'আমার কার্ট', badge: cartItems.length },
                                    ].map(item => (
                                        <Link key={item.href} href={item.href}
                                              className="font-bangla flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] transition-all hover:bg-[#6B0F1A08]"
                                              style={{ color: DEEP }}>
                                            <span style={{ color: MAROON }}>{item.icon}</span>
                                            {item.label}
                                            {item.badge ? (
                                                <span className="ml-auto text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold" style={{ background: MAROON, color: CREAM }}>
                                                    {item.badge}
                                                </span>
                                            ) : null}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-4" style={{ background: DEEP }}>
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    {[FaFacebookF, FaWhatsapp, FaYoutube].map((Icon, i) => (
                                        <a key={i} href="#" className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                                           style={{ border: `1px solid ${GOLD}35`, color: `${GOLD}70` }}
                                           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD; (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
                                           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = `${GOLD}70`; (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}35`; }}>
                                            <Icon size={13} />
                                        </a>
                                    ))}
                                </div>
                                <p className="font-bangla text-[10px] text-center" style={{ color: `${GOLD}55` }}>
                                    © {new Date().getFullYear()} ঝামদানি · ঢাকা, বাংলাদেশ
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ════════════════════════ IMAGE SEARCH MODAL ═════════════ */}
            <AnimatePresence>
                {isImageSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4"
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsImageSearchOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-md overflow-hidden"
                            style={{ background: CREAM, borderRadius: 10, boxShadow: '0 20px 60px rgba(45,16,8,0.2)', border: '1px solid #e8ddd3' }}
                        >
                            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #e8ddd3' }}>
                                <div>
                                    <h3 className="font-display font-bold" style={{ color: DEEP, fontSize: '1rem' }}>ছবি দিয়ে খুঁজুন</h3>
                                    <p className="font-bangla text-[11px]" style={{ color: '#8a7560' }}>যে পণ্যটি চান তার ছবি আপলোড করুন</p>
                                </div>
                                <button onClick={() => setIsImageSearchOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                    <FiX size={18} />
                                </button>
                            </div>
                            <div className="p-5">
                                <div
                                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="cursor-pointer p-10 text-center transition-all rounded-lg"
                                    style={{ border: `2px dashed ${isDragging ? GOLD : '#d4c9b8'}`, background: isDragging ? `${GOLD}08` : `${SOFT_BG}` }}
                                >
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors"
                                         style={{ background: isDragging ? `${GOLD}15` : `${MAROON}10`, color: isDragging ? GOLD : MAROON }}>
                                        <FiUpload size={24} />
                                    </div>
                                    <p className="font-bangla font-semibold mb-1" style={{ color: DEEP }}>এখানে ছবি টেনে আনুন</p>
                                    <p className="font-bangla text-sm mb-3" style={{ color: '#8a7560' }}>অথবা ক্লিক করে বেছে নিন</p>
                                    <kbd className="font-bangla text-xs px-2.5 py-1 rounded" style={{ background: `${MAROON}08`, color: MAROON, border: `1px solid ${MAROON}15` }}>
                                        Ctrl+V দিয়ে পেস্ট করুন
                                    </kbd>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
