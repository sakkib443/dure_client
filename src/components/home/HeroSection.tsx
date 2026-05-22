"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        image: '/hh.png',
        tag: 'জামদানির ঐতিহ্য',
        heading: 'শিল্পের ছোঁয়ায়\nতৈরি জামদানি',
        sub: 'প্রতিটি সুতোয় মিশে আছে\nবাংলার হাজার বছরের গর্ব।',
        cta: 'জামদানি দেখুন',
        ctaHref: '/jamdani',
    },
    {
        image: '/hero-dress.png',
        tag: 'নতুন সংগ্রহ',
        heading: 'রঙিন বাংলার\nপোশাক সংগ্রহ',
        sub: 'মেয়েদের ড্রেস থেকে\nলেহেঙ্গা — সব এখানেই।',
        cta: 'সব পণ্য দেখুন',
        ctaHref: '/products',
    },
    {
        image: '/hero-ornaments.png',
        tag: 'হাতে তৈরি অলংকার',
        heading: 'সোনালি স্বপ্নের\nঅনন্য অলংকার',
        sub: 'দেশীয় কারিগরের হাতে\nতৈরি অনন্য গহনা।',
        cta: 'অলংকার দেখুন',
        ctaHref: '/category/ornaments',
    },
];

const HeroSection: React.FC = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5500);
        return () => clearInterval(id);
    }, []);

    const slide = slides[current];

    return (
        <section className="w-full relative overflow-hidden bg-[#1a0808]" style={{ minHeight: 480, maxHeight: 620 }}>

            {/* ── Background image ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 1.3, ease: 'easeInOut' as const }}
                    className="absolute inset-0"
                >
                    <img
                        src={slide.image}
                        alt="Banner"
                        className="w-full h-full"
                        style={{ minHeight: 480, objectFit: 'cover', objectPosition: 'center center' }}
                    />
                    {/* layered overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a0808]/90 via-[#1a0808]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0808]/70 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* ── Decorative Bengali motif pattern (top-right) ── */}
            <div className="absolute top-0 right-0 w-72 h-72 opacity-10 pointer-events-none select-none"
                 style={{ backgroundImage: `radial-gradient(circle, #C9A227 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

            {/* ── Content ── */}
            <div className="relative z-10 container mx-auto px-4 flex items-center"
                 style={{ minHeight: 480, paddingTop: 48, paddingBottom: 48 }}>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 28 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="max-w-xl"
                    >
                        {/* Tag pill */}
                        <span className="font-bangla-round inline-block bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] text-sm font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
                            {slide.tag}
                        </span>

                        {/* Main heading — Tiro Bangla display */}
                        <h1
                            className="font-display text-white font-bold mb-4"
                            style={{
                                fontSize: 'clamp(2.6rem, 6.5vw, 4.8rem)',
                                lineHeight: 1.15,
                                textShadow: '0 4px 24px rgba(0,0,0,0.5)',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {slide.heading}
                        </h1>

                        {/* Sub line */}
                        <p
                            className="font-bangla text-white/80 mb-8"
                            style={{
                                fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                                lineHeight: 1.9,
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {slide.sub}
                        </p>

                        {/* CTA */}
                        <Link
                            href={slide.ctaHref}
                            className="font-bangla-round inline-flex items-center gap-2 bg-[#C9A227] hover:bg-[#a8841e] text-[#1a0808] font-bold px-8 py-3.5 rounded-sm text-base tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {slide.cta}
                            <span className="text-lg">→</span>
                        </Link>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Slide dots ── */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="transition-all duration-300"
                        style={{
                            width: i === current ? 32 : 8,
                            height: 8,
                            borderRadius: 4,
                            background: i === current ? '#C9A227' : 'rgba(255,255,255,0.35)',
                        }}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* ── Slide number ── */}
            <div className="absolute bottom-6 right-8 z-20 text-white/40 text-xs font-mono select-none">
                {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
        </section>
    );
};

export default HeroSection;
