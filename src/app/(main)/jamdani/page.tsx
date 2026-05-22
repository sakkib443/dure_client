"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGetProductsQuery }    from '@/redux/api/productApi';
import { useGetCategoriesQuery }  from '@/redux/api/categoryApi';
import NewProductCard             from '@/components/shared/NewProductCard';
import { FiChevronRight } from 'react-icons/fi';

const JAMDANI_KEYWORDS = ['jamdani', 'জামদানি'];

const HIGHLIGHTS = [
    { emoji: '🧶', title: 'হাতে বোনা',       desc: 'ঐতিহ্যবাহী গর্তের তাঁতে দক্ষ কারিগরদের হাতে তৈরি' },
    { emoji: '🌿', title: 'প্রাকৃতিক কাপড়',  desc: 'খাঁটি সুতি ও সিল্কের মিশ্রণ, ত্বকে নরম ও আরামদায়ক' },
    { emoji: '🏆', title: 'ইউনেস্কো ঐতিহ্য', desc: 'অদৃশ্য সাংস্কৃতিক ঐতিহ্য হিসেবে স্বীকৃত' },
    { emoji: '🚚', title: 'নিরাপদ ডেলিভারি', desc: 'ভাঁজমুক্ত অবস্থায় পৌঁছানোর জন্য যত্নসহকারে প্যাকিং' },
];

export default function JamdaniPage() {
    const [selectedSub, setSelectedSub] = useState<string>('');

    const { data: catData } = useGetCategoriesQuery({});
    const allCats: any[] = catData?.data || [];

    const jamdaniParent = useMemo(
        () => allCats.find((c: any) =>
            JAMDANI_KEYWORDS.some(k => c.name?.toLowerCase().includes(k) || c.slug?.toLowerCase().includes(k))
        ),
        [allCats]
    );

    const jamdaniSubs = useMemo(
        () => allCats.filter((c: any) =>
            jamdaniParent && String(c.parent) === String(jamdaniParent._id)
        ),
        [allCats, jamdaniParent]
    );

    const relevantIds: string[] = useMemo(() => {
        const ids: string[] = [];
        if (jamdaniParent) ids.push(jamdaniParent._id);
        jamdaniSubs.forEach((s: any) => ids.push(s._id));
        return ids;
    }, [jamdaniParent, jamdaniSubs]);

    const activeCategoryId = selectedSub || (jamdaniSubs[0]?._id ?? jamdaniParent?._id ?? '');

    const { data: productsData, isLoading } = useGetProductsQuery(
        { category: activeCategoryId, limit: 40, sort: '-createdAt' },
        { skip: !activeCategoryId }
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

    return (
        <div className="min-h-screen" style={{ background: '#F5EDE0' }}>

            {/* ══ HERO ══ */}
            <section className="bg-jamdani-dark relative overflow-hidden" style={{ padding: '72px 0 64px' }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full" style={{ background: 'rgba(201,162,39,0.15)' }} />
                    <div className="absolute bottom-[-70px] left-[5%] w-56 h-56 rounded-full" style={{ background: 'rgba(201,162,39,0.1)' }} />
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="flex items-center justify-center gap-1.5 mb-5">
                        <Link href="/" className="font-bangla text-xs" style={{ color: '#C9A22780' }}>হোম</Link>
                        <FiChevronRight size={11} style={{ color: '#C9A22760' }} />
                        <span className="font-bangla text-xs" style={{ color: '#C9A227CC' }}>জামদানি</span>
                    </div>
                    <span className="font-bangla inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider" style={{ background: 'rgba(201,162,39,0.15)', color: '#C9A227' }}>
                        ঐতিহ্যের সংগ্রহ
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ color: '#FDF6EC' }}>
                        জামদানি শাড়ি সংগ্রহ
                    </h1>
                    <p className="font-bangla text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8" style={{ color: '#FDF6EC80' }}>
                        বাংলাদেশের সবচেয়ে মূল্যবান টেক্সটাইল আবিষ্কার করুন — ২,০০০ বছরের পুরনো ঐতিহ্য অনুসরণ করে দক্ষ কারিগরদের হাতে বোনা জামদানি শাড়ি।
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        {[{ emoji: '⭐', text: 'হাতে বোনা' }, { emoji: '🌿', text: 'প্রাকৃতিক কাপড়' }, { emoji: '🏆', text: 'ইউনেস্কো ঐতিহ্য' }].map(b => (
                            <div key={b.text} className="font-bangla flex items-center gap-1.5 text-xs px-4 py-2 rounded-full" style={{ background: 'rgba(201,162,39,0.12)', color: '#C9A227CC' }}>
                                <span>{b.emoji}</span> {b.text}
                            </div>
                        ))}
                    </div>
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

            {/* ══ SUBCATEGORY TABS ══ */}
            {jamdaniSubs.length > 0 && (
                <section className="sticky top-16 z-30 shadow-sm" style={{ background: '#FDF6EC', borderBottom: '1px solid #e5ddd0' }}>
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
                            <button onClick={() => setSelectedSub('')}
                                className="font-bangla shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                                style={!selectedSub ? { background: '#6B0F1A', color: '#FDF6EC' } : { background: '#F5EDE0', color: '#5a3e2b' }}>
                                সব জামদানি
                            </button>
                            {jamdaniSubs.map((sub: any) => (
                                <button key={sub._id} onClick={() => setSelectedSub(sub._id)}
                                    className="font-bangla shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                                    style={selectedSub === sub._id ? { background: '#6B0F1A', color: '#FDF6EC' } : { background: '#F5EDE0', color: '#5a3e2b' }}>
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══ PRODUCTS GRID ══ */}
            <section className="container mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="font-display text-xl font-black" style={{ color: '#2D1008' }}>
                            {selectedSub ? jamdaniSubs.find((s: any) => s._id === selectedSub)?.name ?? 'জামদানি' : 'সব জামদানি শাড়ি'}
                        </h2>
                        {!isLoading && <p className="font-bangla text-xs mt-0.5" style={{ color: '#8a7560' }}>{normalised.length}টি পণ্য পাওয়া গেছে</p>}
                    </div>
                    <Link href="/products" className="font-bangla text-xs font-semibold hover:underline" style={{ color: '#6B0F1A' }}>সব পণ্য দেখুন →</Link>
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
                        <p className="font-bangla text-sm mb-6" style={{ color: '#8a7560' }}>আমরা শীঘ্রই আরও শাড়ি যোগ করছি — পরে আবার দেখুন!</p>
                        <Link href="/products" className="font-bangla inline-block px-6 py-2.5 rounded-lg text-sm font-bold" style={{ background: '#6B0F1A', color: '#FDF6EC' }}>সব পণ্য ঘুরে দেখুন</Link>
                    </div>
                )}

                {!isLoading && normalised.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {normalised.map((product) => <NewProductCard key={product.id} product={product} />)}
                    </div>
                )}
            </section>

            {/* ══ BOTTOM CTA ══ */}
            <section className="bg-jamdani-motif py-12" style={{ borderTop: '1px solid #e5ddd0' }}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display text-2xl font-black mb-2" style={{ color: '#2D1008' }}>বিশেষ কিছু খুঁজছেন?</h2>
                    <p className="font-bangla text-sm mb-6 max-w-md mx-auto" style={{ color: '#8a7560' }}>
                        নিখুঁত শাড়ি খুঁজে পাচ্ছেন না? আমাদের সাথে যোগাযোগ করুন, আমাদের বিশেষজ্ঞরা আপনাকে সাহায্য করবেন।
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
