"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    FiShoppingCart, FiCamera, FiChevronDown, FiSearch, FiMenu, FiX,
    FiUpload, FiUser, FiHeart, FiSmartphone, FiHeadphones, FiGlobe,
    FiGrid, FiInstagram, FiFacebook, FiTwitter, FiYoutube
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/redux';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';

import { setImageSearching, setImageSearchResults, clearImageSearch } from '@/redux/slices/imageSearchSlice';
import { logout } from '@/redux/slices/authSlice';
import { useTheme } from '@/components/shared/ThemeProvider';

interface Category {
    _id: string;
    name: string;
    slug: string;
    icon?: string;
}

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isCategoryHovered, setIsCategoryHovered] = useState(false);
    const [isServicesHovered, setIsServicesHovered] = useState(false);
    const categoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const servicesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cartItems = useAppSelector((state) => state.cart.items);
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { data: categoriesData } = useGetCategoriesQuery({});
    const categories: Category[] = categoriesData?.data || [];

    // Sticky scroll
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        setIsProfileOpen(false);
        router.push('/');
    };

    // Category hover
    const handleCategoryMouseEnter = () => {
        if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
        setIsCategoryHovered(true);
    };
    const handleCategoryMouseLeave = () => {
        categoryTimeoutRef.current = setTimeout(() => setIsCategoryHovered(false), 150);
    };

    // Services hover
    const handleServicesMouseEnter = () => {
        if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
        setIsServicesHovered(true);
    };
    const handleServicesMouseLeave = () => {
        servicesTimeoutRef.current = setTimeout(() => setIsServicesHovered(false), 150);
    };

    // Image upload
    const handleImageUpload = useCallback(async (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setIsImageSearchOpen(false);
        setIsSearching(true);
        dispatch(setImageSearching(true));
        try {
            const { analyzeImage } = await import('@/utils/imageSearch');
            const analysis = await analyzeImage(file);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labels: analysis.labels,
                    colors: analysis.colors.map(c => c.name),
                    colorHexes: analysis.colors.map(c => c.hex),
                    keywords: analysis.keywords,
                }),
            });
            const data = await response.json();
            if (data.success) {
                dispatch(setImageSearchResults({
                    products: data.data.products,
                    searchMeta: { ...data.data.searchMeta, colors: analysis.colors },
                    previewImage: imageUrl,
                }));
                router.push('/products');
            } else {
                dispatch(setImageSearching(false));
            }
        } catch {
            dispatch(setImageSearching(false));
        } finally {
            setIsSearching(false);
        }
    }, [dispatch, router]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) handleImageUpload(file);
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

    const clearImage = () => { setSelectedImage(null); setIsSearching(false); };

    const handleSearch = () => {
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        dispatch(clearImageSearch());
        router.push(`/products?q=${encodeURIComponent(trimmed)}`);
    };

    const handleGoHome = () => {
        setSearchQuery('');
        dispatch(clearImageSearch());
    };

    const serviceLinks = [
        { label: 'Sourcing', href: '/services/sourcing' },
        { label: 'Shipping', href: '/services/shipping' },
        { label: 'Freight Forwarding', href: '/services/freight' },
        { label: 'Customs Clearance', href: '/services/customs' },
        { label: 'Warehousing', href: '/services/warehousing' },
    ];

    return (
        <>
            <header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    transition: 'box-shadow 0.3s ease',
                    boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.12)' : 'none',
                }}
            >

                {/* ═══ MAIN HEADER ═══ */}
                <div className="bg-[#E3DEDB] border-b border-gray-200/20">
                    <div className="container mx-auto px-2">
                        <div className="flex items-center justify-between py-2.5 gap-3 lg:gap-5">

                            {/* Logo (Left on Mobile/Desktop) */}
                            <Link href="/" className="flex items-center gap-2 shrink-0" onClick={handleGoHome}>
                                <HeaderLogo />
                            </Link>

                            {/* Navigation Links (Desktop Middle) */}
                            <nav className="hidden lg:flex items-center gap-4 xl:gap-8 flex-1 justify-center">
                                <Link href="/products?filter=new" className="text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors">New Arrivals</Link>
                                <Link href="/category/women" className="text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors">Women</Link>
                                <Link href="/category/men" className="text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors">Men</Link>
                                <Link href="/category/kids" className="text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors">Kids</Link>
                                <Link href="/category/home-decor" className="text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors text-nowrap">Home Decor</Link>
                                <Link href="/category/patchwork" className="text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors">Patchwork</Link>
                                <Link href="/category/jewellery" className="text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors">Jewellery</Link>
                                <Link href="/category/gifts-crafts" className="text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors text-nowrap">Gifts & Crafts</Link>
                                <Link href="/category/hojoborolo" className="text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary)] transition-colors text-nowrap">Ho-Jo-Bo-Ro-Lo</Link>
                            </nav>

                            {/* Right Actions */}
                            <div className="flex items-center gap-1 lg:gap-4 shrink-0">
                                {/* Search Icon */}
                                <button onClick={() => setIsImageSearchOpen(true)} className="p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors">
                                    <FiSearch size={22} className="lg:size-[22px] size-[20px]" />
                                </button>

                                {/* Cart (Desktop) */}
                                <Link href="/cart" className="hidden lg:block relative p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors">
                                    <FiShoppingCart size={22} />
                                    {cartItems.length > 0 && (
                                        <span className="absolute top-1 right-0 bg-[#8b0000] text-white text-[9px] w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>

                                {/* Grid Menu Icon (Mobile) */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <FiGrid size={22} />
                                </button>

                                {/* Auth Section (Desktop) */}
                                {isAuthenticated && user ? (
                                    <div className="hidden lg:block relative" ref={profileRef}>
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-colors"
                                        >
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold">
                                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </button>

                                        {/* Profile Dropdown */}
                                        {isProfileOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{user.name || 'User'}</p>
                                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    <Link href={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsProfileOpen(false)}>Dashboard</Link>
                                                    <Link href="/dashboard/user/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsProfileOpen(false)}>My Orders</Link>
                                                </div>
                                                <div className="border-t border-gray-100 py-1">
                                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link href="/login" className="hidden lg:block p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors">
                                        <FiUser size={22} />
                                    </Link>
                                )}
                            </div>
                        </div>


                {/* Mobile Side Drawer (Right Side) */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
                            />
                            {/* Drawer Content */}
                            <motion.div 
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[101] shadow-2xl lg:hidden flex flex-col"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                    <HeaderLogo />
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                                        <FiX size={24} />
                                    </button>
                                </div>

                                {/* Links */}
                                <div className="flex-1 overflow-y-auto py-6 px-4">
                                    <nav className="flex flex-col gap-5">
                                        <Link href="/products?filter=new" className="text-[16px] font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
                                        <Link href="/category/women" className="text-[16px] font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Women</Link>
                                        <Link href="/category/men" className="text-[16px] font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Men</Link>
                                        <Link href="/category/kids" className="text-[16px] font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Kids</Link>
                                        <Link href="/category/home-decor" className="text-[16px] font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Home Decor</Link>
                                        <Link href="/category/patchwork" className="text-[16px] font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Patchwork</Link>
                                        <Link href="/category/jewellery" className="text-[16px] font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Jewellery</Link>
                                        <Link href="/category/gifts-crafts" className="text-[16px] font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Gifts & Crafts</Link>
                                        <Link href="/category/hojoborolo" className="text-[16px] font-medium text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>Ho-Jo-Bo-Ro-Lo</Link>
                                    </nav>
                                    
                                    <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                                        <Link href="/dashboard/user" className="flex items-center gap-3 text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                                            <FiUser size={18} /> Accounts
                                        </Link>
                                        <Link href="/wishlist" className="flex items-center gap-3 text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                                            <FiHeart size={18} /> Wishlist
                                        </Link>
                                        <Link href="/cart" className="flex items-center gap-3 text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                                            <FiShoppingCart size={18} /> My Cart
                                        </Link>
                                    </div>
                                </div>

                                {/* Social Links & Footer */}
                                <div className="p-6 border-t border-gray-100 bg-gray-50">
                                    <div className="flex items-center justify-around text-gray-600 mb-4">
                                        <a href="#" className="hover:text-[var(--color-primary)] transition-colors"><FiInstagram size={20} /></a>
                                        <a href="#" className="hover:text-[var(--color-primary)] transition-colors"><FiFacebook size={20} /></a>
                                        <a href="#" className="hover:text-[var(--color-primary)] transition-colors"><FiTwitter size={20} /></a>
                                        <a href="#" className="hover:text-[var(--color-primary)] transition-colors"><FiYoutube size={20} /></a>
                                    </div>
                                    <p className="text-[10px] text-center text-gray-400">© 2026 Jhamdani Limited</p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                    </div>
                </div>


            </header>

            {/* Image Search Modal */}
            {isImageSearchOpen && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsImageSearchOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-fadeIn overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-base font-semibold text-gray-800">Search products by Image</h3>
                            <button onClick={() => setIsImageSearchOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 scale-[1.02]' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'}`}
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-gray-100 text-gray-400'}`}>
                                        <FiUpload size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Paste with <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">Ctrl</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">V</kbd>
                                        </p>
                                        <p className="text-sm text-gray-400">Drag and drop an image here, or click to browse</p>
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-8 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Browse File
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/* Dynamic Logo Component */
function HeaderLogo() {
    return <Image src="/images/chutli.png" alt="Chutli" width={150} height={50} style={{ width: 'auto', height: '40px' }} priority />;
}

export default Header;
