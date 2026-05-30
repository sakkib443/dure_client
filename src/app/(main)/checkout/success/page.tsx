"use client";

import React from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiShoppingBag, FiClock } from 'react-icons/fi';

/* ── Brand palette ── */
const MAROON = '#5F0000';
const GOLD = '#C9A227';
const CREAM = '#FDF6EC';

const SuccessPage = () => {
    return (
        <div style={{ background: CREAM, minHeight: '100vh' }} className="flex items-center justify-center py-20 px-4">
            <div className="max-w-md w-full bg-white rounded-lg p-9 text-center animate-fadeIn" style={{ border: '1px solid #efe3cf' }}>

                {/* Gold divider */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="block w-10 h-px" style={{ background: GOLD }} />
                    <span style={{ color: GOLD }} className="text-sm">◆</span>
                    <span className="block w-10 h-px" style={{ background: GOLD }} />
                </div>

                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <FiCheckCircle size={42} />
                </div>

                <h1 className="font-display font-bold mb-3" style={{ color: MAROON, fontSize: '1.7rem' }}>
                    অর্ডার সফল হয়েছে!
                </h1>
                <p className="font-bangla text-gray-500 text-sm leading-relaxed mb-6">
                    আপনার অর্ডারটি গ্রহণ করা হয়েছে। আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করে অর্ডারটি নিশ্চিত করবে।
                </p>

                {/* Awaiting verification note */}
                <div className="flex items-start gap-2.5 text-left rounded-md p-3.5 mb-7" style={{ background: '#fff7e9', border: `1px solid ${GOLD}55` }}>
                    <FiClock size={16} style={{ color: GOLD }} className="mt-0.5 shrink-0" />
                    <p className="font-bangla text-xs text-gray-600 leading-relaxed">
                        ম্যানুয়াল পেমেন্ট (বিকাশ/নগদ) করে থাকলে — পেমেন্ট যাচাইয়ের পর অর্ডারটি নিশ্চিত করা হবে। অগ্রগতি আপনার ড্যাশবোর্ডে দেখতে পারবেন।
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/dashboard/user/orders"
                        className="font-bangla w-full flex items-center justify-center gap-2.5 py-3.5 rounded-md text-white text-sm font-semibold transition-all"
                        style={{ background: MAROON }}
                    >
                        <FiPackage size={16} />
                        আমার অর্ডার দেখুন
                    </Link>

                    <Link
                        href="/shop"
                        className="font-bangla w-full flex items-center justify-center gap-2.5 py-3.5 rounded-md text-sm font-semibold transition-all"
                        style={{ border: `1px solid #e3d6c0`, color: MAROON }}
                    >
                        <FiShoppingBag size={16} />
                        আরও কেনাকাটা করুন
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default SuccessPage;
