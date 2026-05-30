"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FiPackage,
    FiSearch,
    FiChevronRight,
    FiClock,
    FiCheckCircle,
    FiTruck,
    FiXCircle,
    FiShoppingBag,
    FiFilter,
} from 'react-icons/fi';
import { useGetMyOrdersQuery } from '@/redux/api/orderApi';

const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: FiClock, label: 'অপেক্ষমাণ' },
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', icon: FiCheckCircle, label: 'নিশ্চিত' },
    processing: { bg: 'bg-purple-50', text: 'text-purple-700', icon: FiPackage, label: 'প্রস্তুত হচ্ছে' },
    shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: FiTruck, label: 'পাঠানো হয়েছে' },
    delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: FiCheckCircle, label: 'ডেলিভারড' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', icon: FiXCircle, label: 'বাতিল' },
    returned: { bg: 'bg-gray-100', text: 'text-gray-700', icon: FiPackage, label: 'ফেরত' },
};

const paymentLabels: Record<string, string> = {
    pending: 'পেমেন্ট অপেক্ষমাণ', paid: 'পরিশোধিত', failed: 'ব্যর্থ', refunded: 'রিফান্ড',
};

const StatusBadge = ({ status }: { status: string }) => {
    const { bg, text, icon: Icon, label } = statusConfig[status] || statusConfig.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold font-bangla ${bg} ${text}`}>
            <Icon size={12} />
            {label}
        </span>
    );
};

export default function MyOrdersPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetMyOrdersQuery({
        page,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined,
    });

    const orders = data?.data || [];
    const meta = data?.meta || { total: 0, totalPages: 1 };

    const statusTabs = [
        { id: 'all', label: 'সব অর্ডার' },
        { id: 'pending', label: 'অপেক্ষমাণ' },
        { id: 'processing', label: 'প্রস্তুত হচ্ছে' },
        { id: 'shipped', label: 'পাঠানো হয়েছে' },
        { id: 'delivered', label: 'ডেলিভারড' },
        { id: 'cancelled', label: 'বাতিল' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-display">আমার অর্ডার</h1>
                        <p className="text-sm text-gray-400 mt-1 font-bangla">আপনার অর্ডার ট্র্যাক ও পরিচালনা করুন</p>
                    </div>
                    <Link
                        href="/shop"
                        className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition-all shadow-md shadow-[var(--color-primary)]/20 flex items-center gap-2 font-bangla"
                    >
                        <FiShoppingBag size={16} />
                        কেনাকাটা করুন
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                {/* Status Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-3 border-b border-gray-50 scrollbar-hide">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setStatusFilter(tab.id); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all font-bangla ${
                                statusFilter === tab.id
                                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="অর্ডার নম্বর দিয়ে খুঁজুন..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all font-bangla"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
                            <div className="flex justify-between mb-4">
                                <div className="h-5 bg-gray-200 rounded w-32"></div>
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-4 bg-gray-100 rounded w-48 mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-36"></div>
                        </div>
                    ))
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm text-center">
                        <FiPackage size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-bold text-gray-600 mb-1 font-bangla">কোনো অর্ডার পাওয়া যায়নি</h3>
                        <p className="text-sm text-gray-400 font-bangla">
                            {statusFilter !== 'all' ? 'ফিল্টার পরিবর্তন করে দেখুন' : 'কেনাকাটা শুরু করলে আপনার অর্ডার এখানে দেখা যাবে'}
                        </p>
                    </div>
                ) : (
                    orders.map((order: any) => (
                        <Link
                            key={order._id}
                            href={`/dashboard/user/orders/${order._id}`}
                            className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
                        >
                            <div className="p-5">
                                {/* Top Row */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Poppins',sans-serif" }}>
                                            {order.orderId || order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 font-bangla">
                                            অর্ডার তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                {/* Items Preview */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex -space-x-2">
                                        {order.items?.slice(0, 3).map((item: any, idx: number) => (
                                            <div key={idx} className="w-10 h-10 rounded-lg bg-gray-50 border-2 border-white overflow-hidden shadow-sm">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <FiPackage size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {order.items?.length > 3 && (
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 font-bangla">
                                        {(order.items?.length || 0).toLocaleString('bn-BD')} টি পণ্য
                                    </p>
                                </div>

                                {/* Bottom Row */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                            {order.paymentMethod || 'COD'}
                                        </span>
                                        <span className={`text-xs font-semibold font-bangla ${order.paymentStatus === 'paid' ? 'text-emerald-500' : order.paymentStatus === 'refunded' ? 'text-blue-500' : order.paymentStatus === 'failed' ? 'text-red-500' : 'text-amber-500'}`}>
                                            {paymentLabels[order.paymentStatus] || 'পেমেন্ট অপেক্ষমাণ'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg font-bold text-[var(--color-primary)]" style={{ fontFamily: "'Poppins',sans-serif" }}>৳{order.total?.toLocaleString('bn-BD')}</p>
                                        <FiChevronRight size={16} className="text-gray-300 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 transition-all font-bangla"
                    >
                        পূর্ববর্তী
                    </button>
                    <span className="text-sm font-bold text-gray-500 font-bangla">
                        পৃষ্ঠা {page.toLocaleString('bn-BD')} / {meta.totalPages.toLocaleString('bn-BD')}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                        disabled={page === meta.totalPages}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-40 transition-all font-bangla"
                    >
                        পরবর্তী
                    </button>
                </div>
            )}
        </div>
    );
}
