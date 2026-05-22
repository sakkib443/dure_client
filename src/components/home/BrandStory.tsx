"use client";

import React from 'react';
import Link from 'next/link';

const BrandStory: React.FC = () => {
    return (
        <section className="w-full bg-transparent py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Horizontal Divider Line above the section */}
                <hr className="border-t border-zinc-300/60 w-full mb-10" />

                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                    {/* Left Column: Image */}
                    <div className="w-full md:w-5/12">
                        <div className="overflow-hidden rounded shadow-sm border border-zinc-200/40 aspect-[4/3] w-full">
                            <img 
                                src="https://khut.shop/bd-admin/public/storage/category_banners/qX3uI0I5LZxD2iqnL3Hts7sr7wAqWdSkiT06uxz8.jpg" 
                                alt="Chutli Handicraft Owls and Eggs" 
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Right Column: Brand Text */}
                    <div className="w-full md:w-7/12">
                        <p className="text-zinc-800 text-[14px] md:text-[15px] leading-relaxed tracking-wide text-justify font-normal mb-4">
                            Chutli is an exceptionally unique fashion brand where we cherish Bangladesh's chaotic yet flowing life through our traditional, timeless, hand-made craftsmanship. Each piece in our collection is completely different from the other one as here, in Chutli, we believe that uniqueness arises from imperfection which in turn gives every being in the universe their identity. Our greatest inspiration is nature which is forever in motion portrayed in our work. At Chutli you are not only purchasing a product, but taking with you a piece of our heart as all of our products are created with immense love which flows from us to you!{' '}
                            <Link 
                                href="/contact" 
                                className="text-[#800000] hover:text-[#5F0000] font-semibold underline underline-offset-4 ml-1 inline-block transition-colors"
                            >
                                Read More!
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;
