"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useGetProductsQuery } from '@/redux/api/productApi';

interface ProductData {
    name: string;
    slug: string;
    thumbnail: string;
    price: number;
}

const HojoboroloCollection: React.FC = () => {
    // Fetch products belonging to category 'hojoborolo'
    const { data: productsData, isLoading } = useGetProductsQuery({
        category: 'hojoborolo',
        limit: 10
    });

    const products = useMemo(() => productsData?.data || [], [productsData]);

    // Find products matching the 4 key Hojoborolo products from the screenshot
    const displayItems = useMemo(() => {
        const findProduct = (keyword: string) => {
            return products.find((p: any) => 
                p.name.toLowerCase().includes(keyword) || 
                p.slug.toLowerCase().includes(keyword)
            );
        };

        const totapakhi = findProduct('totapakhi');
        const pecha = findProduct('pecha');
        const dimBou = findProduct('dim'); // Matches "Dim Bou"
        const tepaPutul = findProduct('tepa'); // Matches "Tepa Putul"

        return [
            {
                id: totapakhi?._id || 'totapakhi-fallback',
                name: 'Totapakhi',
                slug: totapakhi?.slug || 'totapakhi',
                image: totapakhi?.thumbnail || 'https://khut.shop/bd-admin/public/storage/gallery/rt1dYrl50pM0mTDrga85uXkW0ZPEYBdeCGJeILvF.jpg',
                isReal: !!totapakhi
            },
            {
                id: pecha?._id || 'pecha-fallback',
                name: 'Pecha',
                slug: pecha?.slug || 'pecha',
                image: pecha?.thumbnail || 'https://khut.shop/bd-admin/public/storage/gallery/ljOhEXfM9G6WjxQdZx0LVvMOcE5bJyxdZB7NoVUR.jpg',
                isReal: !!pecha
            },
            {
                id: dimBou?._id || 'dimbou-fallback',
                name: 'Dim Bou',
                slug: dimBou?.slug || 'dim-bou',
                image: dimBou?.thumbnail || 'https://khut.shop/bd-admin/public/storage/gallery/9KSLJE5DjNN6QnOYHnswM4fth0tI8WZ9Hm0rxWhu.jpg',
                isReal: !!dimBou
            },
            {
                id: tepaPutul?._id || 'tepaputul-fallback',
                name: 'Tepa Putul',
                slug: tepaPutul?.slug || 'tepa-putul',
                image: tepaPutul?.thumbnail || 'https://khut.shop/bd-admin/public/storage/gallery/f1Y86UeITuLpLeuZMa4kyLEMZRMxkHSA09ZT4Ndv.jpg',
                isReal: !!tepaPutul
            }
        ];
    }, [products]);

    return (
        <section className="w-full bg-transparent py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#800000] tracking-wide mb-1">
                            Beautiful Ho-Jo-Bo-Ro-Lo Collection
                        </h2>
                        <p className="text-[13px] md:text-sm text-zinc-700 font-medium">
                            Together lets create a colorful space with Ho-Jo-Bo-Ro-Lo and inspire recycling | local artisan | handmade goods.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Link 
                            href="/category/hojoborolo" 
                            className="inline-block bg-zinc-800 hover:bg-zinc-900 text-white text-[12px] uppercase tracking-wider font-semibold px-6 py-2.5 rounded transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            All Products
                        </Link>
                    </div>
                </div>

                {/* Horizontal Divider */}
                <hr className="border-t border-zinc-300/60 w-full mb-8" />

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {displayItems.map((item) => (
                        <div key={item.id} className="group flex flex-col items-center">
                            <Link 
                                href={item.isReal ? `/product/${item.slug}` : `/category/hojoborolo`}
                                className="w-full overflow-hidden rounded bg-transparent shadow-sm border border-zinc-200/40"
                            >
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </Link>
                            <Link 
                                href={item.isReal ? `/product/${item.slug}` : `/category/hojoborolo`}
                                className="mt-4 text-center"
                            >
                                <span className="text-[15px] font-medium text-zinc-800 group-hover:text-[#800000] transition-colors duration-300">
                                    {item.name}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HojoboroloCollection;
