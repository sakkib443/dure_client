"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiShoppingCart, FiChevronDown, FiX, FiSearch,
    FiFilter, FiChevronRight, FiStar, FiHeart,
} from 'react-icons/fi';

const LIMIT = 24;

// Default "popularity" sort: most sold → best rated → most viewed → newest (tiebreaker)
const DEFAULT_SORT = '-totalSold,-rating,-viewCount,-createdAt';

const SORT_OPTIONS = [
    { label: 'জনপ্রিয় আগে',      value: DEFAULT_SORT },
    { label: 'নতুন আগে',         value: '-createdAt' },
    { label: 'কম দামে আগে',      value: 'price'      },
    { label: 'বেশি দামে আগে',    value: '-price'     },
    { label: 'সর্বাধিক বিক্রিত', value: '-totalSold' },
    { label: 'সেরা রেটিং',       value: '-rating'    },
];

const PRICE_PRESETS = [
    { label: 'সব দাম',        min: '', max: ''     },
    { label: '৳৫০০ এর নিচে', min: '', max: '500'  },
    { label: '৳৫০০ – ১৫০০',  min: '500', max: '1500' },
    { label: '৳১৫০০ – ৩০০০', min: '1500', max: '3000' },
    { label: '৳৩০০০ – ৭০০০', min: '3000', max: '7000' },
    { label: '৳৭০০০ এর উপরে', min: '7000', max: '' },
];

// ── Group categories into parent → children tree ──────────────
function buildTree(cats: any[]) {
    const roots: any[] = [];
    const childMap: Record<string, any[]> = {};
    cats.forEach(c => {
        const parentId = c.parent?._id || c.parent || null;
        if (!parentId) {
            roots.push(c);
        } else {
            if (!childMap[parentId]) childMap[parentId] = [];
            childMap[parentId].push(c);
        }
    });
    return { roots, childMap };
}

// ── Sidebar Filter ──────────────────────────────────────────────
function SidebarFilter({
    categories, selectedCategory, onCategorySelect,
    priceRange, onPriceChange, localSearch, onSearchChange,
    onSearch, onClear, hasActiveFilters, searchParam,
}: any) {
    const { roots, childMap } = useMemo(() => buildTree(categories), [categories]);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (id: string) =>
        setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));

    const [activePricePreset, setActivePricePreset] = useState(0);

    const handlePreset = (i: number) => {
        setActivePricePreset(i);
        onPriceChange(PRICE_PRESETS[i].min, PRICE_PRESETS[i].max);
    };

    return (
        <div className="space-y-5">

            {/* ── Search ── */}
            <form onSubmit={onSearch}>
                <div className="relative">
                    <input
                        type="text"
                        value={localSearch}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="পণ্য খুঁজুন…"
                        className="font-bangla w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-[var(--color-primary)] bg-[#faf8f5] placeholder-gray-400"
                    />
                    <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </form>

            <div className="h-px bg-gray-100" />

            {/* ── Categories ── */}
            <div>
                <h4 className="font-bangla text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">ক্যাটাগরি</h4>
                <ul className="space-y-0.5">
                    {/* All */}
                    <li>
                        <button
                            onClick={() => onCategorySelect('')}
                            className={`font-bangla w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                                !selectedCategory
                                    ? 'bg-[var(--color-primary)] text-white font-semibold shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span className="text-base">🧺</span> সব পণ্য
                        </button>
                    </li>

                    {/* Root categories + children */}
                    {roots.map(root => {
                        const children = childMap[root._id] || [];
                        const isRootActive = selectedCategory === root._id;
                        const hasActiveChild = children.some(c => c._id === selectedCategory);
                        const isOpen = openGroups[root._id] ?? (isRootActive || hasActiveChild);

                        return (
                            <li key={root._id}>
                                {/* Parent row */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onCategorySelect(root._id)}
                                        className={`font-bangla flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                                            isRootActive
                                                ? 'bg-[var(--color-primary)] text-white font-semibold shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-base">{root.icon || '🏷️'}</span>
                                        <span className="flex-1">{root.name}</span>
                                        {root.productCount > 0 && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isRootActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                {root.productCount}
                                            </span>
                                        )}
                                    </button>
                                    {children.length > 0 && (
                                        <button
                                            onClick={() => toggleGroup(root._id)}
                                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                                        >
                                            <FiChevronRight
                                                size={13}
                                                className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                                            />
                                        </button>
                                    )}
                                </div>

                                {/* Sub-categories */}
                                <AnimatePresence>
                                    {isOpen && children.length > 0 && (
                                        <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3"
                                        >
                                            {children.map(child => (
                                                <li key={child._id}>
                                                    <button
                                                        onClick={() => onCategorySelect(child._id)}
                                                        className={`font-bangla w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] transition-all text-left ${
                                                            selectedCategory === child._id
                                                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                                                                : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        <span className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0" />
                                                        <span className="flex-1">{child.name}</span>
                                                        {child.productCount > 0 && (
                                                            <span className="text-[10px] text-gray-400">{child.productCount}</span>
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="h-px bg-gray-100" />

            {/* ── Price Presets ── */}
            <div>
                <h4 className="font-bangla text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">দামের সীমা</h4>
                <div className="space-y-1">
                    {PRICE_PRESETS.map((preset, i) => (
                        <button
                            key={i}
                            onClick={() => handlePreset(i)}
                            className={`font-bangla w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                                activePricePreset === i
                                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                {/* Custom range */}
                <div className="flex items-center gap-2 mt-3">
                    <input
                        type="number"
                        placeholder="সর্বনিম্ন"
                        value={priceRange.min}
                        onChange={e => { setActivePricePreset(-1); onPriceChange(e.target.value, priceRange.max); }}
                        className="font-bangla w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 bg-[#faf8f5] focus:outline-none focus:border-[var(--color-primary)] placeholder-gray-400"
                    />
                    <span className="text-gray-300 shrink-0">—</span>
                    <input
                        type="number"
                        placeholder="সর্বোচ্চ"
                        value={priceRange.max}
                        onChange={e => { setActivePricePreset(-1); onPriceChange(priceRange.min, e.target.value); }}
                        className="font-bangla w-full text-sm border border-gray-200 rounded-lg px-2.5 py-2 bg-[#faf8f5] focus:outline-none focus:border-[var(--color-primary)] placeholder-gray-400"
                    />
                </div>
            </div>

            {/* ── Clear ── */}
            {hasActiveFilters && (
                <>
                    <div className="h-px bg-gray-100" />
                    <button
                        onClick={() => { setActivePricePreset(0); onClear(); }}
                        className="font-bangla w-full text-sm text-red-500 hover:text-white hover:bg-red-500 font-medium py-2.5 border border-red-200 rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                        <FiX size={14} /> সব ফিল্টার মুছুন
                    </button>
                </>
            )}
        </div>
    );
}

// ── Product Card ────────────────────────────────────────────────
function ProductCard({ product: p, onAddToCart }: { product: any; onAddToCart: (p: any, e: React.MouseEvent) => void }) {
    const discountPct = p.originalPrice && p.price < p.originalPrice
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    return (
        <Link href={p.slug ? `/product/${p.slug}` : '#'} className="group block">

            {/* Image */}
            <div className="relative overflow-hidden aspect-[3/4]" style={{ background: '#f5efe6', borderRadius: 3 }}>
                {p.thumbnail ? (
                    <img
                        src={p.thumbnail}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl"
                         style={{ background: 'linear-gradient(135deg, #f5efe6, #e8ddd3)' }}>
                        🧶
                    </div>
                )}

                {/* Discount badge */}
                {discountPct > 0 && (
                    <span
                        className="absolute top-2 left-2 bg-[#800000] text-white text-[10px] font-bold px-2 py-0.5"
                        style={{ fontFamily: "'Poppins', sans-serif", borderRadius: 2 }}
                    >
                        -{discountPct}%
                    </span>
                )}

                {/* Wishlist */}
                <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
                >
                    <FiHeart size={13} />
                </button>

                {/* Add to cart hover */}
                <button
                    onClick={e => onAddToCart(p, e)}
                    className="font-bangla-round absolute bottom-0 left-0 right-0 bg-[#1a0808]/85 text-[#fde8a8] text-sm font-semibold py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                >
                    <FiShoppingCart size={14} />
                    কার্টে যোগ করুন
                </button>
            </div>

            {/* Info */}
            <div className="pt-3 pb-1">
                {p.category?.name && (
                    <p className="font-bangla text-[10px] text-[var(--color-primary)] uppercase tracking-wider mb-1 opacity-70">{p.category.name}</p>
                )}
                <h3
                    className="font-bangla text-gray-800 font-medium leading-snug mb-1.5 line-clamp-2 group-hover:text-[#800000] transition-colors"
                    style={{ fontSize: '0.95rem' }}
                >
                    {p.name}
                </h3>

                <div className="flex items-center gap-2">
                    <span className="font-bold text-[#800000]" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.88rem' }}>
                        ৳{p.price?.toLocaleString('bn-BD')}
                    </span>
                    {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-gray-400 line-through text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            ৳{p.originalPrice?.toLocaleString('bn-BD')}
                        </span>
                    )}
                </div>

                {/* Rating */}
                {p.rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        <FiStar size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-[11px] text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {p.rating.toFixed(1)}
                            {p.reviewCount > 0 && <span className="text-gray-400"> ({p.reviewCount})</span>}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}

// ── Skeleton Card ───────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded" style={{ borderRadius: 3 }} />
            <div className="pt-3 space-y-2">
                <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────────
const ProductsPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const categoryParam = searchParams.get('category') || '';
    const searchParam   = searchParams.get('q') || '';
    const sortParam     = searchParams.get('sort') || '';

    const [page,             setPage]             = useState(1);
    const [sortBy,           setSortBy]           = useState(sortParam === 'newest' ? '-createdAt' : DEFAULT_SORT);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [categories,       setCategories]       = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [localSearch,      setLocalSearch]      = useState(searchParam);
    const [priceRange,       setPriceRange]       = useState({ min: '', max: '' });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
                const data = await res.json();
                if (data.success) setCategories(data.data || data.categories || []);
            } catch (e) { console.error(e); }
        };
        fetchCategories();
    }, []);

    // Resolve slug-based category param (e.g. 'jamdani') to actual category ID
    useEffect(() => {
        if (categoryParam && categories.length > 0) {
            // Check if categoryParam is already a valid ID
            const isId = categories.some(c => c._id === categoryParam);
            if (isId) {
                setSelectedCategory(categoryParam);
            } else {
                const lower = categoryParam.toLowerCase();
                // 1) exact slug match  2) parent (level 0) partial slug  3) any partial slug/name
                let match =
                    categories.find(c => c.slug?.toLowerCase() === lower) ||
                    categories.find(c => (c.level === 0 || !c.parent) && c.slug?.toLowerCase().includes(lower)) ||
                    categories.find(c =>
                        c.slug?.toLowerCase().includes(lower) ||
                        c.name?.toLowerCase().includes(lower)
                    );
                setSelectedCategory(match ? match._id : '');
            }
        } else if (!categoryParam) {
            setSelectedCategory('');
        }
        setLocalSearch(searchParam);
        // No sort param → popular first; ?sort=newest → newest first
        setSortBy(sortParam === 'newest' ? '-createdAt' : DEFAULT_SORT);
        setPage(1);
    }, [categoryParam, searchParam, sortParam, categories]);

    // Build query
    const queryParams = useMemo(() => {
        const params: any = { page, limit: LIMIT, sort: sortBy };
        if (selectedCategory) params.category = selectedCategory;
        if (searchParam) params.searchTerm = searchParam;
        if (priceRange.min) params.minPrice = priceRange.min;
        if (priceRange.max) params.maxPrice = priceRange.max;
        return params;
    }, [page, sortBy, selectedCategory, searchParam, priceRange]);

    const { data, isFetching } = useGetProductsQuery(queryParams);
    const products = data?.data || [];
    const meta     = data?.meta || { total: 0, totalPage: 1 };

    const handleCategorySelect = useCallback((catId: string) => {
        const params = new URLSearchParams();
        if (catId) params.set('category', catId);
        if (searchParam) params.set('q', searchParam);
        router.push(`/products?${params.toString()}`);
        setShowMobileFilter(false);
    }, [router, searchParam]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (localSearch.trim()) params.set('q', localSearch.trim());
        if (selectedCategory) params.set('category', selectedCategory);
        router.push(`/products?${params.toString()}`);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setLocalSearch('');
        setPriceRange({ min: '', max: '' });
        router.push('/products');
    };

    const handleAddToCart = (product: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id:        product._id,
            productId: product._id,
            name:      product.name,
            price:     product.price,
            mrp:       product.originalPrice || product.price,
            image:     product.thumbnail || '',
            category:  product.category?.name || '',
            quantity:  1,
        }));
        toast.success('কার্টে যোগ হয়েছে!', {
            icon: '🛒',
            style: { fontFamily: 'Hind Siliguri, sans-serif' },
        });
    };

    const activeCategoryName = categories.find(c => c._id === selectedCategory)?.name || '';
    const hasActiveFilters   = !!(selectedCategory || searchParam || priceRange.min || priceRange.max);
    const currentSortLabel   = SORT_OPTIONS.find(s => s.value === sortBy)?.label || '';

    const filterProps = {
        categories, selectedCategory,
        onCategorySelect: handleCategorySelect,
        priceRange, onPriceChange: (min: string, max: string) => setPriceRange({ min, max }),
        localSearch, onSearchChange: setLocalSearch,
        onSearch: handleSearch,
        onClear: clearFilters,
        hasActiveFilters,
        searchParam,
    };

    return (
        <div className="min-h-screen" style={{ background: '#F5F0EB' }}>

            {/* ── Page Header ── */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-5">
                    {/* Breadcrumb */}
                    <div className="font-bangla flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">হোম</Link>
                        <FiChevronRight size={12} />
                        <span className="text-gray-700 font-medium">সব পণ্য</span>
                        {activeCategoryName && (
                            <>
                                <FiChevronRight size={12} />
                                <span className="text-[var(--color-primary)] font-medium">{activeCategoryName}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="font-display text-[#5F0000] font-bold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 1.2 }}>
                                {searchParam
                                    ? `"${searchParam}" এর ফলাফল`
                                    : activeCategoryName || 'সব পণ্য'}
                            </h1>
                            <p className="font-bangla text-sm text-gray-400 mt-1">
                                মোট <span className="text-gray-700 font-semibold">{meta.total || products.length}</span>টি পণ্য পাওয়া গেছে
                            </p>
                        </div>
                        {/* Active filter chips */}
                        <div className="hidden sm:flex items-center gap-2 flex-wrap">
                            {activeCategoryName && (
                                <span className="font-bangla flex items-center gap-1.5 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1.5 rounded-full font-medium">
                                    {activeCategoryName}
                                    <button onClick={() => handleCategorySelect('')}><FiX size={11} /></button>
                                </span>
                            )}
                            {searchParam && (
                                <span className="font-bangla flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full font-medium">
                                    "{searchParam}"
                                    <button onClick={() => router.push(`/products${selectedCategory ? `?category=${selectedCategory}` : ''}`)}>
                                        <FiX size={11} />
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">

                    {/* ══ DESKTOP SIDEBAR ══ */}
                    <aside className="hidden lg:block w-60 shrink-0">
                        <div
                            className="bg-white p-5 sticky top-24"
                            style={{ borderRadius: 4, border: '1px solid #e5e0d8' }}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bangla font-bold text-gray-900 text-sm">ফিল্টার</h3>
                                {hasActiveFilters && (
                                    <button onClick={clearFilters} className="font-bangla text-xs text-red-500 hover:underline">মুছুন</button>
                                )}
                            </div>
                            <SidebarFilter {...filterProps} />
                        </div>
                    </aside>

                    {/* ══ MAIN CONTENT ══ */}
                    <div className="flex-1 min-w-0">

                        {/* Top bar: mobile filter + sort */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                {/* Mobile filter button */}
                                <button
                                    onClick={() => setShowMobileFilter(true)}
                                    className="font-bangla lg:hidden flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3.5 py-2 hover:border-[var(--color-primary)]/40 transition-colors shadow-sm"
                                >
                                    <FiFilter size={14} /> ফিল্টার
                                    {hasActiveFilters && (
                                        <span className="ml-1 w-4 h-4 bg-[var(--color-primary)] text-white text-[9px] rounded-full flex items-center justify-center font-bold">!</span>
                                    )}
                                </button>
                            </div>

                            {/* Sort dropdown */}
                            <div className="relative" onClick={() => setShowSortDropdown(false)}>
                                <button
                                    onClick={e => { e.stopPropagation(); setShowSortDropdown(v => !v); }}
                                    className="font-bangla flex items-center gap-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3.5 py-2 hover:border-[var(--color-primary)]/40 transition-colors shadow-sm"
                                >
                                    <span className="text-gray-400 text-xs">সাজান:</span> {currentSortLabel}
                                    <FiChevronDown size={13} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {showSortDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-30 w-52 overflow-hidden"
                                        >
                                            {SORT_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                                                    className={`font-bangla w-full text-left text-sm px-4 py-2.5 hover:bg-gray-50 transition-colors ${sortBy === opt.value ? 'text-[var(--color-primary)] font-semibold' : 'text-gray-600'}`}
                                                >
                                                    {sortBy === opt.value && <span className="mr-2">✓</span>}
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* ── Product Grid ── */}
                        {isFetching && products.length === 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-24">
                                <div className="text-7xl mb-5">🔍</div>
                                <h3 className="font-bangla text-xl font-semibold text-gray-700 mb-2">কোনো পণ্য পাওয়া যায়নি</h3>
                                <p className="font-bangla text-gray-500 mb-6">ভিন্ন কীওয়ার্ড অথবা ক্যাটাগরি ব্যবহার করুন</p>
                                <button onClick={clearFilters} className="font-bangla text-sm text-[var(--color-primary)] hover:underline font-medium">
                                    সব ফিল্টার মুছুন
                                </button>
                            </div>
                        ) : (
                            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                                {products.map((product: any) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                        )}

                        {/* ── Pagination ── */}
                        {meta.totalPage > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="font-bangla px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-[var(--color-primary)]/40 disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-sm transition-colors"
                                >
                                    ← আগে
                                </button>
                                {Array.from({ length: Math.min(meta.totalPage, 5) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-10 h-10 text-sm rounded-lg border transition-colors shadow-sm ${page === pageNum ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'border-gray-200 hover:border-[var(--color-primary)]/40 bg-white text-gray-600'}`}
                                            style={{ fontFamily: "'Poppins', sans-serif" }}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    disabled={page >= meta.totalPage}
                                    onClick={() => setPage(p => p + 1)}
                                    className="font-bangla px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-[var(--color-primary)]/40 disabled:opacity-40 disabled:cursor-not-allowed bg-white shadow-sm transition-colors"
                                >
                                    পরে →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══ MOBILE FILTER DRAWER ══ */}
            <AnimatePresence>
                {showMobileFilter && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilter(false)}
                            className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-white z-[101] shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h3 className="font-bangla font-bold text-gray-900">ফিল্টার</h3>
                                <button onClick={() => setShowMobileFilter(false)} className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                                    <FiX size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-5 py-5">
                                <SidebarFilter {...filterProps} />
                            </div>
                            <div className="px-5 py-4 border-t border-gray-100">
                                <button
                                    onClick={() => setShowMobileFilter(false)}
                                    className="font-bangla w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-semibold text-sm"
                                >
                                    ফলাফল দেখুন ({meta.total || products.length}টি)
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductsPage;
