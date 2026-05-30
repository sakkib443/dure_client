"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';
import { useGetProductsQuery } from '@/redux/api/productApi';
import ShopCard from '@/components/shared/ShopCard';
import Loader from '@/components/shared/Loader';
import {
    FiChevronRight,
    FiChevronDown,
    FiFilter,
    FiX,
    FiSliders,
    FiGrid,
    FiAlertCircle,
    FiHome
} from 'react-icons/fi';

const LIMIT = 12;

const SORT_OPTIONS = [
    { label: 'Newest First', value: '-createdAt' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Most Popular', value: '-totalSold' },
    { label: 'Top Rated', value: '-rating' },
];

export default function CategoryPage() {
    const { slug } = useParams();
    const router = useRouter();
    const currentSlug = slug as string;

    // States for sorting, filtering, pagination
    const [sortBy, setSortBy] = useState('-createdAt');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [page, setPage] = useState(1);
    
    // Price range filters
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sliderMax, setSliderMax] = useState(10000);
    const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 10000 });

    // Fetch all categories
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({});
    const categories = useMemo(() => categoriesData?.data || categoriesData?.categories || [], [categoriesData]);

    // Active Category lookup
    const activeCategory = useMemo(() => {
        return categories.find((cat: any) => cat.slug === currentSlug);
    }, [categories, currentSlug]);

    // Track active expansion paths for category tree
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    // Ancestry / Breadcrumbs helper
    const breadcrumbs = useMemo(() => {
        if (!activeCategory || categories.length === 0) return [];
        const path = [activeCategory];
        let current = activeCategory;
        
        while (current.parent) {
            const parentId = typeof current.parent === 'object' ? current.parent._id : current.parent;
            const parent = categories.find((c: any) => c._id === parentId);
            if (parent) {
                path.unshift(parent);
                current = parent;
            } else {
                break;
            }
        }
        return path;
    }, [activeCategory, categories]);

    // Build hierarchical category tree from flat categories array
    const categoryTree = useMemo(() => {
        if (categories.length === 0) return [];
        
        const map: Record<string, any> = {};
        const roots: any[] = [];

        // Initialize map
        categories.forEach((cat: any) => {
            map[cat._id] = { ...cat, children: [] };
        });

        // Link parents and children
        categories.forEach((cat: any) => {
            const parentId = cat.parent && typeof cat.parent === 'object' ? cat.parent._id : cat.parent;
            if (parentId && map[parentId]) {
                map[parentId].children.push(map[cat._id]);
            } else if (!parentId || !map[parentId]) {
                // If it doesn't have parent or parent doesn't exist in active cats, it is a root
                roots.push(map[cat._id]);
            }
        });

        // Sort roots and children by order
        const sortNodes = (nodes: any[]) => {
            nodes.sort((a, b) => (a.order || 0) - (b.order || 0));
            nodes.forEach(n => {
                if (n.children.length > 0) {
                    sortNodes(n.children);
                }
            });
        };
        sortNodes(roots);

        return roots;
    }, [categories]);

    // Auto-expand paths leading to current active category
    useEffect(() => {
        if (breadcrumbs.length > 0) {
            const newExpands: Record<string, boolean> = { ...expandedCategories };
            breadcrumbs.forEach((bc: any) => {
                newExpands[bc._id] = true;
            });
            setExpandedCategories(newExpands);
        }
    }, [breadcrumbs]);

    // Query parameters for products
    const queryParams = useMemo(() => {
        const params: any = {
            category: currentSlug,
            page,
            limit: LIMIT,
            sort: sortBy
        };
        if (priceRange.min) params.minPrice = priceRange.min;
        if (priceRange.max) params.maxPrice = priceRange.max;
        return params;
    }, [currentSlug, page, sortBy, priceRange]);

    // Fetch products
    const { data: productsData, isFetching: productsFetching, isLoading: productsLoading } = useGetProductsQuery(queryParams);
    const products = useMemo(() => productsData?.data || [], [productsData]);
    const meta = useMemo(() => productsData?.meta || { total: 0, totalPage: 1 }, [productsData]);

    // Dynamic price calculation from products if needed, but static default range 0 - 25000 BDT is premium
    useEffect(() => {
        if (products.length > 0) {
            // Find max price to set dynamic slider maximum
            const maxVal = Math.max(...products.map((p: any) => p.price), 10000);
            setSliderMax(Math.ceil(maxVal / 1000) * 1000);
        }
    }, [products]);

    // Handle range slider updates
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setTempPriceRange(prev => ({ ...prev, max: val }));
    };

    const applyPriceFilter = () => {
        setPriceRange({
            min: String(tempPriceRange.min),
            max: String(tempPriceRange.max)
        });
        setPage(1);
        setShowMobileFilter(false);
    };

    const clearPriceFilter = () => {
        setTempPriceRange({ min: 0, max: sliderMax });
        setPriceRange({ min: '', max: '' });
        setPage(1);
    };

    const toggleExpand = (catId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setExpandedCategories(prev => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    // Helper to render category node recursively
    const renderCategoryNode = (node: any, depth = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedCategories[node._id];
        const isActive = node.slug === currentSlug;
        const isActiveParent = breadcrumbs.some(bc => bc._id === node._id);

        return (
            <div key={node._id} className="select-none">
                <div 
                    className={`flex items-center justify-between py-1.5 px-2 rounded-md transition-all duration-200 cursor-pointer ${
                        isActive 
                            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)]' 
                            : isActiveParent
                            ? 'text-[var(--color-primary)] font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    style={{ paddingLeft: `${Math.max(8, depth * 14)}px` }}
                    onClick={() => {
                        router.push(`/category/${node.slug}`);
                        setPage(1);
                    }}
                >
                    <span className="text-sm truncate flex-1">{node.name}</span>
                    {hasChildren && (
                        <button 
                            onClick={(e) => toggleExpand(node._id, e)}
                            className="p-1 text-gray-400 hover:text-[var(--color-primary)] transition-colors rounded hover:bg-gray-200/50"
                        >
                            {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                        </button>
                    )}
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-1 space-y-0.5 border-l border-dashed border-gray-200 ml-3">
                        {node.children.map((child: any) => renderCategoryNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Breadcrumb and Banner visuals
    const bannerUrl = activeCategory?.banner || 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1600&q=80';
    const activeCategoryName = activeCategory?.name || 'Category';
    const activeCategoryDescription = activeCategory?.description || 'Browse our premium handcrafted collection';

    return (
        <div className="min-h-screen bg-gray-50/50 pb-16">
            
            {/* Banner Section */}
            <div className="relative h-64 md:h-72 w-full overflow-hidden bg-gray-900">
                <img 
                    src={bannerUrl} 
                    alt={activeCategoryName} 
                    className="h-full w-full object-cover object-center opacity-40 scale-105 transition-transform duration-700 ease-out hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 mt-8">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide uppercase drop-shadow-md mb-2 font-serif">
                        {activeCategoryName}
                    </h1>
                    <p className="text-gray-200 text-sm md:text-base max-w-xl line-clamp-2 font-light drop-shadow">
                        {activeCategoryDescription}
                    </p>
                </div>
            </div>

            {/* Breadcrumbs Row */}
            <div className="bg-white border-b border-gray-200/80 shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-thin">
                        <Link href="/" className="hover:text-[var(--color-primary)] flex items-center gap-1">
                            <FiHome size={14} />
                            <span>Home</span>
                        </Link>
                        {breadcrumbs.map((bc: any, idx: number) => {
                            const isLast = idx === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={bc._id}>
                                    <FiChevronRight size={12} className="text-gray-400 shrink-0" />
                                    {isLast ? (
                                        <span className="text-[var(--color-primary)] font-semibold shrink-0">
                                            {bc.name}
                                        </span>
                                    ) : (
                                        <Link href={`/category/${bc.slug}`} className="hover:text-[var(--color-primary)] shrink-0">
                                            {bc.name}
                                        </Link>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Product count & mobile toggle */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs md:text-sm text-gray-400 font-medium whitespace-nowrap">
                            {meta.total || 0} products found
                        </span>
                        
                        <button
                            onClick={() => setShowMobileFilter(true)}
                            className="lg:hidden flex items-center gap-1.5 text-xs md:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg px-3 py-1.5 font-medium transition-all"
                        >
                            <FiFilter size={14} className="text-[var(--color-primary)]" />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8 items-start">

                    {/* ── LEFT SIDEBAR FILTERS (Desktop Only) ── */}
                    <aside className="hidden lg:block w-72 shrink-0 sticky top-16 bg-white rounded-2xl border border-gray-200/80 shadow-md p-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
                        
                        {/* Categories Tree */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                Categories
                            </h3>
                            {categoriesLoading ? (
                                <div className="space-y-2 py-2">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="h-6 bg-gray-100 rounded-md animate-pulse w-full" />
                                    ))}
                                </div>
                            ) : categoryTree.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No categories found</p>
                            ) : (
                                <div className="space-y-1">
                                    {categoryTree.map((node: any) => renderCategoryNode(node))}
                                </div>
                            )}
                        </div>

                        {/* Price Range Filter */}
                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center justify-between">
                                <span>Filter by Price</span>
                                {(priceRange.min || priceRange.max) && (
                                    <button 
                                        onClick={clearPriceFilter} 
                                        className="text-xs text-red-500 hover:underline font-semibold"
                                    >
                                        Clear
                                    </button>
                                )}
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                                    <span>৳0</span>
                                    <span>৳{tempPriceRange.max}</span>
                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max={sliderMax}
                                    step="100"
                                    value={tempPriceRange.max}
                                    onChange={handleSliderChange}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)] focus:outline-none"
                                />

                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <label className="text-[10px] text-gray-400 uppercase font-bold">Min</label>
                                        <input
                                            type="number"
                                            value={tempPriceRange.min}
                                            onChange={(e) => setTempPriceRange(p => ({ ...p, min: Number(e.target.value) }))}
                                            className="w-full text-xs font-medium border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 focus:outline-none focus:border-[var(--color-primary)]/40"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-gray-400 uppercase font-bold">Max</label>
                                        <input
                                            type="number"
                                            value={tempPriceRange.max}
                                            onChange={(e) => setTempPriceRange(p => ({ ...p, max: Number(e.target.value) }))}
                                            className="w-full text-xs font-medium border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 focus:outline-none focus:border-[var(--color-primary)]/40"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={applyPriceFilter}
                                    className="w-full text-xs font-bold py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg shadow-sm hover:shadow transition-all duration-200"
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* ── RIGHT MAIN PRODUCT GRID ── */}
                    <div className="flex-1 min-w-0">
                        
                        {/* Filtering & Sorting Controls */}
                        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700 hidden sm:inline">Sort By:</span>
                                
                                {/* Sort Dropdown Trigger */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                                        className="flex items-center gap-2 text-xs md:text-sm text-gray-600 border border-gray-200 rounded-xl px-4 py-2 hover:border-[var(--color-primary)]/40 bg-gray-55/30 transition-all font-medium"
                                    >
                                        <span>{SORT_OPTIONS.find(s => s.value === sortBy)?.label}</span>
                                        <FiChevronDown size={14} className="text-gray-400 transition-transform duration-200" style={{ transform: showSortDropdown ? 'rotate(180deg)' : 'none' }} />
                                    </button>
                                    
                                    {showSortDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} />
                                            <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 w-52 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                                {SORT_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => {
                                                            setSortBy(opt.value);
                                                            setPage(1);
                                                            setShowSortDropdown(false);
                                                        }}
                                                        className={`w-full text-left text-xs md:text-sm px-4 py-2.5 transition-colors hover:bg-gray-50 flex items-center justify-between ${
                                                            sortBy === opt.value 
                                                                ? 'text-[var(--color-primary)] font-semibold bg-[var(--color-primary-light)]/20' 
                                                                : 'text-gray-600'
                                                        }`}
                                                    >
                                                        <span>{opt.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Active Applied Filters Summary */}
                            <div className="flex items-center gap-2">
                                {(priceRange.min || priceRange.max) && (
                                    <span className="flex items-center gap-1.5 text-xs bg-[var(--color-primary-light)] text-[var(--color-primary)] px-3 py-1.5 rounded-full font-semibold border border-[var(--color-primary-border)]/50">
                                        <span>৳{priceRange.min || 0} - ৳{priceRange.max || sliderMax}</span>
                                        <button 
                                            onClick={clearPriceFilter} 
                                            className="hover:bg-[var(--color-primary)] hover:text-white rounded-full p-0.5 transition-all"
                                        >
                                            <FiX size={12} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Grid Content */}
                        {productsLoading || (productsFetching && products.length === 0) ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                        <div className="aspect-[3/4] bg-gray-200" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                                            <div className="h-4 bg-gray-200 rounded-md w-1/2" />
                                            <div className="h-8 bg-gray-200 rounded-lg w-full mt-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-3xl border border-gray-200/80 shadow-md p-8 max-w-xl mx-auto">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500 mb-4 shadow-inner">
                                    <FiAlertCircle size={32} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 text-sm md:text-base mb-6">
                                    We couldn't find any products in <span className="font-semibold text-gray-800">"{activeCategoryName}"</span> matching your selected price filters.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                                    {(priceRange.min || priceRange.max) && (
                                        <button 
                                            onClick={clearPriceFilter} 
                                            className="w-full sm:w-auto text-xs md:text-sm font-semibold px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
                                        >
                                            Clear Price Filter
                                        </button>
                                    )}
                                    <Link 
                                        href="/products" 
                                        className="w-full sm:w-auto text-xs md:text-sm font-bold px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl shadow-sm transition-all"
                                    >
                                        Browse All Products
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-300 ${productsFetching ? 'opacity-50' : 'opacity-100'}`}>
                                {products.map((product: any) => (
                                    <ShopCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination Section */}
                        {meta.totalPage > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <button
                                    disabled={page === 1}
                                    onClick={() => {
                                        setPage(p => p - 1);
                                        window.scrollTo({ top: 180, behavior: 'smooth' });
                                    }}
                                    className="px-4 py-2.5 text-xs md:text-sm border border-gray-200 rounded-xl hover:border-[var(--color-primary)]/40 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed bg-gray-50 text-gray-600 font-medium transition-all"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: meta.totalPage }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => {
                                                setPage(pageNum);
                                                window.scrollTo({ top: 180, behavior: 'smooth' });
                                            }}
                                            className={`w-10 h-10 text-xs md:text-sm rounded-xl border transition-all font-semibold ${
                                                page === pageNum 
                                                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md shadow-[var(--color-primary)]/10' 
                                                    : 'border-gray-200 hover:border-[var(--color-primary)]/40 bg-white text-gray-600 hover:shadow-sm'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    disabled={page >= meta.totalPage}
                                    onClick={() => {
                                        setPage(p => p + 1);
                                        window.scrollTo({ top: 180, behavior: 'smooth' });
                                    }}
                                    className="px-4 py-2.5 text-xs md:text-sm border border-gray-200 rounded-xl hover:border-[var(--color-primary)]/40 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed bg-gray-50 text-gray-600 font-medium transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── MOBILE FILTER OVERLAY DRAWER ── */}
            {showMobileFilter && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
                        onClick={() => setShowMobileFilter(false)} 
                    />
                    
                    {/* Drawer Content */}
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-2xl flex flex-col justify-between transition-transform duration-300">
                        <div>
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <FiSliders size={18} className="text-[var(--color-primary)]" />
                                    <span>Filter Options</span>
                                </h3>
                                <button 
                                    onClick={() => setShowMobileFilter(false)}
                                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Categories Tree */}
                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                    Categories
                                </h4>
                                {categoriesLoading ? (
                                    <div className="space-y-2 py-2">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
                                        ))}
                                    </div>
                                ) : categoryTree.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No categories found</p>
                                ) : (
                                    <div className="space-y-1">
                                        {categoryTree.map((node: any) => renderCategoryNode(node))}
                                    </div>
                                )}
                            </div>

                            {/* Price range */}
                            <div className="border-t border-gray-100 pt-6">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                                    Price Range
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                                        <span>৳0</span>
                                        <span>৳{tempPriceRange.max}</span>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max={sliderMax}
                                        step="100"
                                        value={tempPriceRange.max}
                                        onChange={handleSliderChange}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)] focus:outline-none"
                                    />

                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] text-gray-400 uppercase font-bold">Min</label>
                                            <input
                                                type="number"
                                                value={tempPriceRange.min}
                                                onChange={(e) => setTempPriceRange(p => ({ ...p, min: Number(e.target.value) }))}
                                                className="w-full text-xs font-medium border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] text-gray-400 uppercase font-bold">Max</label>
                                            <input
                                                type="number"
                                                value={tempPriceRange.max}
                                                onChange={(e) => setTempPriceRange(p => ({ ...p, max: Number(e.target.value) }))}
                                                className="w-full text-xs font-medium border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action Buttons inside mobile drawer */}
                        <div className="border-t border-gray-100 pt-6 mt-8 space-y-2.5">
                            <button
                                onClick={applyPriceFilter}
                                className="w-full font-bold py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl shadow-md transition-all duration-200 text-sm"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={() => {
                                    clearPriceFilter();
                                    setShowMobileFilter(false);
                                }}
                                className="w-full font-semibold py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition-all duration-200 text-sm"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
