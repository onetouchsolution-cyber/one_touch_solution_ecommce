import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-80 bg-slate-100/50 rounded-[20px] animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-24 h-24 mb-6 bg-slate-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                <p className="text-slate-500 text-center max-w-sm mb-6">
                    We couldn't find any products matching your current filters. Try adjusting your search criteria.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-brand-50 text-brand-600 font-medium rounded-full hover:bg-brand-600 hover:text-white transition-colors"
                >
                    Clear All Filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map(product => (
                <div key={product._id} className="h-full">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;
