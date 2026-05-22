"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BrandStory() {
    return (
        <section className="w-full py-16 bg-alpana-dots">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Top ornamental divider */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A227]/60" />
                    <span className="text-[#C9A227] text-2xl select-none">✿</span>
                    <span
                        className="font-display text-[#5F0000] font-bold px-2"
                        style={{ fontSize: '1.4rem', letterSpacing: '0.05em' }}
                    >
                        আমাদের গল্প
                    </span>
                    <span className="text-[#C9A227] text-2xl select-none">✿</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A227]/60" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* ── Left: image collage ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        {/* Main image */}
                        <div className="overflow-hidden shadow-md" style={{ borderRadius: 4, aspectRatio: '4/3' }}>
                            <img
                                src="/brand-story.png"
                                alt="জামদানি তাঁত"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Small overlay card — bottom right */}
                        <div
                            className="absolute -bottom-5 -right-4 bg-[#800000] text-white shadow-xl p-5"
                            style={{ width: 160, borderRadius: 3 }}
                        >
                            <p
                                className="text-3xl font-extrabold leading-none mb-1"
                                style={{ fontFamily: "'Poppins', sans-serif", color: '#C9A227' }}
                            >
                                ২,০০০+
                            </p>
                            <p className="font-bangla text-xs leading-snug text-white/85">
                                বছরের পুরনো<br />জামদানির ঐতিহ্য
                            </p>
                        </div>

                        {/* Dotted pattern decoration */}
                        <div
                            className="absolute -top-4 -left-4 w-24 h-24 opacity-30 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(circle, #800000 1.5px, transparent 1.5px)',
                                backgroundSize: '12px 12px',
                            }}
                        />
                    </motion.div>

                    {/* ── Right: brand text ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        <h2
                            className="font-display text-[#5F0000] font-bold mb-5"
                            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.25 }}
                        >
                            মাটির টানে,<br />সুতোর বন্ধনে
                        </h2>

                        <p
                            className="font-bangla text-gray-700 mb-4 text-justify"
                            style={{ fontSize: '1.05rem', lineHeight: 2 }}
                        >
                            জামদানি — এই একটি শব্দেই মিশে আছে বাংলার হাজার বছরের ঐতিহ্য, একজন তাঁতির
                            অক্লান্ত পরিশ্রম আর একটি সংস্কৃতির অহংকার। ঢাকার নারায়ণগঞ্জ থেকে শুরু করে
                            গ্রাম বাংলার প্রতিটি তাঁতঘরে আজও বোনা হচ্ছে এই অনন্য শিল্পের সুতো।
                        </p>

                        <p
                            className="font-bangla text-gray-700 mb-6 text-justify"
                            style={{ fontSize: '1.05rem', lineHeight: 2 }}
                        >
                            আমরা <strong style={{ color: '#800000' }}>জামদানি</strong>-তে বিশ্বাস করি যে
                            প্রতিটি পোশাকই একটি গল্প বলে। সেই গল্পে আছে কারিগরের ভালোবাসা, প্রকৃতির রং
                            আর বাংলার মাটির সুবাস। তাই আমরা শুধু পোশাক বিক্রি করি না — আমরা একটি অনুভূতি
                            পৌঁছে দিই আপনার কাছে।
                        </p>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-4 mb-7 py-5 border-y border-[#d4c4b0]">
                            {[
                                { val: '৫০+',    label: 'দক্ষ কারিগর'     },
                                { val: '২০০+',   label: 'অনন্য পণ্য'       },
                                { val: '৫,০০০+', label: 'সন্তুষ্ট ক্রেতা' },
                            ].map(({ val, label }) => (
                                <div key={label} className="text-center">
                                    <p
                                        className="font-extrabold text-[#800000] leading-none mb-1"
                                        style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.5rem' }}
                                    >
                                        {val}
                                    </p>
                                    <p className="font-bangla text-gray-600 text-sm">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/about"
                                className="font-bangla-round inline-block bg-[#800000] hover:bg-[#5F0000] text-white px-7 py-3 text-base font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg"
                                style={{ borderRadius: 2 }}
                            >
                                আরও জানুন
                            </Link>
                            <Link
                                href="/contact"
                                className="font-bangla-round inline-block border border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white px-7 py-3 text-base font-semibold tracking-wide transition-all duration-300"
                                style={{ borderRadius: 2 }}
                            >
                                যোগাযোগ করুন
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
