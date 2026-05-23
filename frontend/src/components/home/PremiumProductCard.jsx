import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaStar } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';

const PremiumProductCard = ({ product }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product._id);
    
    // Generate random rating for display if not present
    const rating = product.rating || (Math.random() * (5 - 4) + 4).toFixed(1);
    const reviews = product.numReviews || Math.floor(Math.random() * 300) + 10;

    return (
        <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-200 transition-all duration-300 group flex flex-col h-full relative">

            {/* Wishlist Button */}
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                }}
                className={`absolute top-4 right-4 z-10 w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isWishlisted 
                        ? 'text-red-500 opacity-100 scale-110' 
                        : 'text-slate-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-red-500 hover:bg-red-50'
                }`}
            >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>

            {/* Image Container */}
            <Link to={`/product/${product.slug}`} className="block relative w-full pt-[100%] bg-slate-50 rounded-xl overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                    ) : (
                        <span className="text-slate-300">No Image</span>
                    )}
                </div>
            </Link>

            {/* Content Container */}
            <div className="flex flex-col flex-grow">
                {/* Category/Make Subtitle */}
                <div className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1 truncate">
                    {product.make?.name || product.category?.name || 'Electronics'}
                </div>

                {/* Title */}
                <Link to={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-slate-900 leading-tight mb-2 line-clamp-2 hover:text-brand-600 transition-colors h-[2.5rem]">
                        {product.name}
                    </h3>
                </Link>

                {/* Ratings */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-amber-400 text-[10px]">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className={rating < 4.8 ? "text-slate-300" : ""} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{rating}</span>
                    <span className="text-xs text-slate-400">({reviews})</span>
                </div>

                {/* Footer: Price & Add to Cart */}
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900 tracking-tight">
                        ₹{product.price.toLocaleString()}
                    </span>
                    <button className="bg-slate-100 hover:bg-brand-600 text-slate-700 hover:text-white font-semibold py-2 px-4 rounded-full text-xs transition-all shadow-sm hover:shadow-brand-500/30">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PremiumProductCard;
