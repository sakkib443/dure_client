"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FEATURES = [
    { emoji: '🚚', label: 'দ্রুত ডেলিভারি',       sub: 'সারা বাংলাদেশে' },
    { emoji: '🔒', label: 'নিরাপদ পেমেন্ট',        sub: 'বিকাশ • নগদ • ক্যাশ' },
    { emoji: '🔄', label: 'সহজ রিটার্ন',            sub: '৭ দিনের মধ্যে' },
    { emoji: '📞', label: '২৪/৭ সাপোর্ট',           sub: 'যেকোনো সমস্যায়' },
];

export default function CtaBanner() {
    return (
        <>
            {/* ── Feature strip ── */}
            <section className="w-full border-t border-b border-[#d4c4b0]" style={{ background: '#faf6f0' }}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#d4c4b0]">
                        {FEATURES.map(({ emoji, label, sub }) => (
                            <div key={label} className="flex items-center gap-3 px-6 py-5">
                                <span className="text-2xl flex-shrink-0">{emoji}</span>
                                <div>
                                    <p className="font-bangla-round font-semibold text-[#3d1a1a] text-[15px] leading-tight">
                                        {label}
                                    </p>
                                    <p className="font-bangla text-gray-500 text-xs mt-0.5">
                                        {sub}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Main CTA ── */}
            <section
                className="w-full bg-jamdani-motif"
                style={{ padding: '40px 0', marginTop: '32px' }}
            >
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2
                            className="font-display font-bold mb-2"
                            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 1.3, color: '#2D1008' }}
                        >
                            আজই শুরু করুন আপনার <span style={{ color: '#6B0F1A' }}>জামদানির যাত্রা</span>
                        </h2>

                        <p className="font-bangla mb-6 max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#8a7560' }}>
                            বাংলার শ্রেষ্ঠ জামদানি শাড়ি, অলংকার আর ঐতিহ্যবাহী পোশাকের সংগ্রহ এখন আপনার হাতের কাছেই।
                        </p>

                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <Link
                                href="/products"
                                className="font-bangla inline-block font-bold px-8 py-2.5 text-sm transition-all duration-200"
                                style={{ background: '#6B0F1A', color: '#FDF6EC', borderRadius: 4 }}
                            >
                                সব পণ্য দেখুন
                            </Link>
                            <Link
                                href="/register"
                                className="font-bangla inline-block font-bold px-8 py-2.5 text-sm transition-all duration-200"
                                style={{ border: '1.5px solid #d4c9b8', color: '#5a3e2b', borderRadius: 4 }}
                            >
                                বিনামূল্যে নিবন্ধন করুন
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
