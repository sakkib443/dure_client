"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NewProductCard from '@/components/shared/NewProductCard';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';
import { useAppSelector, useAppDispatch } from '@/redux';
import { clearImageSearch, loadSearchHistoryFromStorage } from '@/redux/slices/imageSearchSlice';
import { FiX, FiCamera } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';
import HeroSection from './HeroSection';
import BengaliMarqueeBand from './BengaliMarqueeBand';
import FeaturedSections from './FeaturedSections';
import HojoboroloCollection from './HojoboroloCollection';
import BrandStory from './BrandStory';
import CtaBanner from './CtaBanner';

const LIMIT = 20;

const NewHomePage: React.FC = () => {
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');
    const [page, setPage] = useState(1);
    const [accumulatedProducts, setAccumulatedProducts] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Image search state from Redux
    const imageSearch = useAppSelector((state) => state.imageSearch);

    // Load search history from localStorage on mount
    useEffect(() => {
        dispatch(loadSearchHistoryFromStorage());
    }, [dispatch]);

    useEffect(() => {
        const cat = searchParams.get('category') || '';
        const search = searchParams.get('searchTerm') || '';
        setSelectedCategory(cat);
        setSearchTerm(search);
        setPage(1);
        setAccumulatedProducts([]);
    }, [searchParams]);

    const queryParams: Record<string, string | number | undefined> = {
        limit: LIMIT,
        page,
        sort: '-createdAt',
    };
    if (selectedCategory) queryParams.category = selectedCategory;
    if (searchTerm) queryParams.searchTerm = searchTerm;

    const { data: productsData, isLoading, isFetching } = useGetProductsQuery(queryParams);
    const { data: categoriesData } = useGetCategoriesQuery({});

    const products = productsData?.data || [];
    const meta = productsData?.meta;
    const totalPages = meta?.totalPages || 1;
    const categories = categoriesData?.data || [];

    // Accumulate products when new data arrives
    useEffect(() => {
        if (products.length > 0 && !isFetching) {
            if (page === 1) {
                setAccumulatedProducts(products);
            } else {
                setAccumulatedProducts(prev => {
                    const existingIds = new Set(prev.map((p: any) => p._id));
                    const newProducts = products.filter((p: any) => !existingIds.has(p._id));
                    return [...prev, ...newProducts];
                });
            }
            setIsLoadingMore(false);
        }
    }, [products, isFetching, page]);

    // ── Handle clearing image search — reset to normal product listing ──
    const handleClearImageSearch = () => {
        dispatch(clearImageSearch());
        setPage(1);
        if (products.length > 0) {
            setAccumulatedProducts(products);
        } else {
            setAccumulatedProducts([]);
        }
    };

    // ── Handle clearing text search ─────────────────────────────────
    const handleClearTextSearch = () => {
        setSearchTerm('');
        setPage(1);
        setAccumulatedProducts([]);
        window.history.pushState({}, '', '/');
    };

    // ── Handle category change ──────────────────────────────────────
    const handleCategoryChange = (categoryId: string) => {
        dispatch(clearImageSearch());
        // If same category (e.g. clicking "View All" when already on all), restore from cache
        if (categoryId === selectedCategory) {
            if (products.length > 0) {
                setAccumulatedProducts(products);
            }
            return;
        }
        const params = new URLSearchParams();
        if (categoryId) params.set('category', categoryId);
        window.history.pushState({}, '', `/?${params.toString()}`);
        setSelectedCategory(categoryId);
        setPage(1);
        setAccumulatedProducts([]);
    };

    // ── Handle load more ────────────────────────────────────────────
    const handleLoadMore = () => {
        if (page < totalPages) {
            setIsLoadingMore(true);
            setPage(prev => prev + 1);
        }
    };

    // ── Personalized sorting: boost products matching search history ──
    const sortByRelevance = (products: any[]) => {
        const history = imageSearch.lastSearchHistory;
        if (!history || (history.labels.length === 0 && history.colors.length === 0)) {
            return products;
        }

        return [...products].sort((a, b) => {
            const scoreA = getRelevanceScore(a, history);
            const scoreB = getRelevanceScore(b, history);
            // Higher relevance first, then keep original order
            return scoreB - scoreA;
        });
    };

    // Calculate how relevant a product is to the search history
    const getRelevanceScore = (product: any, history: { labels: string[]; colors: string[]; category: string | null; brand: string | null }) => {
        let score = 0;
        const productTags = (product.tags || []).map((t: string) => t.toLowerCase());
        const productColors = (product.colors || []).map((c: string) => c.toLowerCase());
        const productAiLabels = (product.aiLabels || []).map((l: string) => l.toLowerCase());
        const productName = (product.name || '').toLowerCase();
        const productBrand = (product.brand || '').toLowerCase();
        const productCategoryName = (product.category?.name || '').toLowerCase();

        // Match labels against tags & aiLabels
        for (const label of history.labels) {
            const lowerLabel = label.toLowerCase();
            if (productTags.some((t: string) => t.includes(lowerLabel) || lowerLabel.includes(t))) score += 10;
            if (productAiLabels.some((l: string) => l.includes(lowerLabel) || lowerLabel.includes(l))) score += 8;
            if (productName.includes(lowerLabel)) score += 5;
        }

        // Match colors
        for (const color of history.colors) {
            const lowerColor = color.toLowerCase();
            if (productColors.some((c: string) => c.includes(lowerColor) || lowerColor.includes(c))) score += 7;
        }

        // Match category
        if (history.category && productCategoryName.includes(history.category.toLowerCase())) {
            score += 15;
        }

        // Match brand
        if (history.brand && productBrand.includes(history.brand.toLowerCase())) {
            score += 12;
        }

        return score;
    };

    // ── Determine which products to display ─────────────────────────
    const displayProducts = useMemo(() => {
        if (imageSearch.isActive && imageSearch.products.length > 0) {
            return imageSearch.products;
        }
        // Use accumulated products, or fall back to current API products if accumulated is empty
        const productsToShow = accumulatedProducts.length > 0 ? accumulatedProducts : products;
        // Apply silent personalized sorting based on search history
        return sortByRelevance(productsToShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageSearch.isActive, imageSearch.products, accumulatedProducts, products, imageSearch.lastSearchHistory]);

    // Get the selected category name
    const selectedCategoryName = useMemo(() => {
        if (!selectedCategory) return '';
        const cat = categories.find((c: any) => c._id === selectedCategory);
        return cat?.name || '';
    }, [selectedCategory, categories]);

    // ── Loading skeleton ────────────────────────────────────────────
    if (isLoading && !imageSearch.isActive) {
        return (
            <div className="min-h-screen bg-[var(--color-background)]">
                <div className="w-[95%] mx-auto py-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-[#dcd7c8]/40 border border-[#c1bcae]/40 rounded-md overflow-hidden animate-pulse">
                                <div className="aspect-square bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Hero Banner */}
            <HeroSection />

            {/* Bengali Marquee Band */}
            <BengaliMarqueeBand />

            {/* Category Showcase */}
            <FeaturedSections />

            {/* Best Products Collection */}
            <HojoboroloCollection />

            {/* Brand Story Section */}
            <BrandStory />


            {/* ── Search / Filter results (only shown when active) ── */}
            {(imageSearch.isActive || imageSearch.isSearching || searchTerm || selectedCategory) && (
                <div className="container mx-auto px-4 py-8">

                    {/* Image search loading */}
                    {imageSearch.isSearching && (
                        <div className="mb-6 bg-white border border-[#d4c4b0] rounded p-8 text-center shadow-sm">
                            <div className="w-12 h-12 border-4 border-[#d4c4b0] border-t-[#800000] rounded-full animate-spin mx-auto mb-4" />
                            <p className="font-bangla font-semibold text-gray-700">
                                ছবি বিশ্লেষণ করা হচ্ছে...
                            </p>
                        </div>
                    )}

                    {/* Image search results */}
                    {imageSearch.isActive && (
                        <div className="mb-6 bg-[#faf6f0] border border-[#d4c4b0] rounded p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <FiCamera className="text-[#800000]" size={18} />
                                    <div>
                                        <p className="font-bangla font-bold text-gray-800">
                                            ছবি অনুযায়ী ফলাফল
                                        </p>
                                        <p className="text-xs text-gray-500">{imageSearch.products.length}টি পণ্য পাওয়া গেছে</p>
                                    </div>
                                </div>
                                <button onClick={handleClearImageSearch} className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors">
                                    <FiX size={13} /> বাতিল
                                </button>
                            </div>
                            {(imageSearch.searchMeta?.colors?.length ?? 0) > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    {imageSearch.searchMeta!.colors.map((c: any, i: number) => (
                                        <div key={i} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1">
                                            <div className="w-3 h-3 rounded-full border border-gray-200" style={{ background: c.hex }} />
                                            <span className="text-xs text-gray-600">{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text search */}
                    {searchTerm && !imageSearch.isActive && (
                        <div className="mb-6 bg-[#faf6f0] border border-[#d4c4b0] rounded p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FiSearch className="text-[#800000]" size={18} />
                                <div>
                                    <p className="font-bangla font-bold text-gray-800">
                                        &quot;<span className="text-[#800000]">{searchTerm}</span>&quot; — {meta?.total || displayProducts.length}টি পণ্য
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleClearTextSearch} className="text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                                <FiX size={13} /> বাতিল
                            </button>
                        </div>
                    )}

                    {/* Category title */}
                    {selectedCategory && (
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-display text-2xl font-bold text-[#5F0000]">
                                    {selectedCategoryName || 'পণ্য সংগ্রহ'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">এই ক্যাটাগরির সব পণ্য দেখানো হচ্ছে</p>
                            </div>
                            <button onClick={() => handleCategoryChange('')} className="text-sm text-[#800000] hover:underline">
                                সব পণ্য দেখুন
                            </button>
                        </div>
                    )}

                    {/* Product grid for search/filter results */}
                    {displayProducts.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {displayProducts.map((p: any) => <NewProductCard key={p._id || p.id} product={p} />)}
                        </div>
                    )}
                </div>
            )}


            {/* CTA Banner */}
            <CtaBanner />
        </div>
    );
};

export default NewHomePage;
