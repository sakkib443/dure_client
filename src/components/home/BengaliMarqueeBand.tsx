"use client";

import React from 'react';
import Link from 'next/link';

const ITEMS = [
    { label: 'জামদানি শাড়ি', href: '/jamdani',            emoji: '🌸' },
    { label: 'মিমিক্রি',      href: '/category/mimicry',   emoji: '✨' },
    { label: 'অলংকার',        href: '/category/ornaments', emoji: '💎' },
    { label: 'মেয়েদের ড্রেস', href: '/category/womens-dress', emoji: '👗' },
    { label: 'লেহেঙ্গা',       href: '/category/lehenga',   emoji: '👑' },
    { label: 'ঢাকাই জামদানি', href: '/category/dhakai-jamdani', emoji: '🧵' },
    { label: 'সালোয়ার কামিজ', href: '/category/salwar-kameez', emoji: '🌺' },
    { label: 'কুর্তি',         href: '/category/kurti',     emoji: '🌿' },
];

// double for seamless loop
const ALL = [...ITEMS, ...ITEMS, ...ITEMS];

export default function BengaliMarqueeBand() {
    return (
        <div
            className="w-full overflow-hidden relative select-none"
            style={{ background: 'linear-gradient(90deg, #800000 0%, #5F0000 50%, #800000 100%)', padding: '0' }}
        >
            {/* top micro-border */}
            <div className="absolute top-0 left-0 right-0 h-[2px]"
                 style={{ background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }} />

            <div className="flex items-center" style={{ height: 48 }}>
                {/* Marquee track */}
                <div
                    className="flex items-center gap-0 whitespace-nowrap"
                    style={{ animation: 'marqueeScroll 28s linear infinite' }}
                >
                    {ALL.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="inline-flex items-center gap-2 group"
                            style={{ padding: '0 32px' }}
                        >
                            <span style={{ fontSize: 17 }}>{item.emoji}</span>
                            <span
                                className="font-bangla-round text-[#fde8a8] group-hover:text-white transition-colors duration-200 font-semibold"
                                style={{ fontSize: '1.05rem', letterSpacing: '0.01em' }}
                            >
                                {item.label}
                            </span>
                            {/* Divider dot */}
                            <span className="text-[#C9A227]/50 ml-4 text-lg">◆</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* bottom micro-border */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px]"
                 style={{ background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }} />

            <style>{`
                @keyframes marqueeScroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
            `}</style>
        </div>
    );
}
