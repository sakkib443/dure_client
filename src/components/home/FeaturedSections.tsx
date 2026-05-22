"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import toast from 'react-hot-toast';
import { FiX, FiShoppingCart, FiInfo, FiChevronRight } from 'react-icons/fi';

const FeaturedSections: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isPantModalOpen, setIsPantModalOpen] = useState(false);
    const [pantQuantity, setPantQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('Free Size');
    const [selectedColor, setSelectedColor] = useState('Black');

    // ── Cart Handlers ────────────────────────────────────────────────────────
    const handleAddSareeToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        dispatch(addToCart({
            id: 'shyamol-mayaboti-saree',
            productId: 'shyamol-mayaboti-saree',
            name: 'Shyamol Mayaboti (শ্যামল মায়াবতী) - Cotton Saree',
            price: 1760,
            mrp: 2200,
            image: '/images/shyamol_mayaboti.png',
            category: 'Saree'
        }));
        
        toast.success(
            <div className="flex flex-col gap-1">
                <span className="font-semibold">Added to Cart!</span>
                <span className="text-xs text-gray-500 font-normal">Shyamol Mayaboti saree has been added.</span>
            </div>,
            { duration: 3000 }
        );
    };

    const handleAddPantToCart = () => {
        dispatch(addToCart({
            id: `slit-button-pant_${selectedSize.replace(' ', '-')}_${selectedColor}`,
            productId: 'slit-button-pant',
            name: `Slit button Pant (স্লিট বাটন প্যান্ট) - ${selectedSize} (${selectedColor})`,
            price: 1830,
            mrp: 2300,
            image: '/images/slit_button_pant.png',
            category: 'Pant',
            color: selectedColor,
            size: selectedSize,
            quantity: pantQuantity
        }));

        toast.success(
            <div className="flex flex-col gap-1">
                <span className="font-semibold">Added to Cart!</span>
                <span className="text-xs text-gray-500 font-normal">{pantQuantity}x Slit button Pant ({selectedSize}) added.</span>
            </div>,
            { duration: 3000 }
        );
        setIsPantModalOpen(false);
        setPantQuantity(1);
    };

    return (
        <div className="w-full bg-[#E3DEDB] text-black overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">

                {/* ─── SECTION 1: Featured Saree (Shyamol Mayaboti) ─── */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                >
                    {/* Left: Product Information */}
                    <div className="space-y-6 flex flex-col items-start text-left order-2 lg:order-1">
                        <div className="space-y-2">
                            <span className="text-[#800000] text-lg font-medium tracking-wide uppercase block">
                                Shyamol Mayaboti
                            </span>
                            <h2 className="text-[#800000] text-4xl sm:text-5xl font-bold tracking-tight font-serif">
                                শ্যামল মায়াবতী
                            </h2>
                            <p className="text-zinc-700 text-sm font-semibold tracking-wider pt-2">
                                BDT 1,760
                            </p>
                        </div>

                        <p className="text-zinc-950 text-sm leading-relaxed max-w-md font-normal">
                            A handloom cotton saree "Shyamol Mayaboti" featuring a dobby border on a soft light greenish base with white booti motifs all over the body of the saree.
                        </p>

                        <Link 
                            href="/category/saree"
                            className="bg-[#333333] hover:bg-black text-white px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg rounded-none mt-4 inline-block"
                        >
                            See More Products
                        </Link>
                    </div>

                    {/* Right: Featured Portrait Image */}
                    <div className="relative order-1 lg:order-2 flex justify-center">
                        <div className="relative w-full max-w-md aspect-[3/4] group overflow-hidden shadow-xl border border-[#c1bcae]/40">
                            <Image 
                                src="/images/shyamol_mayaboti.png" 
                                alt="Shyamol Mayaboti Saree" 
                                fill
                                sizes="(max-w-768px) 100vw, 50vw"
                                priority
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {/* Black gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                            
                            {/* Add to Cart Overlay Button */}
                            <button
                                onClick={handleAddSareeToCart}
                                className="absolute bottom-6 right-6 bg-[#2c2c2c] hover:bg-black text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-2xl border border-transparent hover:border-white/20 active:scale-95"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </motion.section>


                {/* ─── SECTION 2: Category Grid Section ─── */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left Card: Skirt Category (Tall) */}
                        <Link href="/category/skirt" className="relative group block overflow-hidden shadow-lg aspect-[3/4] lg:h-[600px] w-full">
                            <Image 
                                src="/images/skirt_category.png" 
                                alt="Skirt Collection" 
                                fill
                                sizes="(max-w-768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 group-hover:from-black/45 group-hover:to-black/45 transition-colors duration-300" />
                            
                            {/* Top Left Title */}
                            <h3 className="absolute top-6 left-6 text-white text-2xl sm:text-3xl font-bold tracking-wide font-serif">
                                Skirt
                            </h3>
                            
                            {/* Bottom Left Button */}
                            <div className="absolute bottom-6 left-6">
                                <span className="bg-[#2c2c2c] hover:bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md inline-block">
                                    Add To Cart
                                </span>
                            </div>
                        </Link>

                        {/* Right Stack: Blouse (Top) & Saree (Bottom) */}
                        <div className="flex flex-col gap-4 h-full">
                            {/* Top Card: Blouse */}
                            <Link href="/category/blouse" className="relative group block overflow-hidden shadow-lg aspect-[16/9] lg:h-[292px] w-full">
                                <Image 
                                    src="/images/blouse_category.png" 
                                    alt="Blouse Collection" 
                                    fill
                                    sizes="(max-w-768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/45 group-hover:from-black/50 group-hover:to-black/50 transition-colors duration-300" />
                                
                                <h3 className="absolute top-6 left-6 text-white text-2xl sm:text-3xl font-bold tracking-wide font-serif">
                                    Blouse
                                </h3>
                                
                                <div className="absolute bottom-6 left-6">
                                    <span className="bg-[#2c2c2c] hover:bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md inline-block">
                                        Select Options
                                    </span>
                                </div>
                            </Link>

                            {/* Bottom Card: Saree */}
                            <Link href="/category/saree" className="relative group block overflow-hidden shadow-lg aspect-[16/9] lg:h-[292px] w-full">
                                <Image 
                                    src="/images/saree_category.png" 
                                    alt="Saree Collection" 
                                    fill
                                    sizes="(max-w-768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 group-hover:from-black/45 group-hover:to-black/45 transition-colors duration-300" />
                                
                                <h3 className="absolute top-6 left-6 text-white text-2xl sm:text-3xl font-bold tracking-wide font-serif">
                                    Saree
                                </h3>
                                
                                <div className="absolute bottom-6 left-6">
                                    <span className="bg-[#2c2c2c] hover:bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md inline-block">
                                        Add To Cart
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Full-Width Card: Jewellery */}
                    <Link href="/category/jewellery" className="relative group block overflow-hidden shadow-lg aspect-[21/9] lg:h-[250px] w-full mt-4">
                        <Image 
                            src="/images/jewellery_category.png" 
                            alt="Jewellery Collection" 
                            fill
                            sizes="100vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/45 group-hover:from-black/50 group-hover:to-black/50 transition-colors duration-300" />
                        
                        <h3 className="absolute top-6 left-6 text-white text-2xl sm:text-3xl font-bold tracking-wide font-serif">
                            Jewellery
                        </h3>
                        
                        <div className="absolute bottom-6 left-6">
                            <span className="bg-[#2c2c2c] hover:bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md inline-block">
                                Add To Cart
                            </span>
                        </div>
                    </Link>
                </motion.section>


                {/* ─── SECTION 3: Featured Pant (Slit button Pant) ─── */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-8"
                >
                    {/* Left: Product Information */}
                    <div className="space-y-6 flex flex-col items-start text-left order-2 lg:order-1">
                        <div className="space-y-2">
                            <span className="text-[#800000] text-lg font-medium tracking-wide uppercase block">
                                Slit button Pant
                            </span>
                            <h2 className="text-[#800000] text-4xl sm:text-5xl font-bold tracking-tight font-serif">
                                স্লিট বাটন প্যান্ট
                            </h2>
                            <p className="text-zinc-700 text-sm font-semibold tracking-wider pt-2">
                                BDT 1,830
                            </p>
                        </div>

                        <div className="space-y-4 text-zinc-950 text-sm leading-relaxed max-w-md font-normal">
                            <p>
                                Free size cotton pant with subtle side patchwork pocket detailing for an easy, stylish fit.
                            </p>
                            <p className="text-xs text-zinc-800 bg-[#d5cfc0]/40 p-3.5 border-l-2 border-[#800000]/60 italic">
                                <span className="font-bold text-zinc-900 not-italic block mb-1">NOTE:</span>
                                Patchwork is a craft of needlework in which small pieces of cloth in different designs, patterns, colors, or textures are sewed together. Each and every patchwork is different and unique. The designs may not be identically same.
                                <span className="block mt-2 font-medium text-right text-[#800000]">-chutli</span>
                            </p>
                        </div>

                        <Link 
                            href="/category/pant"
                            className="bg-[#333333] hover:bg-black text-white px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg rounded-none mt-4 inline-block"
                        >
                            See More Products
                        </Link>
                    </div>

                    {/* Right: Featured Portrait Image */}
                    <div className="relative order-1 lg:order-2 flex justify-center">
                        <div className="relative w-full max-w-md aspect-[3/4] group overflow-hidden shadow-xl border border-[#c1bcae]/40">
                            <Image 
                                src="/images/slit_button_pant.png" 
                                alt="Slit button Pant Detail" 
                                fill
                                sizes="(max-w-768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {/* Black gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                            
                            {/* Select Option Overlay Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsPantModalOpen(true);
                                }}
                                className="absolute bottom-6 right-6 bg-[#2c2c2c] hover:bg-black text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-2xl border border-transparent hover:border-white/20 active:scale-95"
                            >
                                Select Option
                            </button>
                        </div>
                    </div>
                </motion.section>

            </div>

            {/* ─── OPTION SELECTOR MODAL (For Slit button Pant) ─── */}
            <AnimatePresence>
                {isPantModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPantModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Box */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#E3DEDB] text-black shadow-2xl overflow-hidden border border-[#c1bcae]/50 z-10"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start p-6 border-b border-[#c1bcae]/40">
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-[#800000] font-serif">
                                        Slit button Pant (স্লিট বাটন প্যান্ট)
                                    </h3>
                                    <p className="text-zinc-700 text-sm font-semibold tracking-wider mt-1">
                                        BDT 1,830
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setIsPantModalOpen(false)}
                                    className="p-1 hover:bg-zinc-200/50 rounded-full transition-colors text-zinc-600 hover:text-black"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Thumbnail and Category info */}
                                <div className="flex gap-4 items-center">
                                    <div className="relative w-20 h-20 overflow-hidden border border-[#c1bcae]/40">
                                        <Image 
                                            src="/images/slit_button_pant.png" 
                                            alt="Slit button Pant" 
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="text-xs space-y-1 text-zinc-700">
                                        <div className="flex items-center gap-1.5">
                                            <FiInfo size={12} className="text-[#800000]" />
                                            <span>Collection: Women's Pant</span>
                                        </div>
                                        <div>Material: Handloom Cotton</div>
                                        <div>Pocket: Patchwork Detailing</div>
                                    </div>
                                </div>

                                {/* Size Selection */}
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block">
                                        Select Size:
                                    </span>
                                    <div className="flex gap-2">
                                        {['Free Size'].map((size) => (
                                            <button 
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 text-xs font-medium border transition-all ${
                                                    selectedSize === size 
                                                        ? 'bg-[#800000] text-white border-transparent' 
                                                        : 'border-[#c1bcae] text-zinc-800 hover:border-black'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Selection */}
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block">
                                        Select Color:
                                    </span>
                                    <div className="flex gap-2">
                                        {['Black'].map((color) => (
                                            <button 
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 text-xs font-medium border flex items-center gap-2 transition-all ${
                                                    selectedColor === color 
                                                        ? 'bg-[#800000] text-white border-transparent' 
                                                        : 'border-[#c1bcae] text-zinc-800 hover:border-black'
                                                }`}
                                            >
                                                <span className="w-2.5 h-2.5 rounded-full bg-black border border-white/20 inline-block" />
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block">
                                        Quantity:
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setPantQuantity(q => Math.max(1, q - 1))}
                                            className="w-8 h-8 flex items-center justify-center border border-[#c1bcae] text-zinc-800 hover:border-black font-semibold text-sm select-none"
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-bold text-sm">
                                            {pantQuantity}
                                        </span>
                                        <button 
                                            onClick={() => setPantQuantity(q => q + 1)}
                                            className="w-8 h-8 flex items-center justify-center border border-[#c1bcae] text-zinc-800 hover:border-black font-semibold text-sm select-none"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-[#dcd7c8]/30 border-t border-[#c1bcae]/40 flex gap-3">
                                <button
                                    onClick={() => setIsPantModalOpen(false)}
                                    className="flex-1 bg-transparent hover:bg-zinc-200/50 text-zinc-700 hover:text-black border border-[#c1bcae] py-3 text-xs font-semibold uppercase tracking-wider transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddPantToCart}
                                    className="flex-1 bg-[#800000] hover:bg-red-950 text-white py-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <FiShoppingCart size={14} />
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FeaturedSections;
