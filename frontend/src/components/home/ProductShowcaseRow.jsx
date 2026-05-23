import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import PremiumProductCard from './PremiumProductCard';
import { motion } from 'framer-motion';

const ProductShowcaseRow = ({ title, products, viewAllLink }) => {
    const scrollContainerRef = useRef(null);

    // If no products, don't render the section
    if (!products || products.length === 0) return null;

    return (
        <section className="mb-12">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
                {viewAllLink && (
                    <Link to={viewAllLink} className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors uppercase tracking-wider">
                        View All
                    </Link>
                )}
            </div>

            {/* Desktop Grid & Mobile Scrollable Row */}
            <div className="relative w-full">
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1 }}
                            key={product._id || index}
                            className="snap-start shrink-0 w-[240px] md:w-auto h-full"
                        >
                            <PremiumProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductShowcaseRow;
