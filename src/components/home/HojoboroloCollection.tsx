"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import toast from 'react-hot-toast';
import { FiShoppingCart } from 'react-icons/fi';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' as const },
    }),
};

export default function HomeProductCollection() {
    const { data, isLoading } = useGetProductsQuery({ limit: 8, sort: '-createdAt' });
    const products: any[] = useMemo(() => data?.data || [], [data]);
    const dispatch = useAppDispatch();

    const handleAddToCart = (p: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: p._id,
            productId: p._id,
            name: p.name,
            price: p.price,
            mrp: p.originalPrice || p.price,
            image: p.thumbnail,
            category: p.category?.name || '',
        }));
        toast.success(
            <div>
                <p className="font-semibold text-sm">কার্টে যোগ হয়েছে!</p>
                <p className="text-xs text-gray-400">{p.name}</p>
            </div>,
            { duration: 2500 }
        );
    };

    return (
        <section className="w-full py-14" style={{ background: '#fff' }}>
            <div className="container mx-auto px-4">

                {/* ── Heading ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="flex items-end justify-between mb-8 gap-4"
                >
                    <div>
                        {/* Decorative */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className="block w-10 h-px bg-[#C9A227]" />
                            <span className="text-[#C9A227] text-sm">◆</span>
                        </div>
                        <h2
                            className="font-display text-[#5F0000] font-bold"
                            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.2 }}
                        >
                            সেরা পণ্য সংগ্রহ
                        </h2>
                        <p className="font-bangla text-gray-600 mt-1" style={{ fontSize: '0.95rem' }}>
                            হাতে বাছাই করা সেরা পণ্যগুলো
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="font-bangla-round shrink-0 text-sm font-semibold border border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white px-5 py-2.5 transition-all duration-300"
                        style={{ borderRadius: 2 }}
                    >
                        সব পণ্য →
                    </Link>
                </motion.div>

                {/* ── Divider ── */}
                <div className="relative mb-8">
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                        <div className="w-full h-px bg-[#e8ddd3]" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-[#C9A227] text-xl">✿</span>
                    </div>
                </div>

                {/* ── Skeleton ── */}
                {isLoading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-gray-200 rounded" />
                                <div className="h-3 bg-gray-200 rounded mt-3 w-3/4" />
                                <div className="h-3 bg-gray-200 rounded mt-2 w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Products ── */}
                {!isLoading && products.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {products.map((p, i) => (
                            <motion.div
                                key={p._id}
                                custom={i}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                variants={fadeUp}
                            >
                                <ProductCard product={p} onAddToCart={handleAddToCart} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {!isLoading && products.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <p className="font-bangla" style={{ fontSize: '1.1rem' }}>
                            এখনও কোনো পণ্য যোগ করা হয়নি
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

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
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl"
                         style={{ background: 'linear-gradient(135deg, #f5efe6, #e8ddd3)' }}>
                        🧶
                    </div>
                )}

                {/* Discount badge */}
                {discountPct > 0 && (
                    <span className="absolute top-2 left-2 bg-[#800000] text-white text-[10px] font-bold px-2 py-0.5"
                          style={{ fontFamily: "'Poppins', sans-serif" }}>
                        -{discountPct}%
                    </span>
                )}

                {/* Add to cart hover button */}
                <button
                    onClick={(e) => onAddToCart(p, e)}
                    className="font-bangla-round absolute bottom-0 left-0 right-0 bg-[#1a0808]/85 text-[#fde8a8] text-sm font-semibold py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                >
                    <FiShoppingCart size={14} />
                    কার্টে যোগ করুন
                </button>
            </div>

            {/* Info */}
            <div className="pt-3 pb-1">
                <h3
                    className="font-bangla text-gray-800 font-medium leading-snug mb-1 line-clamp-2 group-hover:text-[#800000] transition-colors"
                    style={{ fontSize: '0.98rem' }}
                >
                    {p.name}
                </h3>

                <div className="flex items-center gap-2">
                    <span className="font-bold text-[#800000]" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.85rem' }}>
                        ৳{p.price?.toLocaleString('bn-BD')}
                    </span>
                    {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-gray-400 line-through text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            ৳{p.originalPrice?.toLocaleString('bn-BD')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
