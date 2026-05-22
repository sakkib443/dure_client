"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    { image: '/images/banner-1.jpg' },
    { image: '/images/banner-2.jpg' },
    { image: '/images/banner-3.jpg' },
];

const HeroSection: React.FC = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full">
            <div className="relative w-full overflow-hidden bg-gray-100" style={{ minHeight: '400px', maxHeight: '600px', aspectRatio: '16 / 7' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <img
                            src={slides[current].image}
                            alt="Jhamdani Banner"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Left Overlay Content */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="container mx-auto h-full relative px-4 lg:px-0">
                            <div className="absolute inset-0 flex items-center">
                                <motion.div 
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="ml-[5%] lg:ml-20 absolute top-0 bottom-0 w-[50%] max-w-[180px] lg:max-w-[260px] bg-white/10 backdrop-blur-xl px-4 py-2 lg:px-10 lg:py-4 flex flex-col justify-center text-white pointer-events-auto border-x border-white/30 shadow-sm"
                                    style={{
                                        color: 'white',
                                        textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <p 
                                        className="text-[11px] lg:text-[14px] lg:leading-[1.6] leading-[1.4] font-medium mb-3"
                                        style={{ fontFamily: "'Charukola Ultra Light', sans-serif" }}
                                    >
                                        আমাদের প্রত্যেকের আছে<br/>
                                        কিছু নিজস্বতা,<br/>
                                        যা কোনো কৃত্রিম পূর্ণতা চায় না।<br/>
                                        সুতলির বাঁধনে, সুতোর প্রতিটি ভাঁজে<br/>
                                        লুকিয়ে থাকে একেকটি একক সত্ত্বার<br/>
                                        অনন্য রূপ আর সৌন্দর্য।<br/><br/>
                                        ঠিক এমন বিশ্বাসের জায়গা<br/>
                                        থেকেই আমাদের প্রতিটি পণ্য গড়েছে<br/>
                                        নিজস্ব স্বাতন্ত্র্য; এক আপন অনুভূতির ছোঁয়ায়—<br/>
                                        ঠিক আপনার-আমার মতো।
                                    </p>

                                    <Link 
                                        href="/products" 
                                        className="inline-block w-fit px-4 py-2 bg-black text-white text-[9px] lg:text-xs font-semibold hover:bg-gray-800 transition-colors rounded-sm uppercase tracking-wider"
                                    >
                                        All Products
                                    </Link>
                                </motion.div>
                            </div>
                    </div>
                </div>

                {/* Slider Indicators */}
                <div className="absolute bottom-6 right-12 flex flex-col gap-3">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`w-1 h-8 transition-all ${idx === current ? 'bg-white' : 'bg-white/30'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
