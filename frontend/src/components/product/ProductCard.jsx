import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaRegHeart, FaHeart, FaStar, FaEye } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import SafeImage from '../common/SafeImage';

const ProductCard = ({ product }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const isWishlisted = isInWishlist(product._id);

    // Mock color variants for UI presentation
    const mockColors = ['#0F172A', '#E5E7EB', '#EF4444', '#3B82F6', '#10B981'];
    const displayColors = mockColors.slice(0, Math.floor(Math.random() * 3) + 2);

    // Mock rating
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5 to 5.0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[20px] shadow-soft hover:shadow-card-hover transition-all duration-300 overflow-hidden group flex flex-col h-full border border-slate-100/50 backdrop-blur-sm relative"
        >
            {/* Discount Badge */}
            {Math.random() > 0.7 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                    -{(Math.random() * 20 + 10).toFixed(0)}%
                </div>
            )}

            {/* Quick Actions (Hover/State) */}
            <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10 ${
                isWishlisted 
                    ? 'opacity-100 transform translate-x-0' 
                    : 'opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0'
            }`}>
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    className={`w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                        isWishlisted ? 'text-red-500 scale-110' : 'text-slate-500 hover:text-red-500 hover:bg-white'
                    }`}
                >
                    {isWishlisted ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                </button>
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-500 hover:text-brand-600 hover:bg-white shadow-sm transition-all"
                >
                    <FaEye size={14} />
                </button>
            </div>

            <Link to={`/product/${product.slug}`} className="flex-1 flex flex-col p-4 pb-0">
                {/* Image Container */}
                <div className="relative h-48 mb-4 flex items-center justify-center overflow-hidden rounded-xl">
                    {product.image ? (
                        <SafeImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <span className="text-slate-300 font-medium">No Image</span>
                    )}
                    
                    {/* Out of Stock Overlay */}
                    {product.countInStock === 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Color Variants (Mocked as per design) */}
                <div className="flex justify-center gap-1.5 mb-3">
                    {displayColors.map((color, i) => (
                        <div 
                            key={i} 
                            className="w-4 h-4 rounded-full border border-slate-200 shadow-sm"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>

                <div className="flex-1 flex flex-col">
                    {/* Brand / Category */}
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider">
                            {product.brand?.name || (typeof product.make === 'object' ? product.make.name : product.make) || 'Accessory'}
                        </span>
                        <div className="flex items-center text-[10px] text-slate-400 font-medium">
                            <FaStar className="text-amber-400 mr-1" size={10} />
                            {rating}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-slate-800 text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {product.name}
                    </h3>
                </div>
            </Link>

            {/* Price and Cart Footer */}
            <div className="p-4 pt-2 mt-auto flex items-end justify-between border-t border-slate-50/50">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium mb-0.5">Price</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-slate-900 tracking-tight">₹{product.price?.toLocaleString()}</span>
                    </div>
                </div>
                
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product, 1);
                    }}
                    disabled={product.countInStock === 0}
                    className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                        ${product.countInStock === 0 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white hover:shadow-md hover:-translate-y-0.5'
                        }`}
                >
                    <FaShoppingCart size={14} className={product.countInStock === 0 ? '' : 'ml-[-1px]'} />
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
