import React from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

const VALUES = [
    { icon: '🧵', title: 'খাঁটি কারুশিল্প', desc: 'প্রতিটি পণ্য ঢাকার দক্ষ কারিগরদের হাতে শত বছরের পুরনো ঐতিহ্যে তৈরি।' },
    { icon: '🌿', title: 'পরিবেশবান্ধব', desc: 'আমরা প্রাকৃতিক কাপড় ব্যবহার করি এবং প্রতিটি কারিগরকে ন্যায্য মজুরি দিই।' },
    { icon: '💎', title: 'প্রিমিয়াম মান', desc: 'বাংলাদেশের সেরা টেক্সটাইল আপনার কাছে পৌঁছে দিতে কঠোর মান যাচাই।' },
    { icon: '🚚', title: 'নিরাপদ ডেলিভারি', desc: 'সারা বাংলাদেশে দ্রুত ও যত্নসহকারে প্যাকিং করে ডেলিভারি।' },
];

const TEAM = [
    { name: 'আরাফাত হোসেন',  role: 'প্রতিষ্ঠাতা ও সিইও', initial: 'আ' },
    { name: 'নুসরাত জাহান',    role: 'ডিজাইন প্রধান',     initial: 'নু' },
    { name: 'রাকিবুল ইসলাম',  role: 'অপারেশন ম্যানেজার', initial: 'রা' },
    { name: 'সাদিয়া সুলতানা', role: 'গ্রাহক সেবা',       initial: 'সা' },
];

const STATS = [
    { value: '৫,০০০+', label: 'সন্তুষ্ট গ্রাহক' },
    { value: '২০০+',   label: 'অনন্য পণ্য' },
    { value: '৫০+',    label: 'দক্ষ কারিগর' },
    { value: '১০+',    label: 'বছরের ঐতিহ্য' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen" style={{ background: '#F5EDE0' }}>

            {/* ══ HERO ══ */}
            <section className="bg-jamdani-dark relative overflow-hidden" style={{ padding: '80px 0 70px' }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full" style={{ background: 'rgba(201,162,39,0.15)' }} />
                    <div className="absolute bottom-[-70px] left-[-40px] w-56 h-56 rounded-full" style={{ background: 'rgba(201,162,39,0.1)' }} />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-5">
                        <Link href="/" className="font-bangla text-xs" style={{ color: '#C9A22780' }}>হোম</Link>
                        <FiChevronRight size={11} style={{ color: '#C9A22760' }} />
                        <span className="font-bangla text-xs" style={{ color: '#C9A227CC' }}>আমাদের সম্পর্কে</span>
                    </div>
                    <span className="font-bangla inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wider" style={{ background: 'rgba(201,162,39,0.15)', color: '#C9A227' }}>
                        আমাদের গল্প
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl font-black mb-5 leading-tight" style={{ color: '#FDF6EC' }}>
                        বাংলার আত্মা,<br />
                        <span style={{ color: '#C9A227' }}>প্রতিটি সুতোয় বোনা</span>
                    </h1>
                    <p className="font-bangla text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#FDF6EC99' }}>
                        ঝামদানি বাংলাদেশের সবচেয়ে মূল্যবান টেক্সটাইল ঐতিহ্যকে সম্মান করে — খাঁটি জামদানি শাড়ি, ঐতিহ্যবাহী পোশাক এবং হাতে তৈরি অলংকার সরাসরি আপনার দোরগোড়ায়।
                    </p>
                </div>
            </section>

            {/* ══ STATS ══ */}
            <section className="bg-jamdani-motif" style={{ borderBottom: '1px solid #e5ddd0' }}>
                <div className="container mx-auto px-4 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {STATS.map(({ value, label }) => (
                            <div key={label}>
                                <p className="font-display text-3xl font-black mb-1" style={{ color: '#6B0F1A' }}>{value}</p>
                                <p className="font-bangla text-xs font-medium uppercase tracking-wider" style={{ color: '#5a3e2b' }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ STORY ══ */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="font-bangla text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: '#6B0F1A' }}>আমরা কারা</span>
                        <h2 className="font-display text-3xl font-black mb-5 leading-snug" style={{ color: '#2D1008' }}>
                            ২,০০০ বছরের পুরনো<br/>এক ঐতিহ্যের রক্ষক
                        </h2>
                        <div className="font-bangla space-y-4 text-sm leading-relaxed" style={{ color: '#5a3e2b' }}>
                            <p>ঝামদানি জন্ম নিয়েছে বাংলাদেশের সবচেয়ে আইকনিক টেক্সটাইল — জামদানি শাড়ির প্রতি গভীর ভালোবাসা থেকে। ঢাকা জেলায় যেখানে দক্ষ কারিগররা দুই সহস্রাব্দ ধরে এই শিল্পকে পূর্ণতা দিয়েছেন, আমরা সেই ঐতিহ্য ও আধুনিক ক্রেতার মধ্যে সেতু হিসেবে কাজ করি।</p>
                            <p>আমাদের যাত্রা শুরু হয়েছিল একটি সহজ বিশ্বাস থেকে: প্রতিটি মানুষ ইতিহাসের একটি টুকরো পরিধান করার যোগ্য। ঢাকাই জামদানির সূক্ষ্ম নকশা থেকে শুরু করে প্রাণবন্ত দৈনন্দিন পোশাক এবং অনন্য অলংকার — আমাদের সংগ্রহের প্রতিটি আইটেম দক্ষতা, ধৈর্য এবং সাংস্কৃতিক গর্বের একটি গল্প বলে।</p>
                            <p>আমরা সরাসরি স্থানীয় কারিগর ও তাঁতিদের সাথে কাজ করি — ন্যায্য মজুরি প্রদান করি, পরিবারগুলোকে সহায়তা করি এবং নিশ্চিত করি যে এই অপূরণীয় শিল্প আগামী প্রজন্মের জন্য টিকে থাকে।</p>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <Link href="/products" className="font-bangla px-6 py-3 text-sm font-bold rounded-lg transition-colors" style={{ background: '#6B0F1A', color: '#FDF6EC' }}>সংগ্রহ দেখুন</Link>
                            <Link href="/contact" className="font-bangla px-6 py-3 text-sm font-bold rounded-lg transition-colors" style={{ border: '1.5px solid #d4c9b8', color: '#5a3e2b' }}>যোগাযোগ করুন</Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { bg: '#f8f0e8', emoji: '🧶', label: 'হাতে বোনা শাড়ি' },
                            { bg: '#fff0f3', emoji: '🌸', label: 'জামদানি শাড়ি' },
                            { bg: '#f5f0ff', emoji: '✨', label: 'মেয়েদের পোশাক' },
                            { bg: '#f0f5e8', emoji: '💎', label: 'অলংকার ও গহনা' },
                        ].map(({ bg, emoji, label }) => (
                            <div key={label} className="rounded-2xl flex flex-col items-center justify-center gap-2 aspect-square text-center p-4" style={{ background: bg }}>
                                <span className="text-4xl">{emoji}</span>
                                <span className="font-bangla text-xs font-semibold" style={{ color: '#2D1008' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ VALUES ══ */}
            <section className="bg-jamdani-motif py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <span className="font-bangla text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: '#6B0F1A' }}>কেন ঝামদানি</span>
                        <h2 className="font-display text-2xl md:text-3xl font-black" style={{ color: '#2D1008' }}>আমাদের মূল্যবোধ</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {VALUES.map(({ icon, title, desc }) => (
                            <div key={title} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 transition-shadow hover:shadow-lg" style={{ border: '1px solid #e5ddd0' }}>
                                <div className="text-3xl mb-4">{icon}</div>
                                <h3 className="font-bangla text-sm font-bold mb-2" style={{ color: '#2D1008' }}>{title}</h3>
                                <p className="font-bangla text-xs leading-relaxed" style={{ color: '#5a3e2b' }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TEAM ══ */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-10">
                    <span className="font-bangla text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: '#6B0F1A' }}>পেছনের মানুষেরা</span>
                    <h2 className="font-display text-2xl md:text-3xl font-black" style={{ color: '#2D1008' }}>আমাদের দল</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {TEAM.map(({ name, role, initial }) => (
                        <div key={name} className="text-center">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 font-display text-xl font-black" style={{ background: '#6B0F1A15', color: '#6B0F1A', border: '2px solid #C9A22740' }}>
                                {initial}
                            </div>
                            <p className="font-bangla text-sm font-bold" style={{ color: '#2D1008' }}>{name}</p>
                            <p className="font-bangla text-xs mt-0.5" style={{ color: '#8a7560' }}>{role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ CTA ══ */}
            <section className="bg-jamdani-dark py-14">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display text-2xl md:text-3xl font-black mb-3" style={{ color: '#FDF6EC' }}>আজই আপনার জামদানি যাত্রা শুরু করুন</h2>
                    <p className="font-bangla text-sm mb-7 max-w-md mx-auto" style={{ color: '#FDF6EC70' }}>
                        বাংলাদেশের সেরা কারিগরদের হাতে তৈরি জামদানি শাড়ি, পোশাক এবং অলংকারের আমাদের হাতে বাছাই করা সংগ্রহ ঘুরে দেখুন।
                    </p>
                    <Link href="/jamdani" className="font-bangla inline-block font-bold px-8 py-3 rounded-lg text-sm transition-colors shadow-lg" style={{ background: '#C9A227', color: '#2D1008' }}>
                        জামদানি সংগ্রহ দেখুন
                    </Link>
                </div>
            </section>
        </div>
    );
}
