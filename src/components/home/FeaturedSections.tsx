"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CATEGORIES = [
    {
        name: 'জামদানি শাড়ি',
        nameEn: 'Jamdani Saree',
        href: '/jamdani',
        image: '/cat-jamdani.png',
        desc: 'ঢাকাই হাতে বোনা ঐতিহ্যবাহী শাড়ি',
    },
    {
        name: 'মেয়েদের ড্রেস',
        nameEn: "Women's Dress",
        href: '/category/womens-dress',
        image: '/cat-dress.png',
        desc: 'সালোয়ার কামিজ • কুর্তি • থ্রি-পিস',
    },
    {
        name: 'অলংকার',
        nameEn: 'Ornaments',
        href: '/category/ornaments',
        image: '/cat-ornaments.png',
        desc: 'হাতে তৈরি গহনা ও অলংকার',
    },
    {
        name: 'মিমিক্রি',
        nameEn: 'Mimicry',
        href: '/category/mimicry',
        image: '/cat-mimicry.png',
        desc: 'সুতি ও জর্জেট মিমিক্রি ড্রেস',
    },
    {
        name: 'লেহেঙ্গা',
        nameEn: 'Lehenga',
        href: '/category/lehenga',
        image: '/cat-lehenga.png',
        desc: 'ব্রাইডাল ও পার্টি লেহেঙ্গা',
    },
];

const GRID_HEIGHT = 580; // px — both left & right columns always this tall
const CARD_GAP    = 16;  // px — same as gap-4

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function FeaturedSections() {
    return (
        <section className="w-full py-16 bg-jamdani-motif">
            <div className="container mx-auto px-4">

                {/* ── Section heading ── */}
                <motion.div
                    initial="hidden" whileInView="show" viewport={{ once: true }}
                    variants={fadeUp}
                    className="flex flex-col items-center text-center mb-10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <span className="block w-16 h-px bg-[#C9A227]" />
                        <span className="text-[#C9A227] text-lg">◆</span>
                        <span className="block w-16 h-px bg-[#C9A227]" />
                    </div>
                    <h2
                        className="font-display text-[#5F0000] font-bold mb-2"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', lineHeight: 1.2 }}
                    >
                        আমাদের সংগ্রহ
                    </h2>
                    <p className="font-bangla text-gray-600" style={{ fontSize: '1.05rem' }}>
                        বাংলার ঐতিহ্যবাহী পোশাক ও অলংকারের সেরা সংগ্রহ
                    </p>
                </motion.div>

                {/* ── Category grid ──
                    On desktop: left col = 1/3 width, right col = 2/3 width.
                    Both sides share the same GRID_HEIGHT so heights are always identical.
                    Right side is split into 2 rows × 2 cols; each small card = (GRID_HEIGHT - gap) / 2.
                ── */}
                <div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                    style={{ height: GRID_HEIGHT }}
                >
                    {/* ── LEFT: full-height tall card ── */}
                    <motion.div
                        initial="hidden" whileInView="show" viewport={{ once: true }}
                        variants={fadeUp}
                        style={{ height: GRID_HEIGHT }}
                    >
                        <CategoryCard cat={CATEGORIES[0]} cardHeight={GRID_HEIGHT} tall />
                    </motion.div>

                    {/* ── RIGHT: 2 × 2 grid ── */}
                    <div
                        className="lg:col-span-2 grid grid-cols-2 gap-4"
                        style={{ height: GRID_HEIGHT }}
                    >
                        {CATEGORIES.slice(1).map((cat, i) => {
                            const cardH = (GRID_HEIGHT - CARD_GAP) / 2;
                            return (
                                <motion.div
                                    key={cat.href}
                                    initial="hidden" whileInView="show" viewport={{ once: true }}
                                    variants={{
                                        ...fadeUp,
                                        show: { ...fadeUp.show, transition: { ...fadeUp.show.transition, delay: i * 0.08 } },
                                    }}
                                    style={{ height: cardH }}
                                >
                                    <CategoryCard cat={cat} cardHeight={cardH} />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}

function CategoryCard({
    cat,
    tall,
    cardHeight,
}: {
    cat: (typeof CATEGORIES)[0];
    tall?: boolean;
    cardHeight: number;
}) {
    return (
        <Link
            href={cat.href}
            className="relative group block overflow-hidden shadow-md w-full"
            style={{ borderRadius: 4, height: cardHeight }}
        >
            {/* Image — absolutely positioned to always fill the card */}
            <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark gradient overlay from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0808]/85 via-[#1a0808]/20 to-transparent" />

            {/* Gold accent line on hover */}
            <div className="absolute top-0 left-0 w-0 h-0.5 bg-[#C9A227] transition-all duration-500 group-hover:w-full" />

            {/* Text content pinned to bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <p
                    className="text-[#C9A227] text-[11px] font-medium uppercase tracking-widest mb-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    {cat.nameEn}
                </p>
                <h3
                    className="font-display text-white font-bold mb-1"
                    style={{ fontSize: tall ? '2.1rem' : '1.4rem', lineHeight: 1.2 }}
                >
                    {cat.name}
                </h3>
                <p className="font-bangla text-white/70" style={{ fontSize: '0.88rem' }}>
                    {cat.desc}
                </p>
                <span className="font-bangla-round mt-3 inline-flex items-center gap-1.5 text-[#C9A227] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    দেখুন →
                </span>
            </div>
        </Link>
    );
}
