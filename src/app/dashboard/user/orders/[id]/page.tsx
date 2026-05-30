"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiArrowLeft,
    FiPackage,
    FiClock,
    FiCheckCircle,
    FiTruck,
    FiXCircle,
    FiMapPin,
    FiCreditCard,
    FiPhone,
    FiMail,
    FiUser,
    FiCopy,
} from 'react-icons/fi';
import { useGetOrderByIdQuery, useCancelOrderMutation } from '@/redux/api/orderApi';
import { toast } from 'react-hot-toast';

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const statusIcons: Record<string, React.ElementType> = {
    pending: FiClock,
    confirmed: FiCheckCircle,
    processing: FiPackage,
    shipped: FiTruck,
    delivered: FiCheckCircle,
    cancelled: FiXCircle,
};
const statusLabels: Record<string, string> = {
    pending: 'অপেক্ষমাণ', confirmed: 'নিশ্চিত', processing: 'প্রস্তুত হচ্ছে',
    shipped: 'পাঠানো হয়েছে', delivered: 'ডেলিভারড', cancelled: 'বাতিল', returned: 'ফেরত',
};
const paymentLabels: Record<string, string> = {
    pending: 'অপেক্ষমাণ', paid: 'পরিশোধিত', failed: 'ব্যর্থ', refunded: 'রিফান্ড',
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    // Fetch the single order by id
    const { data: orderData, isLoading } = useGetOrderByIdQuery(orderId);
    const order = orderData?.data;
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

    const currentStepIndex = statusSteps.indexOf(order?.status || 'pending');
    const canCancel = order && ['pending', 'confirmed'].includes(order.status);

    const copyOrderId = () => {
        navigator.clipboard.writeText(order?.orderId || order?.orderNumber || orderId);
    };

    const handleCancel = async () => {
        if (!window.confirm('আপনি কি নিশ্চিতভাবে এই অর্ডারটি বাতিল করতে চান?')) return;
        try {
            await cancelOrder(orderId).unwrap();
            toast.success('অর্ডারটি বাতিল করা হয়েছে');
        } catch (err: any) {
            toast.error(err?.data?.message || 'অর্ডার বাতিল করা যায়নি');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-3"></div>
                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                    <div className="h-20 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                <FiPackage size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-600 mb-1 font-bangla">অর্ডার পাওয়া যায়নি</h3>
                <p className="text-sm text-gray-400 mb-4 font-bangla">আপনি যে অর্ডারটি খুঁজছেন তা নেই</p>
                <Link href="/dashboard/user/orders" className="text-[var(--color-primary)] font-bold text-sm hover:underline font-bangla">
                    ← আমার অর্ডারে ফিরে যান
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--color-primary)] mb-4 font-semibold transition-colors font-bangla"
                >
                    <FiArrowLeft size={16} />
                    আমার অর্ডারে ফিরে যান
                </button>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Poppins',sans-serif" }}>
                                {order.orderId || order.orderNumber || `#${orderId.slice(-8).toUpperCase()}`}
                            </h1>
                            <button onClick={copyOrderId} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-gray-600 transition-all">
                                <FiCopy size={14} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 font-bangla">
                            অর্ডার তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold font-bangla ${
                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-blue-50 text-blue-700'
                    }`}>
                        {React.createElement(statusIcons[order.status] || FiClock, { size: 16 })}
                        {statusLabels[order.status] || order.status}
                    </span>
                </div>

                {canCancel && (
                    <div className="mt-5 pt-4 border-t border-gray-50 flex justify-end">
                        <button
                            onClick={handleCancel}
                            disabled={isCancelling}
                            className="font-bangla flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-60"
                        >
                            <FiXCircle size={15} />
                            {isCancelling ? 'বাতিল হচ্ছে...' : 'অর্ডার বাতিল করুন'}
                        </button>
                    </div>
                )}
            </div>

            {/* Status Timeline */}
            {order.status !== 'cancelled' && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-base font-bold text-gray-800 mb-6 font-bangla">অর্ডারের অগ্রগতি</h2>
                    <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100">
                            <div
                                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[#1a6b3c] transition-all duration-500"
                                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                            ></div>
                        </div>

                        {statusSteps.map((step, index) => {
                            const Icon = statusIcons[step];
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            return (
                                <div key={step} className="flex flex-col items-center relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        isCompleted
                                            ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20'
                                            : 'bg-gray-100 text-gray-300'
                                    } ${isCurrent ? 'ring-4 ring-[var(--color-primary)]/10' : ''}`}>
                                        <Icon size={18} />
                                    </div>
                                    <p className={`text-xs mt-2 font-semibold font-bangla ${
                                        isCompleted ? 'text-[var(--color-primary)]' : 'text-gray-300'
                                    }`}>
                                        {statusLabels[step] || step}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <h2 className="text-base font-bold text-gray-800 font-bangla">অর্ডারকৃত পণ্য ({(order.items?.length || 0).toLocaleString('bn-BD')})</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 px-6 py-4">
                                    <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <FiPackage size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate font-bangla">{item.name}</p>
                                        {(item.color || item.size) && (
                                            <p className="text-xs text-gray-400 mt-0.5 font-bangla">
                                                {[item.color, item.size].filter(Boolean).join(' · ')}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1 font-bangla">পরিমাণ: {(item.quantity || 0).toLocaleString('bn-BD')}</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800 whitespace-nowrap" style={{ fontFamily: "'Poppins',sans-serif" }}>
                                        ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString('bn-BD')}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="px-6 py-4 bg-gray-50/50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-bangla">সাবটোটাল</span>
                                <span className="font-semibold text-gray-600" style={{ fontFamily: "'Poppins',sans-serif" }}>৳{(order.subtotal || order.total)?.toLocaleString('bn-BD')}</span>
                            </div>
                            {order.shippingCost > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bangla">ডেলিভারি চার্জ</span>
                                    <span className="font-semibold text-gray-600" style={{ fontFamily: "'Poppins',sans-serif" }}>৳{order.shippingCost?.toLocaleString('bn-BD')}</span>
                                </div>
                            )}
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bangla">কুপন ছাড়{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                                    <span className="font-semibold text-emerald-600" style={{ fontFamily: "'Poppins',sans-serif" }}>−৳{order.discount?.toLocaleString('bn-BD')}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base pt-2 border-t border-gray-200 mt-2">
                                <span className="font-bold text-gray-700 font-bangla">সর্বমোট</span>
                                <span className="font-bold text-[var(--color-primary)] text-lg" style={{ fontFamily: "'Poppins',sans-serif" }}>৳{order.total?.toLocaleString('bn-BD')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Info */}
                <div className="space-y-4">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <FiMapPin size={16} className="text-[var(--color-primary)]" />
                            <h3 className="text-sm font-bold text-gray-800 font-bangla">ডেলিভারি ঠিকানা</h3>
                        </div>
                        {order.shippingAddress ? (
                            <div className="text-sm text-gray-500 space-y-1.5 font-bangla">
                                <p className="font-semibold text-gray-700">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{[order.shippingAddress.city, order.shippingAddress.area].filter(Boolean).join(', ')}</p>
                                {order.shippingAddress.postalCode && <p>{order.shippingAddress.postalCode}</p>}
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50 text-xs text-gray-400">
                                    <FiPhone size={12} />
                                    {order.shippingAddress.phone}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 font-bangla">ঠিকানার তথ্য নেই</p>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <FiCreditCard size={16} className="text-[var(--color-primary)]" />
                            <h3 className="text-sm font-bold text-gray-800 font-bangla">পেমেন্ট</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-bangla">পদ্ধতি</span>
                                <span className="font-semibold text-gray-700 uppercase">{order.paymentMethod || 'COD'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-bangla">অবস্থা</span>
                                <span className={`font-semibold text-xs px-2 py-0.5 rounded-md font-bangla ${
                                    order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                                    order.paymentStatus === 'refunded' ? 'bg-blue-50 text-blue-700' :
                                    order.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
                                    'bg-amber-50 text-amber-700'
                                }`}>
                                    {paymentLabels[order.paymentStatus] || 'অপেক্ষমাণ'}
                                </span>
                            </div>
                            {order.transactionId && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bangla">TrxID</span>
                                    <span className="font-mono text-xs text-gray-600">{order.transactionId}</span>
                                </div>
                            )}
                            {order.senderNumber && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bangla">প্রেরক নম্বর</span>
                                    <span className="font-mono text-xs text-gray-600">{order.senderNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    {order.timeline && order.timeline.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-800 mb-4 font-bangla">কার্যক্রম</h3>
                            <div className="space-y-4">
                                {[...order.timeline].reverse().map((event: any, idx: number) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 font-bangla">{statusLabels[event.status] || event.status}</p>
                                            {event.note && <p className="text-[11px] text-gray-500 mt-0.5 font-bangla">{event.note}</p>}
                                            <p className="text-[11px] text-gray-400 mt-0.5 font-bangla">
                                                {new Date(event.createdAt || event.timestamp || event.date).toLocaleString('bn-BD')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
