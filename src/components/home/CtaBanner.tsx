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
                className="w-full relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1a0808 0%, #800000 45%, #5F0000 100%)', padding: '72px 0' }}
            >
                {/* Background dot grid */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #C9A227 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
                     style={{ background: 'radial-gradient(circle, #C9A227, transparent)' }} />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10 pointer-events-none"
                     style={{ background: 'radial-gradient(circle, #C9A227, transparent)' }} />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Bengali ornament */}
                        <p className="text-[#C9A227] text-2xl mb-4 select-none">◈ ◆ ◈</p>

                        <h2
                            className="font-display text-white font-bold mb-3"
                            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', lineHeight: 1.25 }}
                        >
                            আজই শুরু করুন আপনার<br />
                            <span style={{ color: '#C9A227' }}>জামদানির যাত্রা</span>
                        </h2>

                        <p
                            className="font-bangla text-white/70 mb-8 max-w-lg mx-auto"
                            style={{ fontSize: '1.1rem', lineHeight: 1.9 }}
                        >
                            বাংলার শ্রেষ্ঠ জামদানি শাড়ি, মিমিক্রি, অলংকার আর ঐতিহ্যবাহী পোশাকের সংগ্রহ
                            এখন আপনার হাতের কাছেই।
                        </p>

                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <Link
                                href="/products"
                                className="font-bangla-round inline-block bg-[#C9A227] hover:bg-[#a8841e] text-[#1a0808] font-bold px-10 py-3.5 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 text-base"
                                style={{ borderRadius: 2 }}
                            >
                                সব পণ্য দেখুন
                            </Link>
                            <Link
                                href="/register"
                                className="font-bangla-round inline-block border border-white/40 hover:border-white text-white hover:bg-white/10 font-bold px-10 py-3.5 transition-all duration-300 text-base"
                                style={{ borderRadius: 2 }}
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
