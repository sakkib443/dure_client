"use client";

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';
import { useGetProductsQuery } from '@/redux/api/productApi';
import ShopCard from '@/components/shared/ShopCard';
import { FiChevronRight, FiChevronDown, FiGrid } from 'react-icons/fi';

const LIMIT = 40;

const HIGHLIGHTS = [
    { emoji: '🧶', title: 'হাতে তৈরি',       desc: 'দক্ষ কারিগরদের নিপুণ হাতে যত্নসহকারে তৈরি' },
    { emoji: '🌿', title: 'সেরা উপকরণ',      desc: 'মানসম্পন্ন ও টেকসই উপাদানের নিশ্চয়তা' },
    { emoji: '🏆', title: 'ঐতিহ্যবাহী',      desc: 'বাংলার সমৃদ্ধ ঐতিহ্যের ছোঁয়া প্রতিটি পণ্যে' },
    { emoji: '🚚', title: 'নিরাপদ ডেলিভারি', desc: 'যত্নসহকারে প্যাকিং করে দ্রুত পৌঁছে দেওয়া' },
];

export default function CategoryPage() {
    const { slug } = useParams();
    const currentSlug = slug as string;

    const [showCatDropdown, setShowCatDropdown] = useState(false);

    const { data: catData } = useGetCategoriesQuery({});
    const categories: any[] = useMemo(
        () => catData?.data || catData?.categories || [],
        [catData]
    );

    const activeCategory = useMemo(
        () => categories.find((c: any) => c.slug === currentSlug),
        [categories, currentSlug]
    );

    // Walk up to the ancestry path (root → … → active) for breadcrumbs.
    const breadcrumbs = useMemo(() => {
        if (!activeCategory || categories.length === 0) return [];
        const path = [activeCategory];
        let current = activeCategory;
        while (current?.parent) {
            const parentId = typeof current.parent === 'object' ? current.parent._id : current.parent;
            const parent = categories.find((c: any) => c._id === parentId);
            if (!parent) break;
            path.unshift(parent);
            current = parent;
        }
        return path;
    }, [activeCategory, categories]);

    // The top-level section this category belongs to. The dropdown only ever
    // shows this root + its subcategories — never sibling roots (e.g. while in
    // জামদানি you never see জামা / অলংকার).
    const rootCategory = breadcrumbs[0] || activeCategory;

    const dropdownRoot = useMemo(() => {
        if (!rootCategory) return null;
        return {
            ...rootCategory,
            children: categories.filter((c: any) => {
                const parentId = typeof c.parent === 'object' ? c.parent?._id : c.parent;
                return String(parentId) === String(rootCategory._id);
            }),
        };
    }, [categories, rootCategory]);

    const { data: productsData, isLoading } = useGetProductsQuery(
        { category: currentSlug, limit: LIMIT, sort: '-createdAt' },
        { skip: !currentSlug }
    );
    const products: any[] = productsData?.data || [];

    const normalised = useMemo(
        () => products.map((p: any) => ({
            id:            p._id,
            _id:           p._id,
            slug:          p.slug,
            name:          p.name,
            image:         p.thumbnail,
            price:         p.price,
            originalPrice: p.originalPrice,
            discount:      p.discount,
            rating:        p.rating,
            reviews:       p.reviewCount,
            priceType:     p.priceType,
            totalSold:     p.totalSold,
            categoryName:  p.category?.name,
        })),
        [products]
    );

    const heroTitle = activeCategory?.name || 'সংগ্রহ';
    const heroDesc = activeCategory?.description
        || 'বাংলার সমৃদ্ধ ঐতিহ্য থেকে দক্ষ কারিগরদের হাতে তৈরি সেরা পণ্যের সংগ্রহ আবিষ্কার করুন।';
    const CATEGORY_HERO_IMAGES: Record<string, string> = {
        jamdani:   'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80',
        ornaments: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
        jama:      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    };
    const heroImage = activeCategory?.banner || activeCategory?.image
        || CATEGORY_HERO_IMAGES[rootCategory?.slug ?? '']
        || 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1600&q=80';

    return (
        <div className="min-h-screen" style={{ background: '#F5EDE0' }}>

            {/* ══ HERO ══ */}
            <section className="relative overflow-hidden" style={{ padding: '44px 0 40px' }}>
                <img src={heroImage} alt={heroTitle} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(45,16,8,0.80), rgba(45,16,8,0.92))' }} />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="flex items-center justify-center gap-1.5 mb-5 flex-wrap">
                        <Link href="/" className="font-bangla text-xs" style={{ color: '#C9A22780' }}>হোম</Link>
                        {breadcrumbs.map((bc: any, idx: number) => {
                            const isLast = idx === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={bc._id}>
                                    <FiChevronRight size={11} style={{ color: '#C9A22760' }} />
                                    {isLast ? (
                                        <span className="font-bangla text-xs" style={{ color: '#C9A227CC' }}>{bc.name}</span>
                                    ) : (
                                        <Link href={`/category/${bc.slug}`} className="font-bangla text-xs" style={{ color: '#C9A22780' }}>{bc.name}</Link>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                    <span className="font-bangla inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider" style={{ background: 'rgba(201,162,39,0.15)', color: '#C9A227' }}>
                        ঐতিহ্যের সংগ্রহ
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ color: '#FDF6EC' }}>
                        {heroTitle}
                    </h1>
                    <p className="font-bangla text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ color: '#FDF6EC80' }}>
                        {heroDesc}
                    </p>
                </div>
            </section>

            {/* ══ HIGHLIGHTS ══ */}
            <section className="bg-jamdani-motif" style={{ borderBottom: '1px solid #e5ddd0' }}>
                <div className="container mx-auto px-4 py-7">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {HIGHLIGHTS.map(({ emoji, title, desc }) => (
                            <div key={title}>
                                <span className="text-2xl block mb-1">{emoji}</span>
                                <p className="font-bangla text-xs font-bold" style={{ color: '#2D1008' }}>{title}</p>
                                <p className="font-bangla text-[11px] mt-0.5 leading-relaxed" style={{ color: '#8a7560' }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ PRODUCTS GRID ══ */}
            <section className="container mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="font-display text-xl font-black" style={{ color: '#2D1008' }}>
                            {heroTitle}
                        </h2>
                        {!isLoading && <p className="font-bangla text-xs mt-0.5" style={{ color: '#8a7560' }}>{normalised.length}টি পণ্য পাওয়া গেছে</p>}
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowCatDropdown(v => !v)}
                            className="font-bangla flex items-center gap-1.5 text-sm font-semibold hover:underline transition-colors"
                            style={{ color: '#6B0F1A' }}
                        >
                            <FiGrid size={14} /> সব ক্যাটাগরি দেখুন
                            <FiChevronDown size={14} style={{ transform: showCatDropdown ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                        </button>

                        {showCatDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowCatDropdown(false)} />
                                <div
                                    className="absolute right-0 mt-2 w-64 max-h-[70vh] overflow-y-auto rounded-xl shadow-xl z-50 py-2"
                                    style={{ background: '#FDF6EC', border: '1px solid #e5ddd0' }}
                                >
                                    {dropdownRoot && (
                                        <div key={dropdownRoot._id} className="px-2 py-1">
                                            <Link
                                                href={`/category/${dropdownRoot.slug}`}
                                                onClick={() => setShowCatDropdown(false)}
                                                className="font-bangla block px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                                                style={currentSlug === dropdownRoot.slug
                                                    ? { background: '#6B0F1A', color: '#FDF6EC' }
                                                    : { color: '#2D1008' }}
                                            >
                                                সব {dropdownRoot.name}
                                            </Link>
                                            {dropdownRoot.children.length > 0 && (
                                                <div className="mt-0.5 ml-2 border-l border-dashed" style={{ borderColor: '#d4c9b8' }}>
                                                    {dropdownRoot.children.map((child: any) => (
                                                        <Link
                                                            key={child._id}
                                                            href={`/category/${child.slug}`}
                                                            onClick={() => setShowCatDropdown(false)}
                                                            className="font-bangla block pl-4 pr-3 py-1.5 text-[13px] rounded-md transition-colors hover:underline"
                                                            style={currentSlug === child.slug
                                                                ? { color: '#6B0F1A', fontWeight: 700 }
                                                                : { color: '#5a3e2b' }}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {isLoading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-gray-200 rounded" style={{ borderRadius: 3 }} />
                                <div className="pt-3 space-y-2"><div className="h-2.5 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/3" /></div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && normalised.length === 0 && (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">🧶</span>
                        <h3 className="font-bangla text-lg font-bold mb-2" style={{ color: '#2D1008' }}>কোনো পণ্য পাওয়া যায়নি</h3>
                        <p className="font-bangla text-sm mb-6" style={{ color: '#8a7560' }}>আমরা শীঘ্রই আরও পণ্য যোগ করছি — পরে আবার দেখুন!</p>
                        <Link href="/products" className="font-bangla inline-block px-6 py-2.5 rounded-lg text-sm font-bold" style={{ background: '#6B0F1A', color: '#FDF6EC' }}>সব পণ্য ঘুরে দেখুন</Link>
                    </div>
                )}

                {!isLoading && normalised.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {normalised.map((product) => <ShopCard key={product.id} product={product} />)}
                    </div>
                )}
            </section>

            {/* ══ BOTTOM CTA ══ */}
            <section className="bg-jamdani-motif py-12" style={{ borderTop: '1px solid #e5ddd0' }}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display text-2xl font-black mb-2" style={{ color: '#2D1008' }}>বিশেষ কিছু খুঁজছেন?</h2>
                    <p className="font-bangla text-sm mb-6 max-w-md mx-auto" style={{ color: '#8a7560' }}>
                        নিখুঁত পণ্য খুঁজে পাচ্ছেন না? আমাদের সাথে যোগাযোগ করুন, আমাদের বিশেষজ্ঞরা আপনাকে সাহায্য করবেন।
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <Link href="/contact" className="font-bangla px-6 py-3 text-sm font-bold rounded-lg" style={{ background: '#6B0F1A', color: '#FDF6EC' }}>বিশেষজ্ঞের সাথে কথা বলুন</Link>
                        <Link href="/products" className="font-bangla px-6 py-3 text-sm font-bold rounded-lg" style={{ border: '1.5px solid #d4c9b8', color: '#5a3e2b' }}>সব পণ্য ঘুরে দেখুন</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
