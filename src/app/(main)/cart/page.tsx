"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux';
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart } from '@/redux/slices/cartSlice';
import {
    FiTrash2, FiChevronLeft, FiAlertTriangle, FiMinus, FiPlus,
    FiShoppingBag, FiTruck, FiShield, FiCheckCircle,
} from 'react-icons/fi';
import EmptyState from '@/components/shared/EmptyState';
import { toast } from 'react-hot-toast';
import { numberToWords } from '@/utils/numberToWords';

/* ── Brand palette ── */
const MAROON = '#5F0000';
const PRICE = '#800000';
const GOLD = '#C9A227';
const CREAM = '#FDF6EC';

const CartPage = () => {
    const { items, totalPrice, totalQuantity } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    /* ═══ EMPTY CART ═══ */
    if (items.length === 0) {
        return (
            <div style={{ background: CREAM, minHeight: '100vh' }} className="py-20">
                <EmptyState
                    title="আপনার কার্ট খালি"
                    description="মনে হচ্ছে আপনি এখনও কোনো পণ্য কার্টে যোগ করেননি।"
                    buttonText="কেনাকাটা শুরু করুন"
                    buttonLink="/"
                />
            </div>
        );
    }

    const handleClearCart = () => {
        if (window.confirm('আপনি কি নিশ্চিত কার্ট খালি করতে চান?')) {
            dispatch(clearCart());
            toast.success('কার্ট খালি করা হয়েছে');
        }
    };

    return (
        <div style={{ background: CREAM, minHeight: '100vh', paddingBottom: '4rem' }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bangla text-gray-500 hover:text-[#5F0000] mb-6 transition-colors group">
                    <FiChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    কেনাকাটায় ফিরে যান
                </Link>

                {/* ═══ HEADER ═══ */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="block w-10 h-px" style={{ background: GOLD }} />
                        <span style={{ color: GOLD }} className="text-sm">◆</span>
                        <span className="block w-10 h-px" style={{ background: GOLD }} />
                    </div>
                    <h1 className="font-display font-bold" style={{ color: MAROON, fontSize: 'clamp(1.7rem,4vw,2.4rem)' }}>
                        শপিং কার্ট
                    </h1>
                    <p className="font-bangla text-gray-500 mt-1 text-sm">
                        আপনার কার্টে {totalQuantity.toLocaleString('bn-BD')} টি পণ্য রয়েছে
                    </p>
                </div>

                {/* ═══ MAIN LAYOUT ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

                    {/* ═══ LEFT: ITEMS ═══ */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid #efe3cf' }}>

                            {/* Desktop header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 font-bangla text-xs text-gray-400" style={{ background: '#faf4ea', borderBottom: '1px solid #efe3cf' }}>
                                <div className="col-span-6">পণ্য</div>
                                <div className="col-span-2 text-center">পরিমাণ</div>
                                <div className="col-span-2 text-center">একক মূল্য</div>
                                <div className="col-span-2 text-right">মোট</div>
                            </div>

                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group"
                                    style={{ borderBottom: index < items.length - 1 ? '1px solid #f0e6d4' : 'none' }}
                                >
                                    {/* Desktop */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-5">
                                        <div className="col-span-6 flex items-center gap-4">
                                            <div className="w-[68px] h-[84px] rounded-md overflow-hidden shrink-0" style={{ background: '#f5efe6', border: '1px solid #efe3cf' }}>
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bangla text-sm text-gray-800 line-clamp-2 leading-snug">{item.name}</h3>
                                                {(item.color || item.size) && (
                                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                        {item.color && (
                                                            <span className="font-bangla inline-flex items-center gap-1.5 text-[11px] text-gray-500 px-2.5 py-1 rounded-full" style={{ background: '#faf4ea', border: '1px solid #efe3cf' }}>
                                                                <span className="w-2.5 h-2.5 rounded-full border border-gray-200 shrink-0" style={{ background: item.colorHex || '#ccc' }} />
                                                                {item.color}
                                                            </span>
                                                        )}
                                                        {item.size && (
                                                            <span className="font-bangla text-[11px] text-gray-500 px-2.5 py-1 rounded-full" style={{ background: '#faf4ea', border: '1px solid #efe3cf' }}>
                                                                {item.size}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex justify-center">
                                            <div className="flex items-center rounded-md overflow-hidden" style={{ border: '1px solid #e3d6c0' }}>
                                                <button onClick={() => dispatch(decreaseQuantity(item.id))} disabled={item.quantity <= 1} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30" style={{ color: MAROON }}><FiMinus size={12} /></button>
                                                <div className="w-11 h-9 flex items-center justify-center text-sm text-gray-800" style={{ borderLeft: '1px solid #e3d6c0', borderRight: '1px solid #e3d6c0', fontFamily: "'Poppins',sans-serif" }}>{item.quantity}</div>
                                                <button onClick={() => dispatch(increaseQuantity(item.id))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50" style={{ color: MAROON }}><FiPlus size={12} /></button>
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-center">
                                            <span className="text-sm text-gray-600" style={{ fontFamily: "'Poppins',sans-serif" }}>৳{item.price.toLocaleString('bn-BD')}</span>
                                        </div>

                                        <div className="col-span-2 flex items-center justify-end gap-3">
                                            <span className="text-sm font-semibold" style={{ color: PRICE, fontFamily: "'Poppins',sans-serif" }}>৳{(item.price * item.quantity).toLocaleString('bn-BD')}</span>
                                            <button onClick={() => setDeleteConfirmId(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all md:opacity-0 md:group-hover:opacity-100">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile */}
                                    <div className="md:hidden p-4">
                                        <div className="flex gap-3">
                                            <div className="w-20 h-24 rounded-md overflow-hidden shrink-0" style={{ background: '#f5efe6', border: '1px solid #efe3cf' }}>
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-bangla text-sm text-gray-800 line-clamp-2 leading-snug">{item.name}</h3>
                                                    <button onClick={() => setDeleteConfirmId(item.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 shrink-0">
                                                        <FiTrash2 size={13} />
                                                    </button>
                                                </div>
                                                {(item.color || item.size) && (
                                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                        {item.color && (
                                                            <span className="font-bangla inline-flex items-center gap-1 text-[10px] text-gray-500 px-2 py-0.5 rounded-full" style={{ background: '#faf4ea', border: '1px solid #efe3cf' }}>
                                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.colorHex || '#ccc' }} />
                                                                {item.color}
                                                            </span>
                                                        )}
                                                        {item.size && (
                                                            <span className="font-bangla text-[10px] text-gray-500 px-2 py-0.5 rounded-full" style={{ background: '#faf4ea', border: '1px solid #efe3cf' }}>{item.size}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid #f0e6d4' }}>
                                            <div className="flex items-center rounded-md overflow-hidden" style={{ border: '1px solid #e3d6c0' }}>
                                                <button onClick={() => dispatch(decreaseQuantity(item.id))} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30" style={{ color: MAROON }}><FiMinus size={11} /></button>
                                                <div className="w-10 h-8 flex items-center justify-center text-xs text-gray-800" style={{ borderLeft: '1px solid #e3d6c0', borderRight: '1px solid #e3d6c0', fontFamily: "'Poppins',sans-serif" }}>{item.quantity}</div>
                                                <button onClick={() => dispatch(increaseQuantity(item.id))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50" style={{ color: MAROON }}><FiPlus size={11} /></button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bangla text-[11px] text-gray-400">৳{item.price.toLocaleString('bn-BD')} × {item.quantity}</p>
                                                <p className="text-base font-semibold" style={{ color: PRICE, fontFamily: "'Poppins',sans-serif" }}>৳{(item.price * item.quantity).toLocaleString('bn-BD')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-5">
                            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bangla transition-all group" style={{ color: MAROON }}>
                                <FiChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                কেনাকাটা চালিয়ে যান
                            </Link>
                            <button onClick={handleClearCart} className="inline-flex items-center gap-1.5 text-sm font-bangla text-gray-400 hover:text-red-500 transition-colors">
                                <FiTrash2 size={13} /> কার্ট খালি করুন
                            </button>
                        </div>
                    </div>

                    {/* ═══ RIGHT: SUMMARY ═══ */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-lg lg:sticky lg:top-28" style={{ border: '1px solid #efe3cf' }}>
                            <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #f0e6d4' }}>
                                <h2 className="font-bangla font-semibold text-lg text-gray-800">অর্ডার সারাংশ</h2>
                            </div>

                            <div className="px-6 py-5 space-y-3">
                                <div className="flex justify-between font-bangla text-sm">
                                    <span className="text-gray-500">সাবটোটাল ({totalQuantity.toLocaleString('bn-BD')} টি পণ্য)</span>
                                    <span className="text-gray-800" style={{ fontFamily: "'Poppins',sans-serif" }}>৳{totalPrice.toLocaleString('bn-BD')}</span>
                                </div>
                                <div className="flex justify-between font-bangla text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5"><FiTruck size={13} /> ডেলিভারি চার্জ</span>
                                    <span className="text-green-600">ফ্রি</span>
                                </div>

                                <div className="pt-4 mt-1" style={{ borderTop: '1px dashed #d9bd80' }}>
                                    <div className="flex justify-between items-end">
                                        <span className="font-bangla text-gray-600">সর্বমোট</span>
                                        <span className="font-bold" style={{ color: PRICE, fontSize: '1.6rem', fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
                                            ৳{totalPrice.toLocaleString('bn-BD')}
                                        </span>
                                    </div>
                                    <p className="font-bangla text-[11px] text-gray-400 mt-2 leading-relaxed">{numberToWords(totalPrice)}</p>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <Link
                                    href="/checkout"
                                    className="font-bangla w-full flex items-center justify-center gap-2 py-3.5 rounded-md text-white text-base font-semibold transition-all hover:opacity-95"
                                    style={{ background: MAROON }}
                                >
                                    <FiShoppingBag size={17} />
                                    চেকআউট করুন
                                </Link>
                            </div>

                            <div className="px-6 pb-6 pt-4" style={{ borderTop: '1px solid #f0e6d4' }}>
                                <div className="flex items-center justify-center gap-6 text-gray-400">
                                    {[
                                        { icon: FiShield, label: 'নিরাপদ' },
                                        { icon: FiTruck, label: 'ডেলিভারি' },
                                        { icon: FiCheckCircle, label: 'মানসম্মত' },
                                    ].map((b, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && <span className="w-px h-8" style={{ background: '#f0e6d4' }} />}
                                            <div className="flex flex-col items-center gap-1.5">
                                                <b.icon size={16} style={{ color: GOLD }} />
                                                <span className="font-bangla text-[10px]">{b.label}</span>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ DELETE CONFIRMATION ═══ */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ background: 'rgba(20,8,6,0.5)' }} onClick={() => setDeleteConfirmId(null)}>
                    <div className="bg-white rounded-2xl p-7 max-w-[360px] w-full text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <FiAlertTriangle size={25} className="text-red-500" />
                        </div>
                        <h3 className="font-bangla font-semibold text-lg text-gray-800 mb-2">পণ্যটি সরাবেন?</h3>
                        <p className="font-bangla text-sm text-gray-500 mb-6 leading-relaxed">আপনি কি নিশ্চিত এই পণ্যটি কার্ট থেকে সরিয়ে ফেলতে চান?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirmId(null)} className="font-bangla flex-1 py-3 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-all" style={{ border: '1px solid #e3d6c0' }}>
                                না, থাক
                            </button>
                            <button
                                onClick={() => {
                                    dispatch(removeFromCart(deleteConfirmId));
                                    toast.success('পণ্যটি সরানো হয়েছে');
                                    setDeleteConfirmId(null);
                                }}
                                className="font-bangla flex-1 py-3 rounded-md text-sm text-white hover:opacity-95 transition-all"
                                style={{ background: '#dc2626' }}
                            >
                                হ্যাঁ, সরান
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
