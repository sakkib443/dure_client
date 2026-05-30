"use client";

import React from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ShopCardProps {
    product: {
        _id?: string;
        id?: string | number;
        slug?: string;
        name: string;
        thumbnail?: string;
        image?: string;
        images?: string[];
        price: number;
        originalPrice?: number;
        category?: { name?: string } | string;
        tagline?: string;
        totalSold?: number;
    };
}

const ShopCard: React.FC<ShopCardProps> = ({ product: p }) => {
    const dispatch = useAppDispatch();

    const id       = p._id || String(p.id || '');
    const image    = p.thumbnail || p.image || (p.images?.[0] ?? '');
    const catName  = typeof p.category === 'object' ? p.category?.name : (p.category ?? '');
    const href     = p.slug ? `/product/${p.slug}` : '#';

    const discountPct = p.originalPrice && p.price < p.originalPrice
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    const handleCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id,
            productId: id,
            name:     p.name,
            price:    p.price,
            mrp:      p.originalPrice || p.price,
            image,
            category: catName || '',
        }));
        toast.success('কার্টে যোগ হয়েছে!', {
            icon: '🛒',
            style: { fontFamily: 'Hind Siliguri, sans-serif' },
        });
    };

    return (
        <Link href={href} className="group block">

            {/* Image */}
            <div className="relative overflow-hidden aspect-[3/4]"
                 style={{ background: '#f5efe6', borderRadius: 3 }}>

                {image ? (
                    <img
                        src={image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl"
                         style={{ background: 'linear-gradient(135deg, #f5efe6, #e8ddd3)' }}>
                        🧶
                    </div>
                )}

                {/* Discount badge */}
                {discountPct > 0 && (
                    <span
                        className="absolute top-2 left-2 bg-[#800000] text-white text-[10px] font-bold px-2 py-0.5"
                        style={{ fontFamily: "'Poppins', sans-serif", borderRadius: 2 }}
                    >
                        -{discountPct}%
                    </span>
                )}

                {/* Add to cart — slides up on hover */}
                <button
                    onClick={handleCart}
                    className="font-bangla absolute bottom-0 left-0 right-0 bg-[#1a0808]/85 text-[#fde8a8] text-sm font-semibold py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                >
                    <FiShoppingCart size={14} />
                    কার্টে যোগ করুন
                </button>
            </div>

            {/* Info */}
            <div className="pt-3 pb-1">
                {catName && (
                    <p className="font-bangla text-[10px] text-[#800000] uppercase tracking-wider mb-1 opacity-70">
                        {catName}
                    </p>
                )}
                <h3
                    className="font-bangla text-gray-800 font-medium leading-snug mb-1.5 line-clamp-2 group-hover:text-[#800000] transition-colors"
                    style={{ fontSize: '0.95rem' }}
                >
                    {p.name}
                </h3>

                <div className="flex items-center gap-2">
                    <span
                        className="font-bold text-[#800000]"
                        style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.88rem' }}
                    >
                        ৳{p.price?.toLocaleString('bn-BD')}
                    </span>
                    {p.originalPrice && p.originalPrice > p.price && (
                        <span
                            className="text-gray-400 line-through text-xs"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            ৳{p.originalPrice.toLocaleString('bn-BD')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ShopCard;
