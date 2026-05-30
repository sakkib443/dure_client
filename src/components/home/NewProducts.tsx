"use client";

import React from 'react';
import SectionHeading from '@/components/shared/SectionHeading';
import ShopCard from '@/components/shared/ShopCard';

const products = [
    { id: 11, name: 'Premium Leather Backpack', categoryName: 'Accessories', price: 7500, originalPrice: 9500, image: 'https://images.unsplash.com/photo-1548036691-cdf0e615eabe?q=80&w=800' },
    { id: 12, name: 'Modern Style Sneakers', categoryName: 'Shoes', price: 5400, originalPrice: 6800, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800' },
    { id: 13, name: 'Classic Navy Polo', categoryName: 'Fashion', price: 1200, originalPrice: 1800, image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800' },
    { id: 14, name: 'Urban Snapback Cap', categoryName: 'Accessories', price: 850, originalPrice: 1200, image: 'https://images.unsplash.com/photo-1588850567047-1849a4445e5f?q=80&w=800' },
    { id: 15, name: 'Premium Cotton Summer Dress', categoryName: 'Fashion', price: 1499, originalPrice: 2999, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800' },
    { id: 16, name: 'Elegant Silk Evening Gown', categoryName: 'Fashion', price: 2999, originalPrice: 4999, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800' },
];

const NewProducts: React.FC = () => {
    return (
        <div className='container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-20'>
            <SectionHeading
                description="Don't wait. The time will never be just right."
                heading="Day of "
                colorHeading="The deal"
            />
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10'>
                {products.map(p => (
                    <ShopCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
};

export default NewProducts;
