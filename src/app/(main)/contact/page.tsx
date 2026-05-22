"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FiPhone, FiMail, FiMapPin, FiSend, FiCheckCircle,
    FiClock, FiMessageCircle, FiChevronRight,
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { useGetSiteContentQuery } from '@/redux/api/siteContentApi';

type FormState = { name: string; email: string; phone: string; subject: string; message: string };

const MAROON = '#6B0F1A';
const GOLD   = '#C9A227';
const DEEP   = '#2D1008';
const CREAM  = '#FDF6EC';
const SOFT   = '#F5EDE0';

export default function ContactPage() {
    const { data: res, isLoading: contentLoading } = useGetSiteContentQuery({});
    const c = res?.data?.contact;

    const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', subject: '', message: '' });
    const [focusField, setFocusField] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<FormState>>({});

    const validate = () => {
        const e: Partial<FormState> = {};
        if (!form.name.trim()) e.name = 'নাম প্রয়োজন';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'সঠিক ইমেইল প্রয়োজন';
        if (!form.message.trim()) e.message = 'বার্তা লিখুন';
        return e;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name as keyof FormState]) setErrors(p => ({ ...p, [name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
    };

    const inputCls = (name: keyof FormState) =>
        `font-bangla w-full text-sm border rounded-lg px-3.5 py-2.5 transition-all outline-none ${
            errors[name]
                ? 'border-red-400 bg-red-50/30'
                : focusField === name
                    ? 'border-[#6B0F1A] bg-white shadow-sm'
                    : 'border-[#d4c9b8] bg-[#faf8f5]'
        }`;

    if (contentLoading || !c) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]" style={{ background: SOFT }}>
                <div className="w-8 h-8 border-2 border-[#d4c9b8] rounded-full animate-spin" style={{ borderTopColor: MAROON }} />
            </div>
        );
    }

    const CONTACT_CARDS = [
        { icon: <FiPhone size={20} />, label: 'ফোন করুন', primary: c.phone || '01XXXXXXXXX', secondary: 'রবি – বৃহস্পতি, সকাল ৯ – সন্ধ্যা ৬', href: `tel:${c.phone || ''}`, accent: MAROON },
        { icon: <BsWhatsapp size={20} />, label: 'হোয়াটসঅ্যাপ', primary: c.whatsapp || '01XXXXXXXXX', secondary: 'মিনিটের মধ্যে উত্তর', href: `https://wa.me/88${c.whatsapp || ''}`, accent: '#25D366' },
        { icon: <FiMail size={20} />, label: 'ইমেইল করুন', primary: c.email || 'support@jhamdani.com', secondary: '২৪ ঘণ্টার মধ্যে উত্তর', href: `mailto:${c.email || ''}`, accent: '#6366F1' },
        { icon: <FiMapPin size={20} />, label: 'আমাদের ঠিকানা', primary: c.address || 'ঢাকা, বাংলাদেশ', secondary: 'আমাদের অফিসে আসুন', href: '#', accent: GOLD },
    ];

    const HOURS = (c.hours || []).map((h: any) => ({ day: h.day, time: h.time }));
    const SUBJECTS = c.subjects || [];
    const TIPS = c.tips || [];
    const SOCIALS = c.socials || [];

    return (
        <div className="min-h-screen" style={{ background: SOFT }}>

            {/* ══ HERO ══ */}
            <section className="bg-jamdani-dark relative overflow-hidden" style={{ padding: '52px 0 48px' }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full" style={{ background: 'rgba(201,162,39,0.15)' }} />
                    <div className="absolute bottom-[-60px] left-[5%] w-52 h-52 rounded-full" style={{ background: 'rgba(201,162,39,0.1)' }} />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                        <Link href="/" className="font-bangla text-xs" style={{ color: `${GOLD}80` }}>হোম</Link>
                        <FiChevronRight size={11} style={{ color: `${GOLD}60` }} />
                        <span className="font-bangla text-xs" style={{ color: `${GOLD}CC` }}>যোগাযোগ</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-black mb-3 leading-tight" style={{ color: CREAM }}>
                        যোগাযোগ করুন
                    </h1>
                    <p className="font-bangla text-sm max-w-lg mx-auto leading-relaxed" style={{ color: `${CREAM}80` }}>
                        কোনো প্রশ্ন, মতামত বা অর্ডার সংক্রান্ত সাহায্য দরকার? আমাদের দল আপনাকে সাহায্য করতে সদা প্রস্তুত।
                    </p>
                </div>
            </section>

            {/* ══ CONTACT CARDS ══ */}
            <div className="container mx-auto px-4 -mt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                    {CONTACT_CARDS.map((card, i) => (
                        <a key={i} href={card.href}
                           className="flex flex-col items-center gap-2 p-5 rounded-lg text-center transition-all hover:shadow-md bg-white/80 backdrop-blur-sm"
                           style={{ border: '1px solid #e5ddd0', textDecoration: 'none' }}>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${card.accent}12`, color: card.accent }}>
                                {card.icon}
                            </div>
                            <p className="font-bangla text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8a7560' }}>{card.label}</p>
                            <p className="font-bangla text-sm font-bold" style={{ color: DEEP }}>{card.primary}</p>
                            <p className="font-bangla text-[11px]" style={{ color: '#8a7560' }}>{card.secondary}</p>
                        </a>
                    ))}
                </div>

                {/* ══ MAIN CONTENT ══ */}
                <div className="flex gap-8 flex-col lg:flex-row mb-10">

                    {/* LEFT: Form */}
                    <div className="flex-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 lg:p-8" style={{ border: '1px solid #e5ddd0' }}>
                            <div className="flex items-center gap-2.5 mb-6">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${MAROON}12`, color: MAROON }}>
                                    <FiMessageCircle size={16} />
                                </div>
                                <div>
                                    <h2 className="font-bangla text-base font-bold" style={{ color: DEEP }}>বার্তা পাঠান</h2>
                                    <p className="font-bangla text-xs" style={{ color: '#8a7560' }}>২৪ ঘণ্টার মধ্যে উত্তর দেওয়া হবে</p>
                                </div>
                            </div>

                            {submitted && (
                                <div className="flex items-center gap-2.5 rounded-lg p-4 mb-5" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                                    <FiCheckCircle size={18} color="#16a34a" />
                                    <div>
                                        <p className="font-bangla text-sm font-semibold" style={{ color: '#15803d' }}>বার্তা সফলভাবে পাঠানো হয়েছে!</p>
                                        <p className="font-bangla text-xs" style={{ color: '#15803d99' }}>আমাদের দল ২৪ ঘণ্টার মধ্যে উত্তর দেবে।</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-bangla text-xs font-semibold block mb-1.5" style={{ color: DEEP }}>পুরো নাম <span style={{ color: 'red' }}>*</span></label>
                                        <input name="name" value={form.name} onChange={handleChange} placeholder="আপনার পুরো নাম"
                                               className={inputCls('name')} onFocus={() => setFocusField('name')} onBlur={() => setFocusField(null)} />
                                        {errors.name && <p className="font-bangla text-[11px] mt-1" style={{ color: 'red' }}>{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="font-bangla text-xs font-semibold block mb-1.5" style={{ color: DEEP }}>ফোন নম্বর</label>
                                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX"
                                               className={inputCls('phone')} onFocus={() => setFocusField('phone')} onBlur={() => setFocusField(null)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="font-bangla text-xs font-semibold block mb-1.5" style={{ color: DEEP }}>ইমেইল <span style={{ color: 'red' }}>*</span></label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com"
                                           className={inputCls('email')} onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)} />
                                    {errors.email && <p className="font-bangla text-[11px] mt-1" style={{ color: 'red' }}>{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="font-bangla text-xs font-semibold block mb-1.5" style={{ color: DEEP }}>বিষয়</label>
                                    <select name="subject" value={form.subject} onChange={handleChange}
                                            className={inputCls('subject') + ' cursor-pointer'}
                                            style={{ appearance: 'auto' }}
                                            onFocus={() => setFocusField('subject')} onBlur={() => setFocusField(null)}>
                                        <option value="">একটি বিষয় বাছুন…</option>
                                        {SUBJECTS.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bangla text-xs font-semibold block mb-1.5" style={{ color: DEEP }}>বার্তা <span style={{ color: 'red' }}>*</span></label>
                                    <textarea name="message" value={form.message} onChange={handleChange}
                                              placeholder="আপনার প্রশ্ন বা সমস্যা বিস্তারিত লিখুন…" rows={5}
                                              className={inputCls('message') + ' resize-y min-h-[120px]'}
                                              onFocus={() => setFocusField('message')} onBlur={() => setFocusField(null)} />
                                    {errors.message && <p className="font-bangla text-[11px] mt-1" style={{ color: 'red' }}>{errors.message}</p>}
                                </div>
                                <button type="submit" disabled={loading}
                                        className="font-bangla flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-lg transition-all"
                                        style={{ background: loading ? '#9ca3af' : MAROON, color: CREAM, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 4px 14px ${MAROON}40` }}>
                                    {loading
                                        ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full inline-block animate-spin" /> পাঠানো হচ্ছে…</>
                                        : <><FiSend size={14} /> বার্তা পাঠান</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: Info */}
                    <div className="lg:w-72 flex flex-col gap-4">
                        {HOURS.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden" style={{ border: '1px solid #e5ddd0' }}>
                                <div className="flex items-center gap-2 px-4 py-3" style={{ background: SOFT, borderBottom: '1px solid #e5ddd0' }}>
                                    <FiClock size={14} style={{ color: '#8a7560' }} />
                                    <span className="font-bangla text-xs font-bold" style={{ color: DEEP }}>কার্যালয়ের সময়</span>
                                </div>
                                <div className="py-1">
                                    {HOURS.map((h: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: i < HOURS.length - 1 ? '1px solid #f5f0e8' : 'none' }}>
                                            <span className="font-bangla text-xs font-medium" style={{ color: DEEP }}>{h.day}</span>
                                            <span className="font-bangla text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                                  style={{ color: h.time === 'Closed' ? '#DC2626' : MAROON, background: h.time === 'Closed' ? '#FEF2F2' : `${MAROON}10` }}>
                                                {h.time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {TIPS.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4" style={{ border: '1px solid #e5ddd0' }}>
                                <p className="font-bangla text-xs font-bold mb-3" style={{ color: MAROON }}>💡 দ্রুত টিপস</p>
                                {TIPS.map((tip: string, i: number) => (
                                    <div key={i} className="flex gap-2 mb-2 last:mb-0">
                                        <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: GOLD }} />
                                        <p className="font-bangla text-xs leading-relaxed" style={{ color: '#5a3e2b' }}>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {SOCIALS.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4" style={{ border: '1px solid #e5ddd0' }}>
                                <p className="font-bangla text-xs font-bold mb-3" style={{ color: DEEP }}>আমাদের ফলো করুন</p>
                                <div className="flex gap-2 flex-wrap">
                                    {SOCIALS.map((s: any, i: number) => (
                                        <a key={i} href={s.url}
                                           className="font-bangla text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all"
                                           style={{ background: `${s.color}12`, color: s.color, textDecoration: 'none' }}
                                           onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = s.color; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                                           onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${s.color}12`; (e.currentTarget as HTMLElement).style.color = s.color; }}>
                                            {s.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
