"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux';
import { clearCart } from '@/redux/slices/cartSlice';
import { loginSuccess } from '@/redux/slices/authSlice';
import { useCreateOrderMutation, useGuestCheckoutMutation } from '@/redux/api/orderApi';
import { useValidateCouponMutation } from '@/redux/api/couponApi';
import {
    FiMapPin, FiChevronLeft, FiCheckCircle, FiTruck, FiCopy, FiShield, FiTag, FiX,
} from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

/* ── Brand palette ── */
const MAROON = '#5F0000';
const PRICE = '#800000';
const GOLD = '#C9A227';
const CREAM = '#FDF6EC';

/* ── Manual payment receiving numbers (personal/merchant) ── */
const PAYMENT_NUMBERS: Record<string, { number: string; label: string; logo: string; bg: string }> = {
    bkash: { number: '01700-000000', label: 'বিকাশ', logo: 'bKash', bg: '#E2136E' },
    nagad: { number: '01800-000000', label: 'নগদ', logo: 'Nagad', bg: '#EC1C24' },
};

const inputClass =
    "w-full px-4 py-3 bg-white rounded-md outline-none text-sm font-bangla text-gray-800 transition-colors focus:border-[#5F0000]";
const inputStyle: React.CSSProperties = { border: '1px solid #e3d6c0' };
const labelClass = "block text-sm font-bangla text-gray-600 mb-1.5";

const CheckoutPage = () => {
    const { items, totalPrice } = useAppSelector((state) => state.cart);
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();
    const [guestCheckout, { isLoading: isGuestPlacing }] = useGuestCheckoutMutation();
    const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();

    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', address: '', city: '', area: '',
        postalCode: '', country: 'Bangladesh', paymentMethod: 'cod',
    });
    const [transactionId, setTransactionId] = useState('');
    const [senderNumber, setSenderNumber] = useState('');
    const [copied, setCopied] = useState(false);

    /* ── Coupon state ── */
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

    const discount = appliedCoupon ? Math.min(appliedCoupon.discount, totalPrice) : 0;
    const payableTotal = Math.max(0, totalPrice - discount);

    const applyCoupon = async () => {
        const code = couponInput.trim();
        if (!code) { toast.error('কুপন কোড লিখুন'); return; }
        try {
            const res = await validateCoupon({ code, orderAmount: totalPrice }).unwrap();
            const d = res.data?.discount ?? 0;
            const realCode = res.data?.coupon?.code || code.toUpperCase();
            setAppliedCoupon({ code: realCode, discount: d });
            toast.success(`কুপন প্রয়োগ হয়েছে — ৳${d.toLocaleString('bn-BD')} ছাড়`, { icon: '🎟️' });
        } catch (err: any) {
            setAppliedCoupon(null);
            toast.error(err?.data?.message || 'কুপনটি বৈধ নয়');
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || prev.fullName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
                address: user.address?.street || prev.address,
                city: user.address?.city || prev.city,
                area: user.address?.state || prev.area,
                postalCode: user.address?.zipCode || prev.postalCode,
                country: user.address?.country || prev.country,
            }));
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (items.length === 0) router.push('/cart');
    }, [items, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isManual = formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad';

    const copyNumber = (num: string) => {
        navigator.clipboard?.writeText(num.replace(/[^0-9]/g, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
            toast.error('অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন');
            return;
        }
        if (isManual && (!transactionId.trim() || !senderNumber.trim())) {
            toast.error('পেমেন্ট ট্রানজেকশন আইডি ও যে নম্বর থেকে পাঠিয়েছেন তা দিন');
            return;
        }

        const orderPayload: any = {
            items: items.map(item => ({ product: item.productId, quantity: item.quantity })),
            shippingAddress: {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                area: formData.area,
                city: formData.city,
                postalCode: formData.postalCode,
            },
            paymentMethod: formData.paymentMethod,
        };
        if (appliedCoupon) orderPayload.couponCode = appliedCoupon.code;
        if (isManual) {
            orderPayload.transactionId = transactionId.trim();
            orderPayload.senderNumber = senderNumber.trim();
        }

        try {
            if (isAuthenticated) {
                await createOrder(orderPayload).unwrap();
                dispatch(clearCart());
                toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে!', { duration: 5000, icon: '🛍️' });
                router.push('/checkout/success');
            } else {
                const result = await guestCheckout(orderPayload).unwrap();
                dispatch(clearCart());
                if (result.data?.accessToken && result.data?.user) {
                    const u = result.data.user;
                    dispatch(loginSuccess({
                        user: {
                            id: u._id, name: `${u.firstName} ${u.lastName}`.trim(),
                            email: u.email, phone: u.phone || '', role: u.role || 'user',
                        },
                        token: result.data.accessToken,
                    }));
                }
                toast.success(
                    result.data?.isNewUser
                        ? 'অর্ডার সম্পন্ন! আপনার ইমেইল দিয়ে একটি অ্যাকাউন্ট তৈরি হয়েছে।'
                        : 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!',
                    { duration: 6000, icon: '🎉' }
                );
                router.push('/checkout/success');
            }
        } catch (err: any) {
            const data = err?.data;
            if (data?.errorMessages?.length) {
                data.errorMessages.forEach((e: any) => toast.error(`${e.path ? e.path + ': ' : ''}${e.message}`, { duration: 6000 }));
            } else {
                toast.error(data?.message || 'অর্ডার সম্পন্ন করা যায়নি, আবার চেষ্টা করুন', { duration: 5000 });
            }
        }
    };

    const isSubmitting = isPlacingOrder || isGuestPlacing;
    if (items.length === 0) return null;

    const payOptions = [
        { value: 'cod', title: 'ক্যাশ অন ডেলিভারি', sub: 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন' },
        { value: 'bkash', title: 'বিকাশ', sub: 'ম্যানুয়াল পেমেন্ট — Send Money' },
        { value: 'nagad', title: 'নগদ', sub: 'ম্যানুয়াল পেমেন্ট — Send Money' },
    ];

    return (
        <div style={{ background: CREAM, minHeight: '100vh', paddingBottom: '4rem' }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-bangla text-gray-500 hover:text-[#5F0000] mb-6 transition-colors group">
                    <FiChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    কার্টে ফিরে যান
                </Link>

                {/* Title */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="block w-10 h-px" style={{ background: GOLD }} />
                        <span style={{ color: GOLD }} className="text-sm">◆</span>
                        <span className="block w-10 h-px" style={{ background: GOLD }} />
                    </div>
                    <h1 className="font-display font-bold" style={{ color: MAROON, fontSize: 'clamp(1.7rem,4vw,2.4rem)' }}>
                        অর্ডার সম্পন্ন করুন
                    </h1>
                    <p className="font-bangla text-gray-500 mt-1 text-sm">আপনার তথ্য দিন এবং অর্ডার নিশ্চিত করুন</p>
                </div>

                {!isAuthenticated && (
                    <div className="mb-8 rounded-lg p-4 flex items-start gap-3 max-w-3xl mx-auto" style={{ background: '#fff7e9', border: `1px solid ${GOLD}55` }}>
                        <FiShield size={18} style={{ color: GOLD }} className="mt-0.5 shrink-0" />
                        <p className="font-bangla text-sm text-gray-600 leading-relaxed">
                            অ্যাকাউন্ট নেই? সমস্যা নেই — নিচে তথ্য দিন, আমরা স্বয়ংক্রিয়ভাবে আপনার জন্য একটি অ্যাকাউন্ট তৈরি করব।
                            আপনার <span style={{ color: MAROON }}>ইমেইল</span> হবে লগইন আইডি ও পাসওয়ার্ড।{' '}
                            <Link href="/login?redirect=/checkout" className="underline" style={{ color: MAROON }}>লগইন করুন</Link>
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-7">

                    {/* ── Left: details + payment ── */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Shipping */}
                        <section className="bg-white rounded-lg p-6 sm:p-7" style={{ border: '1px solid #efe3cf' }}>
                            <div className="flex items-center gap-2.5 mb-5">
                                <FiMapPin size={18} style={{ color: MAROON }} />
                                <h2 className="font-bangla font-semibold text-lg text-gray-800">ডেলিভারি তথ্য</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>পুরো নাম <span style={{ color: PRICE }}>*</span></label>
                                    <input name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="আপনার নাম লিখুন" />
                                </div>
                                <div>
                                    <label className={labelClass}>মোবাইল নম্বর <span style={{ color: PRICE }}>*</span></label>
                                    <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="01XXXXXXXXX" />
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        ইমেইল {!isAuthenticated && <span className="text-xs" style={{ color: GOLD }}>(লগইন আইডি)</span>}
                                    </label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="email@example.com" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>ঠিকানা <span style={{ color: PRICE }}>*</span></label>
                                    <input name="address" value={formData.address} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="বাসা নং, রোড, এলাকা" />
                                </div>
                                <div>
                                    <label className={labelClass}>শহর / জেলা <span style={{ color: PRICE }}>*</span></label>
                                    <input name="city" value={formData.city} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="ঢাকা" />
                                </div>
                                <div>
                                    <label className={labelClass}>থানা / এলাকা</label>
                                    <input name="area" value={formData.area} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="মিরপুর, ধানমন্ডি" />
                                </div>
                                <div>
                                    <label className={labelClass}>পোস্টাল কোড</label>
                                    <input name="postalCode" value={formData.postalCode} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="1200" />
                                </div>
                                <div>
                                    <label className={labelClass}>দেশ</label>
                                    <select name="country" value={formData.country} onChange={handleChange} className={inputClass} style={inputStyle}>
                                        <option value="Bangladesh">বাংলাদেশ</option>
                                        <option value="International">আন্তর্জাতিক</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Payment */}
                        <section className="bg-white rounded-lg p-6 sm:p-7" style={{ border: '1px solid #efe3cf' }}>
                            <div className="flex items-center gap-2.5 mb-5">
                                <FiTruck size={18} style={{ color: MAROON }} />
                                <h2 className="font-bangla font-semibold text-lg text-gray-800">পেমেন্ট পদ্ধতি</h2>
                            </div>

                            <div className="space-y-3">
                                {payOptions.map((opt) => {
                                    const active = formData.paymentMethod === opt.value;
                                    return (
                                        <label
                                            key={opt.value}
                                            className="flex items-center gap-3 p-4 rounded-md cursor-pointer transition-all"
                                            style={{
                                                border: `1px solid ${active ? MAROON : '#e3d6c0'}`,
                                                background: active ? '#fdf2f2' : '#fff',
                                            }}
                                        >
                                            <input
                                                type="radio" name="paymentMethod" value={opt.value}
                                                checked={active} onChange={handleChange}
                                                style={{ accentColor: MAROON, width: 16, height: 16 }}
                                            />
                                            <div className="flex-1">
                                                <p className="font-bangla text-sm text-gray-800">{opt.title}</p>
                                                <p className="font-bangla text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                                            </div>
                                            {PAYMENT_NUMBERS[opt.value] && (
                                                <span
                                                    className="text-white text-xs font-semibold px-2.5 py-1 rounded"
                                                    style={{ background: PAYMENT_NUMBERS[opt.value].bg, fontFamily: "'Poppins',sans-serif" }}
                                                >
                                                    {PAYMENT_NUMBERS[opt.value].logo}
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>

                            {/* Manual payment instructions */}
                            {isManual && (
                                <div className="mt-5 rounded-md p-5" style={{ background: '#faf4ea', border: '1px dashed #d9bd80' }}>
                                    <p className="font-bangla text-sm text-gray-700 mb-3 leading-relaxed">
                                        নিচের <span style={{ color: MAROON }}>{PAYMENT_NUMBERS[formData.paymentMethod].label}</span> নম্বরে{' '}
                                        <span style={{ color: PRICE }}>৳{payableTotal.toLocaleString('bn-BD')}</span> টাকা
                                        <span className="font-semibold"> Send Money</span> করুন, এরপর ট্রানজেকশন আইডি ও আপনার নম্বরটি দিন।
                                    </p>

                                    <div className="flex items-center justify-between rounded-md px-4 py-3 mb-4" style={{ background: '#fff', border: '1px solid #e3d6c0' }}>
                                        <div>
                                            <span className="font-bangla text-[11px] text-gray-400 block">{PAYMENT_NUMBERS[formData.paymentMethod].label} নম্বর (Personal)</span>
                                            <span className="font-semibold text-base" style={{ color: MAROON, fontFamily: "'Poppins',sans-serif" }}>
                                                {PAYMENT_NUMBERS[formData.paymentMethod].number}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => copyNumber(PAYMENT_NUMBERS[formData.paymentMethod].number)}
                                            className="font-bangla flex items-center gap-1.5 text-xs text-white px-3 py-2 rounded-md"
                                            style={{ background: MAROON }}
                                        >
                                            <FiCopy size={13} /> {copied ? 'কপি হয়েছে' : 'কপি'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>ট্রানজেকশন আইডি (TrxID) <span style={{ color: PRICE }}>*</span></label>
                                            <input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className={inputClass} style={inputStyle} placeholder="যেমন: 9F2A1B7C8D" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>যে নম্বর থেকে পাঠিয়েছেন <span style={{ color: PRICE }}>*</span></label>
                                            <input value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} className={inputClass} style={inputStyle} placeholder="01XXXXXXXXX" />
                                        </div>
                                    </div>
                                    <p className="font-bangla text-[11px] text-gray-400 mt-3">
                                        * পেমেন্ট যাচাইয়ের পর আপনার অর্ডারটি নিশ্চিত করা হবে।
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* ── Right: order summary ── */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-lg p-6 sm:p-7 lg:sticky lg:top-28" style={{ border: '1px solid #efe3cf' }}>
                            <h2 className="font-bangla font-semibold text-lg text-gray-800 mb-5 pb-4" style={{ borderBottom: '1px solid #f0e6d4' }}>
                                অর্ডার সারাংশ
                            </h2>

                            <div className="space-y-4 mb-5 max-h-[300px] overflow-y-auto no-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-14 h-16 rounded-md overflow-hidden shrink-0" style={{ background: '#f5efe6', border: '1px solid #efe3cf' }}>
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bangla text-sm text-gray-800 line-clamp-2 leading-snug">{item.name}</h4>
                                            <p className="font-bangla text-xs text-gray-400 mt-0.5">
                                                পরিমাণ: {item.quantity}
                                                {item.color ? ` · ${item.color}` : ''}{item.size ? ` · ${item.size}` : ''}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-sm" style={{ color: PRICE, fontFamily: "'Poppins',sans-serif" }}>
                                            ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* ── Coupon ── */}
                            <div className="py-4" style={{ borderTop: '1px solid #f0e6d4' }}>
                                {!appliedCoupon ? (
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <FiTag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }}
                                                placeholder="কুপন কোড"
                                                className="w-full pl-9 pr-3 py-2.5 bg-white rounded-md outline-none text-sm text-gray-800 uppercase tracking-wide focus:border-[#5F0000]"
                                                style={{ border: '1px solid #e3d6c0', fontFamily: "'Poppins',sans-serif" }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={applyCoupon}
                                            disabled={isValidatingCoupon}
                                            className="font-bangla px-4 py-2.5 rounded-md text-sm text-white font-semibold disabled:opacity-60 shrink-0"
                                            style={{ background: GOLD }}
                                        >
                                            {isValidatingCoupon ? '...' : 'প্রয়োগ'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between rounded-md px-3 py-2.5" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                        <div className="flex items-center gap-2">
                                            <FiTag size={14} className="text-green-600" />
                                            <span className="font-semibold text-sm text-green-700" style={{ fontFamily: "'Poppins',sans-serif" }}>{appliedCoupon.code}</span>
                                            <span className="font-bangla text-xs text-green-600">প্রয়োগ হয়েছে</span>
                                        </div>
                                        <button type="button" onClick={removeCoupon} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2.5 py-4" style={{ borderTop: '1px solid #f0e6d4' }}>
                                <div className="flex justify-between font-bangla text-sm">
                                    <span className="text-gray-500">সাবটোটাল</span>
                                    <span className="text-gray-800" style={{ fontFamily: "'Poppins',sans-serif" }}>৳{totalPrice.toLocaleString('bn-BD')}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between font-bangla text-sm">
                                        <span className="text-gray-500">কুপন ছাড়</span>
                                        <span className="text-green-600" style={{ fontFamily: "'Poppins',sans-serif" }}>− ৳{discount.toLocaleString('bn-BD')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bangla text-sm">
                                    <span className="text-gray-500">ডেলিভারি চার্জ</span>
                                    <span className="text-green-600">ফ্রি</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end py-4" style={{ borderTop: '1px solid #f0e6d4' }}>
                                <span className="font-bangla text-gray-600">সর্বমোট</span>
                                <span className="font-bold" style={{ color: PRICE, fontSize: '1.6rem', fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
                                    ৳{payableTotal.toLocaleString('bn-BD')}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="font-bangla w-full flex items-center justify-center gap-2 py-4 mt-2 rounded-md text-white text-base font-semibold transition-all disabled:opacity-60"
                                style={{ background: MAROON }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        অর্ডার হচ্ছে...
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle size={18} />
                                        অর্ডার কনফার্ম করুন
                                    </>
                                )}
                            </button>

                            <p className="font-bangla text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
                                অর্ডার করার মাধ্যমে আপনি আমাদের{' '}
                                <Link href="/terms" className="underline" style={{ color: MAROON }}>শর্তাবলী</Link> মেনে নিচ্ছেন
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
