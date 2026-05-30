"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGetProductsQuery } from '@/redux/api/productApi';
import ShopCard from '@/components/shared/ShopCard';

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

    return (
        <section className="w-full py-14" style={{ background: '#fff' }}>
            <div className="container mx-auto px-4">

                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="block w-10 h-px bg-[#C9A227]" />
                        <span className="text-[#C9A227] text-sm">◆</span>
                        <span className="block w-10 h-px bg-[#C9A227]" />
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
                </motion.div>

                <div className="relative mb-8">
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                        <div className="w-full h-px bg-[#e8ddd3]" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-[#C9A227] text-xl">✿</span>
                    </div>
                </div>

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
                                <ShopCard product={p} />
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
