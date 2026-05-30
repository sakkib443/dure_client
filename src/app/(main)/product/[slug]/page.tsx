"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    FiHeart, FiShoppingCart, FiMinus, FiPlus, FiCheckCircle,
    FiStar, FiX, FiCopy, FiShare2, FiChevronRight, FiChevronLeft,
    FiSend, FiTruck, FiShield, FiAward, FiZoomIn, FiMessageSquare,
} from 'react-icons/fi';
import {
    FaFacebookF, FaWhatsapp, FaTelegramPlane, FaLinkedinIn, FaEnvelope,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useGetProductBySlugQuery, useGetRelatedProductsQuery, useIncrementProductStatMutation } from '@/redux/api/productApi';
import { useGetProductReviewsQuery, usePublicCreateReviewMutation } from '@/redux/api/reviewApi';
import { useCreateInquiryMutation } from '@/redux/api/inquiryApi';
import { useAppDispatch, useAppSelector } from '@/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import ShopCard from '@/components/shared/ShopCard';

/* ── Brand palette ── */
const MAROON = '#5F0000';
const PRICE = '#800000';
const GOLD = '#C9A227';
const CREAM = '#FDF6EC';

const namedColors: Record<string, string> = {
    red: '#E53935', orange: '#FB8C00', yellow: '#FDD835', green: '#43A047',
    blue: '#1E88E5', black: '#1a1a1a', white: '#FFFFFF', pink: '#EC407A',
    purple: '#8E24AA', brown: '#6D4C41', gray: '#9E9E9E', grey: '#9E9E9E',
    navy: '#1A237E', teal: '#00897B', maroon: '#800000', olive: '#827717',
    cyan: '#00ACC1', lime: '#C0CA33', coral: '#FF7F50', gold: '#C9A227',
    silver: '#BDBDBD', beige: '#D7CCC8', cream: '#FFF8E1', khaki: '#C5B358',
    'লাল': '#E53935', 'মেরুন': '#800000', 'সবুজ': '#43A047', 'নীল': '#1E88E5',
    'হলুদ': '#FDD835', 'সাদা': '#FFFFFF', 'কালো': '#1a1a1a', 'গোলাপি': '#EC407A',
    'সোনালি': '#C9A227', 'কমলা': '#FB8C00',
};
const getColorHex = (name: string) => namedColors[name?.toLowerCase?.()] || namedColors[name] || name;

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((s: any) => s.auth);
    const cartItems = useAppSelector((s: any) => s.cart.items);

    const [createInquiry] = useCreateInquiryMutation();
    const [incrementStat] = useIncrementProductStatMutation();
    const [publicCreateReview] = usePublicCreateReviewMutation();

    /* UI state */
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specs'>('description');
    const [showShare, setShowShare] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    /* review form */
    const [cmtText, setCmtText] = useState('');
    const [cmtName, setCmtName] = useState('');
    const [cmtRating, setCmtRating] = useState(5);
    const [cmtHover, setCmtHover] = useState(0);
    const [cmtSubmitting, setCmtSubmitting] = useState(false);

    /* inquiry form */
    const [showInquiry, setShowInquiry] = useState(false);
    const [inqName, setInqName] = useState('');
    const [inqContact, setInqContact] = useState('');
    const [inqPhone, setInqPhone] = useState('');
    const [inqMessage, setInqMessage] = useState('');
    const [inqSubmitting, setInqSubmitting] = useState(false);

    const viewCounted = useRef(false);

    const { data: productData, isLoading, isError } = useGetProductBySlugQuery(slug as string, { skip: !slug });
    const product = productData?.data;

    const { data: relatedData } = useGetRelatedProductsQuery(
        { id: product?._id, categoryId: product?.category?._id },
        { skip: !product?._id || !product?.category?._id }
    );
    const relatedProducts: any[] = relatedData?.data || [];

    const { data: reviewsData } = useGetProductReviewsQuery({ productId: product?._id }, { skip: !product?._id });
    const reviews: any[] = reviewsData?.data || [];

    /* scroll top on slug change */
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [slug]);

    /* count a view once per product load */
    useEffect(() => {
        if (product?._id && !viewCounted.current) {
            viewCounted.current = true;
            incrementStat({ id: product._id, field: 'viewCount' }).catch(() => {});
        }
    }, [product?._id, incrementStat]);

    /* lock scroll when modal open */
    const anyModal = isFullscreen || showShare || showInquiry;
    useEffect(() => {
        document.body.style.overflow = anyModal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [anyModal]);

    /* ── Variant logic (memoised) ── */
    const variants: any[] = useMemo(() => product?.variants || [], [product]);
    const hasVariants = variants.length > 0;
    const baseImages: string[] = useMemo(
        () => [product?.thumbnail, ...(product?.images || [])].filter(Boolean),
        [product]
    );

    const colorSwatches = useMemo(() => {
        if (hasVariants) {
            const map = new Map<string, string>();
            variants.forEach((v) => { if (v.color) map.set(v.color, v.colorHex || v.color); });
            return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
        }
        if (product?.colors?.length) {
            return product.colors.map((c: string, i: number) => ({ name: c, hex: product.colorHex?.[i] || c }));
        }
        return [];
    }, [hasVariants, variants, product]);

    const sizeList: string[] = useMemo(() => {
        if (hasVariants) return [...new Set(variants.filter((v) => v.size).map((v) => v.size))] as string[];
        return product?.sizes?.length ? product.sizes : [];
    }, [hasVariants, variants, product]);

    const colorImageMap = useMemo(() => {
        const map: Record<string, string[]> = {};
        if (hasVariants) {
            variants.forEach((v) => {
                if (v.color && v.images?.length) {
                    if (!map[v.color]) map[v.color] = [];
                    v.images.forEach((img: string) => { if (!map[v.color].includes(img)) map[v.color].push(img); });
                }
            });
        } else if (colorSwatches.length && baseImages.length) {
            colorSwatches.forEach((c: any, i: number) => { if (i < baseImages.length) map[c.name] = [baseImages[i]]; });
        }
        return map;
    }, [hasVariants, variants, colorSwatches, baseImages]);

    const imageToColorMap = useMemo(() => {
        const map: Record<string, string> = {};
        Object.entries(colorImageMap).forEach(([c, imgs]) => imgs.forEach((img) => { map[img] = c; }));
        return map;
    }, [colorImageMap]);

    const activeVariant = useMemo(() => (
        hasVariants
            ? variants.find((v) => (!selectedColor || v.color === selectedColor) && (!selectedSize || v.size === selectedSize))
            : null
    ), [hasVariants, variants, selectedColor, selectedSize]);

    const allImages: string[] = useMemo(() => {
        if (!hasVariants) return baseImages;
        const seen = new Set<string>();
        const imgs: string[] = [];
        baseImages.forEach((img) => { if (!seen.has(img)) { seen.add(img); imgs.push(img); } });
        const processed = new Set<string>();
        variants.forEach((v) => {
            const key = v.color || `__no_${v.size}`;
            if (processed.has(key)) return;
            processed.add(key);
            (v.images || []).forEach((img: string) => { if (!seen.has(img)) { seen.add(img); imgs.push(img); } });
        });
        return imgs.length ? imgs : baseImages;
    }, [hasVariants, variants, baseImages]);

    const discountedPrice = useMemo(() => {
        if (activeVariant) {
            const d = activeVariant.discount || 0;
            return d > 0 ? activeVariant.price - (activeVariant.price * d) / 100 : activeVariant.price;
        }
        if (!product) return 0;
        return product.discount > 0 ? product.price - (product.price * product.discount) / 100 : product.price;
    }, [activeVariant, product]);

    const originalPrice = activeVariant?.originalPrice || product?.originalPrice || 0;
    const displayStock = activeVariant ? activeVariant.stock : (product?.stock ?? 0);
    const discountPct = originalPrice && originalPrice > discountedPrice
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
        : (product?.discount || 0);

    /* spec rows */
    const productDetails = useMemo(() => {
        const d: { key: string; value: string }[] = [];
        if (!product) return d;
        if (product.sku) d.push({ key: 'SKU', value: product.sku });
        if (product.brand) d.push({ key: 'ব্র্যান্ড', value: String(product.brand).toUpperCase() });
        if (product.specifications?.length) product.specifications.forEach((s: any) => d.push({ key: s.key, value: s.value }));
        if (product.material?.length) d.push({ key: 'উপাদান', value: product.material.join(', ') });
        if (product.weight > 0) d.push({ key: 'ওজন', value: `${product.weight}g` });
        if (product.colors?.length) d.push({ key: 'রঙ', value: product.colors.join(', ') });
        if (product.sizes?.length) d.push({ key: 'সাইজ', value: product.sizes.join(', ') });
        if (!d.length) {
            d.push({ key: 'ক্যাটাগরি', value: product.category?.name || 'সাধারণ' });
            d.push({ key: 'স্টক', value: product.stock > 0 ? `${product.stock} টি আছে` : 'স্টক নেই' });
        }
        return d;
    }, [product]);

    /* rating summary */
    const avgRating = product?.rating || 0;
    const ratingBreakdown = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        reviews.forEach((r) => { const idx = Math.round(r.rating) - 1; if (idx >= 0 && idx < 5) counts[idx]++; });
        return counts;
    }, [reviews]);

    /* ── Handlers ── */
    const handleColorSelect = (name: string) => {
        if (selectedColor === name) { setSelectedColor(''); return; }
        setSelectedColor(name);
        if (selectedSize && hasVariants) {
            const sizes = variants.filter((v) => v.color === name).map((v) => v.size).filter(Boolean);
            if (!sizes.includes(selectedSize)) setSelectedSize('');
        }
        const imgs = colorImageMap[name];
        if (imgs?.length) {
            const idx = allImages.indexOf(imgs[0]);
            if (idx >= 0) setSelectedImage(idx);
        }
    };

    const handleImageSelect = (idx: number) => {
        setSelectedImage(idx);
        const url = allImages[idx];
        if (url && imageToColorMap[url]) setSelectedColor(imageToColorMap[url]);
    };

    const getCartId = () => {
        const parts = [product?._id];
        if (selectedColor) parts.push(selectedColor);
        if (selectedSize) parts.push(selectedSize);
        return parts.join('_');
    };
    const isInCart = product ? cartItems.some((i: any) => i.id === getCartId()) : false;

    const handleAddToCart = () => {
        if (!product) return;
        if (isInCart) { toast('এই পণ্যটি ইতিমধ্যে কার্টে আছে', { icon: '🛒' }); return; }
        const image = activeVariant?.images?.[0] || allImages[selectedImage] || product.thumbnail;
        dispatch(addToCart({
            id: getCartId(), productId: product._id, name: product.name,
            price: discountedPrice, mrp: originalPrice || product.price, image,
            category: product.category?.name || 'General', quantity,
            color: selectedColor || undefined, colorHex: activeVariant?.colorHex || undefined,
            size: selectedSize || undefined,
        }));
        toast.success('কার্টে যোগ হয়েছে!', { icon: '🛒', style: { fontFamily: 'Hind Siliguri, sans-serif' } });
    };

    const handleBuyNow = () => {
        if (!product) return;
        if (!isInCart) {
            const image = activeVariant?.images?.[0] || allImages[selectedImage] || product.thumbnail;
            dispatch(addToCart({
                id: getCartId(), productId: product._id, name: product.name,
                price: discountedPrice, mrp: originalPrice || product.price, image,
                category: product.category?.name || 'General', quantity,
                color: selectedColor || undefined, colorHex: activeVariant?.colorHex || undefined,
                size: selectedSize || undefined,
            }));
        }
        router.push('/checkout');
    };

    const handleReviewSubmit = async () => {
        if (!cmtText.trim() || !product?._id) { toast.error('অনুগ্রহ করে মন্তব্য লিখুন'); return; }
        setCmtSubmitting(true);
        try {
            await publicCreateReview({
                product: product._id, rating: cmtRating,
                comment: cmtText.trim(), userName: cmtName.trim() || 'Anonymous',
            }).unwrap();
            setCmtText(''); setCmtName(''); setCmtRating(5);
            toast.success('আপনার রিভিউ যোগ হয়েছে!');
        } catch {
            toast.error('রিভিউ জমা দেওয়া যায়নি');
        } finally { setCmtSubmitting(false); }
    };

    const handleInquirySubmit = async () => {
        if (!inqName.trim() || !inqPhone.trim() || !inqMessage.trim()) { toast.error('সব প্রয়োজনীয় তথ্য পূরণ করুন'); return; }
        setInqSubmitting(true);
        try {
            await createInquiry({
                product: product._id, name: inqName.trim(), email: inqContact.trim(),
                phone: inqPhone.trim(), message: inqMessage.trim(),
            }).unwrap();
            toast.success('আপনার জিজ্ঞাসা পাঠানো হয়েছে!');
            setInqName(''); setInqContact(''); setInqPhone(''); setInqMessage('');
            setShowInquiry(false);
        } catch {
            toast.error('পাঠানো যায়নি, আবার চেষ্টা করুন');
        } finally { setInqSubmitting(false); }
    };

    const productUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = product ? `${product.name} — দ্যুতি` : '';
    const copyLink = () => {
        navigator.clipboard?.writeText(productUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div style={{ background: CREAM, minHeight: '100vh' }}>
                <div className="container mx-auto px-4 py-10">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2 aspect-square bg-gray-200 rounded-lg animate-pulse" />
                        <div className="md:w-1/2 flex flex-col gap-4">
                            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                            <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
                            <div className="h-10 w-1/2 bg-gray-200 rounded animate-pulse" />
                            <div className="h-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-12 bg-gray-200 rounded animate-pulse mt-auto" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (isError || !product) {
        return (
            <div style={{ background: CREAM, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center px-6 py-16 bg-white rounded-2xl max-w-md mx-4" style={{ border: `1px solid #efe3cf` }}>
                    <div className="text-5xl mb-4">😕</div>
                    <h2 className="font-display font-bold text-2xl mb-2" style={{ color: MAROON }}>পণ্যটি পাওয়া যায়নি</h2>
                    <p className="font-bangla text-gray-500 mb-6 text-sm">এই পণ্যটি সরিয়ে ফেলা হয়েছে বা আর পাওয়া যাচ্ছে না।</p>
                    <Link href="/products" className="font-bangla inline-block px-7 py-3 rounded-lg text-white font-semibold text-sm" style={{ background: MAROON }}>
                        সব পণ্য দেখুন
                    </Link>
                </div>
            </div>
        );
    }

    const mainImage = allImages[selectedImage] || allImages[0] || product.thumbnail;

    return (
        <div style={{ background: CREAM, minHeight: '100vh' }}>
            {/* ── Breadcrumb ── */}
            <div className="border-b" style={{ borderColor: '#efe3cf', background: '#fff' }}>
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-xs font-bangla text-gray-500 flex-wrap">
                        <Link href="/" className="hover:text-[#5F0000]">হোম</Link>
                        <FiChevronRight size={12} />
                        {product.category?.slug && (
                            <>
                                <Link href={`/category/${product.category.slug}`} className="hover:text-[#5F0000]">{product.category.name}</Link>
                                <FiChevronRight size={12} />
                            </>
                        )}
                        <span className="font-medium" style={{ color: MAROON }}>{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* ───── Gallery ───── */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex sm:flex-col gap-2 sm:w-[72px] overflow-auto no-scrollbar">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleImageSelect(idx)}
                                        className="shrink-0 overflow-hidden rounded-md transition-all"
                                        style={{
                                            width: 64, height: 80,
                                            border: selectedImage === idx ? `2px solid ${MAROON}` : '2px solid transparent',
                                            outline: selectedImage === idx ? 'none' : '1px solid #e8ddcb',
                                        }}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main image */}
                        <div className="flex-1">
                            <div
                                className="relative overflow-hidden rounded-lg group"
                                style={{ background: '#f5efe6', border: '1px solid #efe3cf', aspectRatio: '3/4' }}
                            >
                                {discountPct > 0 && (
                                    <span className="absolute top-3 left-3 z-10 text-white text-xs font-bold px-2.5 py-1 rounded"
                                        style={{ background: PRICE, fontFamily: "'Poppins',sans-serif" }}>
                                        -{discountPct}%
                                    </span>
                                )}
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white"
                                >
                                    <FiHeart size={16} style={{ color: isWishlisted ? PRICE : '#999', fill: isWishlisted ? PRICE : 'none' }} />
                                </button>
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    onClick={() => setIsFullscreen(true)}
                                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
                                />
                                <button
                                    onClick={() => setIsFullscreen(true)}
                                    className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white"
                                >
                                    <FiZoomIn size={16} style={{ color: MAROON }} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ───── Info ───── */}
                    <div>
                        {/* Category pill */}
                        {product.category?.name && (
                            <span className="font-bangla inline-block text-[11px] uppercase tracking-wider mb-2 px-2.5 py-1 rounded"
                                style={{ color: MAROON, background: '#f5e9d8' }}>
                                {product.category.name}
                            </span>
                        )}

                        <h1 className="font-bangla font-bold leading-snug mb-3" style={{ color: '#2a1410', fontSize: 'clamp(1.4rem,3vw,1.9rem)' }}>
                            {product.name}
                        </h1>

                        {product.tagline && (
                            <p className="font-bangla text-gray-500 mb-3" style={{ fontSize: '0.95rem' }}>{product.tagline}</p>
                        )}

                        {/* Rating + sold */}
                        <div className="flex items-center gap-4 mb-5 flex-wrap">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <FiStar key={s} size={15} style={{ color: GOLD, fill: s <= Math.round(avgRating) ? GOLD : 'none' }} />
                                ))}
                                <span className="font-bangla text-sm text-gray-600 ml-1">
                                    {avgRating ? avgRating.toFixed(1) : '—'} ({product.reviewCount || reviews.length} রিভিউ)
                                </span>
                            </div>
                            {product.totalSold > 0 && (
                                <span className="font-bangla text-sm text-gray-500">
                                    {product.totalSold?.toLocaleString('bn-BD')} টি বিক্রি হয়েছে
                                </span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-3 mb-1 pb-5 border-b" style={{ borderColor: '#efe3cf' }}>
                            <span className="font-bold" style={{ color: PRICE, fontFamily: "'Poppins',sans-serif", fontSize: '2rem', lineHeight: 1 }}>
                                ৳{Math.round(discountedPrice).toLocaleString('bn-BD')}
                            </span>
                            {originalPrice > discountedPrice && (
                                <span className="text-gray-400 line-through" style={{ fontFamily: "'Poppins',sans-serif", fontSize: '1.1rem' }}>
                                    ৳{originalPrice.toLocaleString('bn-BD')}
                                </span>
                            )}
                            {product.priceType === 'negotiable' && (
                                <span className="font-bangla text-xs px-2 py-0.5 rounded" style={{ background: '#fff4e0', color: '#9a6b00' }}>
                                    আলোচনা সাপেক্ষ
                                </span>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="my-4">
                            <span className="font-bangla text-sm font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5"
                                style={{
                                    background: displayStock > 5 ? '#e8f5e9' : displayStock > 0 ? '#fff4e0' : '#fdecea',
                                    color: displayStock > 5 ? '#2e7d32' : displayStock > 0 ? '#9a6b00' : '#c62828',
                                }}>
                                <span style={{
                                    width: 7, height: 7, borderRadius: '50%',
                                    background: displayStock > 5 ? '#2e7d32' : displayStock > 0 ? '#9a6b00' : '#c62828',
                                }} />
                                {displayStock > 5 ? 'স্টকে আছে' : displayStock > 0 ? `মাত্র ${displayStock} টি বাকি` : 'স্টক নেই'}
                            </span>
                        </div>

                        {/* Colors */}
                        {colorSwatches.length > 0 && (
                            <div className="mb-5">
                                <p className="font-bangla text-sm font-semibold text-gray-700 mb-2">
                                    রঙ {selectedColor && <span style={{ color: MAROON }}>: {selectedColor}</span>}
                                </p>
                                <div className="flex flex-wrap gap-2.5">
                                    {colorSwatches.map((c: any, i: number) => {
                                        const active = selectedColor === c.name;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleColorSelect(c.name)}
                                                title={c.name}
                                                className="relative rounded-full transition-transform hover:scale-110"
                                                style={{
                                                    width: 34, height: 34,
                                                    background: getColorHex(c.hex),
                                                    border: active ? `2px solid ${MAROON}` : '2px solid #e8ddcb',
                                                    boxShadow: active ? `0 0 0 2px #fff inset` : 'none',
                                                }}
                                            >
                                                {active && (
                                                    <FiCheckCircle
                                                        size={14}
                                                        className="absolute -top-1.5 -right-1.5 bg-white rounded-full"
                                                        style={{ color: MAROON }}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {sizeList.length > 0 && (
                            <div className="mb-5">
                                <p className="font-bangla text-sm font-semibold text-gray-700 mb-2">
                                    সাইজ {selectedSize && <span style={{ color: MAROON }}>: {selectedSize}</span>}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sizeList.map((s, i) => {
                                        const active = selectedSize === s;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedSize(active ? '' : s)}
                                                className="font-bangla min-w-[44px] px-3 py-2 rounded-md text-sm font-medium transition-all"
                                                style={{
                                                    background: active ? MAROON : '#fff',
                                                    color: active ? '#fff' : '#444',
                                                    border: `1px solid ${active ? MAROON : '#e8ddcb'}`,
                                                }}
                                            >
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity + actions */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center rounded-md overflow-hidden" style={{ border: '1px solid #e8ddcb' }}>
                                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2.5 hover:bg-gray-50" style={{ color: MAROON }}><FiMinus size={15} /></button>
                                <span className="px-4 font-semibold text-sm min-w-[44px] text-center" style={{ fontFamily: "'Poppins',sans-serif" }}>{quantity}</span>
                                <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2.5 hover:bg-gray-50" style={{ color: MAROON }}><FiPlus size={15} /></button>
                            </div>
                            <span className="font-bangla text-xs text-gray-400">পরিমাণ নির্বাচন করুন</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={displayStock <= 0}
                                className="font-bangla flex items-center justify-center gap-2 py-3.5 rounded-md font-semibold text-sm transition-all disabled:opacity-50"
                                style={{ background: '#fff', color: MAROON, border: `1.5px solid ${MAROON}` }}
                            >
                                <FiShoppingCart size={16} />
                                {isInCart ? 'কার্টে আছে' : 'কার্টে যোগ করুন'}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={displayStock <= 0}
                                className="font-bangla flex items-center justify-center gap-2 py-3.5 rounded-md font-semibold text-sm text-white transition-all disabled:opacity-50"
                                style={{ background: MAROON }}
                            >
                                এখনই কিনুন
                            </button>
                        </div>

                        {/* secondary actions */}
                        <div className="flex items-center gap-4 mb-6">
                            <button onClick={() => setShowInquiry(true)} className="font-bangla flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#5F0000]">
                                <FiMessageSquare size={15} /> জিজ্ঞাসা করুন
                            </button>
                            <button onClick={() => setShowShare(true)} className="font-bangla flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#5F0000]">
                                <FiShare2 size={15} /> শেয়ার
                            </button>
                        </div>

                        {/* trust badges */}
                        <div className="grid grid-cols-3 gap-3 pt-5 border-t" style={{ borderColor: '#efe3cf' }}>
                            {[
                                { icon: FiTruck, label: 'দ্রুত ডেলিভারি' },
                                { icon: FiShield, label: 'নিরাপদ পেমেন্ট' },
                                { icon: FiAward, label: 'খাঁটি পণ্য' },
                            ].map((b, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-1.5">
                                    <b.icon size={20} style={{ color: GOLD }} />
                                    <span className="font-bangla text-[11px] text-gray-500">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ───── Tabs ───── */}
                <div className="mt-12 lg:mt-16">
                    <div className="flex gap-1 border-b overflow-x-auto no-scrollbar" style={{ borderColor: '#efe3cf' }}>
                        {([
                            ['description', 'বিবরণ'],
                            ['specs', 'বিস্তারিত তথ্য'],
                            ['reviews', `রিভিউ (${reviews.length})`],
                        ] as const).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className="font-bangla px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all relative"
                                style={{ color: activeTab === key ? MAROON : '#888' }}
                            >
                                {label}
                                {activeTab === key && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: MAROON }} />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="py-7">
                        {activeTab === 'description' && (
                            <div className="font-bangla text-gray-700 leading-relaxed whitespace-pre-line" style={{ fontSize: '0.97rem', maxWidth: 820 }}>
                                {product.description || 'এই পণ্যের কোনো বিবরণ যোগ করা হয়নি।'}
                            </div>
                        )}

                        {activeTab === 'specs' && (
                            <div className="max-w-2xl rounded-lg overflow-hidden" style={{ border: '1px solid #efe3cf' }}>
                                {productDetails.map((d, i) => (
                                    <div key={i} className="flex" style={{ background: i % 2 === 0 ? '#fff' : '#faf4ea' }}>
                                        <div className="font-bangla w-2/5 px-4 py-3 text-sm font-semibold text-gray-600">{d.key}</div>
                                        <div className="font-bangla w-3/5 px-4 py-3 text-sm text-gray-800">{d.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* summary + form */}
                                <div className="lg:col-span-1">
                                    <div className="rounded-lg p-5 mb-5" style={{ background: '#fff', border: '1px solid #efe3cf' }}>
                                        <div className="text-center mb-4">
                                            <div className="font-bold" style={{ color: MAROON, fontSize: '2.5rem', fontFamily: "'Poppins',sans-serif" }}>
                                                {avgRating ? avgRating.toFixed(1) : '0.0'}
                                            </div>
                                            <div className="flex justify-center gap-0.5 my-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <FiStar key={s} size={16} style={{ color: GOLD, fill: s <= Math.round(avgRating) ? GOLD : 'none' }} />
                                                ))}
                                            </div>
                                            <p className="font-bangla text-xs text-gray-500">{reviews.length} টি রিভিউ</p>
                                        </div>
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const cnt = ratingBreakdown[star - 1];
                                            const pct = reviews.length ? (cnt / reviews.length) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-xs text-gray-500 w-3">{star}</span>
                                                    <FiStar size={11} style={{ color: GOLD, fill: GOLD }} />
                                                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GOLD }} />
                                                    </div>
                                                    <span className="text-xs text-gray-400 w-5 text-right">{cnt}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* write review */}
                                    <div className="rounded-lg p-5" style={{ background: '#fff', border: '1px solid #efe3cf' }}>
                                        <h4 className="font-bangla font-semibold text-sm mb-3" style={{ color: MAROON }}>রিভিউ লিখুন</h4>
                                        <div className="flex gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button key={s} onMouseEnter={() => setCmtHover(s)} onMouseLeave={() => setCmtHover(0)} onClick={() => setCmtRating(s)}>
                                                    <FiStar size={22} style={{ color: GOLD, fill: s <= (cmtHover || cmtRating) ? GOLD : 'none' }} />
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            value={cmtName} onChange={(e) => setCmtName(e.target.value)}
                                            placeholder="আপনার নাম (ঐচ্ছিক)"
                                            className="font-bangla w-full mb-2 px-3 py-2 rounded-md text-sm outline-none"
                                            style={{ border: '1px solid #e8ddcb' }}
                                        />
                                        <textarea
                                            value={cmtText} onChange={(e) => setCmtText(e.target.value)}
                                            placeholder="আপনার মতামত লিখুন..." rows={3}
                                            className="font-bangla w-full mb-3 px-3 py-2 rounded-md text-sm outline-none resize-none"
                                            style={{ border: '1px solid #e8ddcb' }}
                                        />
                                        <button
                                            onClick={handleReviewSubmit} disabled={cmtSubmitting}
                                            className="font-bangla w-full py-2.5 rounded-md text-white text-sm font-semibold disabled:opacity-60"
                                            style={{ background: MAROON }}
                                        >
                                            {cmtSubmitting ? 'জমা হচ্ছে...' : 'রিভিউ জমা দিন'}
                                        </button>
                                    </div>
                                </div>

                                {/* list */}
                                <div className="lg:col-span-2">
                                    {reviews.length === 0 ? (
                                        <div className="font-bangla text-center text-gray-400 py-16">
                                            এখনও কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই লিখুন!
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {reviews.map((r) => (
                                                <div key={r._id} className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #efe3cf' }}>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: MAROON }}>
                                                            {(r.userName || 'A').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bangla text-sm font-semibold text-gray-800">{r.userName || 'Anonymous'}</p>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map((s) => (
                                                                    <FiStar key={s} size={11} style={{ color: GOLD, fill: s <= r.rating ? GOLD : 'none' }} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {r.createdAt && (
                                                            <span className="ml-auto text-[11px] text-gray-400">
                                                                {new Date(r.createdAt).toLocaleDateString('bn-BD')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-bangla text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ───── Related products ───── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-14">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="block w-10 h-px" style={{ background: GOLD }} />
                                <span style={{ color: GOLD }} className="text-sm">◆</span>
                                <span className="block w-10 h-px" style={{ background: GOLD }} />
                            </div>
                            <h2 className="font-display font-bold" style={{ color: MAROON, fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>
                                সম্পর্কিত পণ্য
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {relatedProducts.slice(0, 8).map((p, i) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                    <ShopCard product={p} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* ───── Fullscreen image modal ───── */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style={{ background: 'rgba(20,8,6,0.95)' }}
                    onClick={() => { setIsFullscreen(false); setZoomed(false); }}
                >
                    <button
                        onClick={() => { setIsFullscreen(false); setZoomed(false); }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ background: 'rgba(255,255,255,0.12)' }}
                    >
                        <FiX size={20} />
                    </button>

                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p - 1 + allImages.length) % allImages.length); setZoomed(false); }}
                                className="absolute left-4 w-11 h-11 rounded-full flex items-center justify-center text-white"
                                style={{ background: 'rgba(255,255,255,0.12)' }}
                            >
                                <FiChevronLeft size={22} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p + 1) % allImages.length); setZoomed(false); }}
                                className="absolute right-4 w-11 h-11 rounded-full flex items-center justify-center text-white"
                                style={{ background: 'rgba(255,255,255,0.12)' }}
                            >
                                <FiChevronRight size={22} />
                            </button>
                        </>
                    )}

                    <img
                        src={mainImage}
                        alt={product.name}
                        onClick={(e) => { e.stopPropagation(); setZoomed(!zoomed); }}
                        className="max-h-[88vh] max-w-[90vw] object-contain transition-transform duration-300"
                        style={{ transform: zoomed ? 'scale(1.8)' : 'scale(1)', cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
                    />

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium" style={{ fontFamily: "'Poppins',sans-serif" }}>
                        {selectedImage + 1} / {allImages.length}
                    </div>
                </div>
            )}

            {/* ───── Share popup ───── */}
            {showShare && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(20,8,6,0.5)' }} onClick={() => setShowShare(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowShare(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><FiX size={16} /></button>
                        <h3 className="font-bangla font-bold text-lg mb-4" style={{ color: MAROON }}>শেয়ার করুন</h3>
                        <div className="grid grid-cols-5 gap-3 mb-4">
                            {[
                                { Icon: FaFacebookF, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}` },
                                { Icon: FaWhatsapp, color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}` },
                                { Icon: FaTelegramPlane, color: '#0088cc', url: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}` },
                                { Icon: FaXTwitter, color: '#000', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}` },
                                { Icon: FaLinkedinIn, color: '#0A66C2', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}` },
                                { Icon: FaEnvelope, color: '#777', url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(productUrl)}` },
                            ].map((s, i) => (
                                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-white"
                                    style={{ background: s.color }}>
                                    <s.Icon size={17} />
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 rounded-md p-1 pl-3" style={{ border: '1px solid #e8ddcb' }}>
                            <input readOnly value={productUrl} className="flex-1 text-xs text-gray-500 outline-none bg-transparent truncate" />
                            <button onClick={copyLink} className="font-bangla text-xs font-semibold text-white px-3 py-2 rounded-md flex items-center gap-1" style={{ background: MAROON }}>
                                <FiCopy size={12} /> {linkCopied ? 'কপি হয়েছে' : 'কপি'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ───── Inquiry modal ───── */}
            {showInquiry && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(20,8,6,0.5)' }} onClick={() => setShowInquiry(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowInquiry(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><FiX size={16} /></button>
                        <h3 className="font-bangla font-bold text-lg mb-1" style={{ color: MAROON }}>পণ্য সম্পর্কে জিজ্ঞাসা</h3>
                        <p className="font-bangla text-xs text-gray-500 mb-4">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব</p>
                        <div className="flex flex-col gap-3">
                            <input value={inqName} onChange={(e) => setInqName(e.target.value)} placeholder="আপনার নাম *" className="font-bangla px-3 py-2.5 rounded-md text-sm outline-none" style={{ border: '1px solid #e8ddcb' }} />
                            <input value={inqPhone} onChange={(e) => setInqPhone(e.target.value)} placeholder="ফোন নম্বর *" className="font-bangla px-3 py-2.5 rounded-md text-sm outline-none" style={{ border: '1px solid #e8ddcb' }} />
                            <input value={inqContact} onChange={(e) => setInqContact(e.target.value)} placeholder="ইমেইল (ঐচ্ছিক)" className="font-bangla px-3 py-2.5 rounded-md text-sm outline-none" style={{ border: '1px solid #e8ddcb' }} />
                            <textarea value={inqMessage} onChange={(e) => setInqMessage(e.target.value)} placeholder="আপনার প্রশ্ন *" rows={3} className="font-bangla px-3 py-2.5 rounded-md text-sm outline-none resize-none" style={{ border: '1px solid #e8ddcb' }} />
                            <button onClick={handleInquirySubmit} disabled={inqSubmitting} className="font-bangla py-3 rounded-md text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: MAROON }}>
                                <FiSend size={15} /> {inqSubmitting ? 'পাঠানো হচ্ছে...' : 'পাঠান'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
