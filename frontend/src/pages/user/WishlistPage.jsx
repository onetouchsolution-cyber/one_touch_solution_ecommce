import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaArrowLeft, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/product/ProductCard';

const WishlistPage = () => {
    const { wishlistItems } = useWishlist();

    if (wishlistItems.length === 0) {
        return (
            <div className="bg-[#F8FAFC] min-h-[75vh] flex items-center justify-center py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-xl border border-slate-100 flex flex-col items-center"
                >
                    {/* Pulsing Gradient Heart Icon Container */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-red-500/10 rounded-full scale-150 animate-ping duration-1000"></div>
                        <div className="w-24 h-24 bg-gradient-to-tr from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 text-white relative">
                            <FaRegHeart size={38} className="animate-pulse" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                        Your Wishlist is Empty
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-8">
                        Keep track of premium products you love. Add components or tech repair items to save them here for later!
                    </p>

                    <Link
                        to="/products"
                        className="w-full inline-flex items-center justify-center gap-2 h-14 bg-slate-900 hover:bg-brand-600 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-brand-500/20 hover:-translate-y-0.5 group"
                    >
                        <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                        <span>Start Shopping</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen py-12 font-sans">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Stunning Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white mb-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Decorative blurred backgrounds */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="relative">
                        <div className="flex items-center gap-3 text-rose-500 font-bold uppercase tracking-widest text-xs mb-2">
                            <FaHeart className="animate-pulse" /> Saved items
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
                            My Premium Wishlist
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm md:text-base">
                            Manage and easily access all your favorite tech accessories.
                        </p>
                    </div>

                    <div className="relative shrink-0 flex items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 self-start md:self-auto shadow-sm">
                        <span className="text-3xl font-black text-rose-400 mr-2">
                            {wishlistItems.length}
                        </span>
                        <span className="text-sm font-semibold text-slate-200">
                            {wishlistItems.length === 1 ? 'Item Saved' : 'Items Saved'}
                        </span>
                    </div>
                </div>

                {/* Animated Grid Layout */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {wishlistItems.map((product) => (
                            <motion.div
                                key={product._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default WishlistPage;
