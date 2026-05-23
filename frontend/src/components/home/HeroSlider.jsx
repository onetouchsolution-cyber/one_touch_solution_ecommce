import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
    {
        id: 1,
        title: "Repair it.",
        subtitle: "QUALITY SPARE PARTS.",
        description: "Premium tools and components for tech repair professionals.",
        cta: "Explore Repair Info",
        link: "/categories",
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80", // Placeholder for phone/tools
    },
    {
        id: 2,
        title: "Upgrade.",
        subtitle: "HIGH-PERFORMANCE COMPONENTS.",
        description: "Boost your laptop or desktop with our top-tier SSDs and RAMs.",
        cta: "Shop Components",
        link: "/products/laptop-computer",
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    }
];

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-slate-900 overflow-hidden lg:rounded-[2rem] shadow-2xl mt-0 lg:mt-6 mb-8 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Gradient Overlay */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24">
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-brand-400 font-bold tracking-widest uppercase text-xs md:text-sm mb-3"
                        >
                            {slides[currentSlide].subtitle}
                        </motion.span>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4"
                        >
                            {slides[currentSlide].title}
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-300 max-w-md text-sm md:text-base hidden md:block mb-8"
                        >
                            {slides[currentSlide].description}
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link to={slides[currentSlide].link} className="inline-block bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1">
                                {slides[currentSlide].cta}
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-20"
            >
                <FaChevronLeft />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-20"
            >
                <FaChevronRight />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-brand-500 w-6 md:w-8' : 'bg-white/50 hover:bg-white/80'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
