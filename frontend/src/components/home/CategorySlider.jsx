import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMobileAlt, FaLaptop, FaCamera, FaTools, FaTabletAlt, FaMicrochip, FaHeadphonesAlt, FaBatteryFull } from 'react-icons/fa';

const categories = [
    { id: 1, name: 'Mobile Cases', icon: <FaMobileAlt size={28} />, path: '/categories/mobile_case', color: 'text-blue-500' },
    { id: 2, name: 'CCTV & Acc.', icon: <FaCamera size={28} />, path: '/products/cctv', color: 'text-slate-700' },
    { id: 3, name: 'Computer Parts', icon: <FaMicrochip size={28} />, path: '/products/laptop-computer', color: 'text-indigo-500' },
    { id: 4, name: 'Mobile Acc.', icon: <FaHeadphonesAlt size={28} />, path: '/categories/mobile_accessories', color: 'text-pink-500' },
    { id: 5, name: 'Laptop Parts', icon: <FaLaptop size={28} />, path: '/categories/laptop_computer_parts', color: 'text-teal-500' },
    { id: 6, name: 'Mobile Parts', icon: <FaBatteryFull size={28} />, path: '/products/mobile', color: 'text-orange-500' },
    { id: 7, name: 'Tablet & Acc.', icon: <FaTabletAlt size={28} />, path: '/categories/mobile_accessories', color: 'text-purple-500' },
    { id: 8, name: 'Repair Tools', icon: <FaTools size={28} />, path: '/categories/repair_tools', color: 'text-red-500' },
];

const CategorySlider = () => {
    const sliderRef = useRef(null);

    return (
        <section className="py-8">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Explore Categories</h2>
            </div>

            {/* Desktop Grid & Mobile Scrollable Container */}
            <div className="relative w-full">
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto lg:grid lg:grid-cols-8 gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={category.id}
                            className="snap-start shrink-0 w-[120px] lg:w-auto"
                        >
                            <Link
                                to={category.path}
                                className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-2xl p-4 h-[110px] hover:shadow-lg hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className={`${category.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    {category.icon}
                                </div>
                                <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
                                    {category.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySlider;
