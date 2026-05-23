import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaSignOutAlt, FaBars, FaTimes, FaRegHeart, FaGlobe } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import GlobalSearch from '../common/GlobalSearch';
import Button from '../common/Button';

const Navbar = () => {
    const [keyword, setKeyword] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const { wishlistItems } = useWishlist();
    const { user, logout } = useAuth();

    const searchHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?q=${keyword}`);
        } else {
            navigate('/products');
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 shadow-sm transition-all duration-300">
            {/* Top Bar - Very thin for language and minor links (Desktop only) */}

            <div className="container mx-auto px-4 py-3 lg:py-4">
                <div className="flex justify-between items-center h-14 lg:h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group mr-4 lg:mr-8 shrink-0">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl lg:text-2xl shadow-md group-hover:scale-105 transition-transform duration-300">
                            OT
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none">ONE TOUCH</span>
                            <span className="text-[10px] lg:text-xs text-brand-600 font-bold tracking-[0.2em] uppercase mt-1">Tech Repair</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-1 xl:space-x-4 shrink-0">
                        <Link to="/products" className="px-3 xl:px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 rounded-full hover:bg-slate-50 transition-colors">Shop</Link>
                        <Link to="/products/mobile" className="px-3 xl:px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 rounded-full hover:bg-slate-50 transition-colors">Mobile</Link>
                        <Link to="/products/laptop-computer" className="px-3 xl:px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 rounded-full hover:bg-slate-50 transition-colors">Laptop</Link>
                        <Link to="/categories" className="px-3 xl:px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 rounded-full hover:bg-slate-50 transition-colors">Categories</Link>
                    </div>

                    {/* Desktop Search Bar - Flex 1 to take remaining space */}
                    <div className="hidden md:block flex-1 max-w-2xl mx-4 lg:mx-8">
                        <GlobalSearch />
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2 lg:gap-4 shrink-0">
                        <Link to="/wishlist" className="p-2.5 text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-full transition-all group relative">
                            <FaRegHeart size={20} className="group-hover:scale-110 transition-transform" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white animate-in zoom-in-50 duration-200">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="p-2.5 text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-full transition-all relative group">
                            <FaShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                            {getCartCount() > 0 && (
                                <span className="absolute top-1 right-1 bg-brand-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        <div className="w-px h-6 bg-slate-200 mx-1 lg:mx-2 hidden lg:block"></div>

                        {user ? (
                            <div className="flex items-center">
                                <Link to="/profile" className="flex items-center gap-2 mr-2 group p-1.5 rounded-full hover:bg-slate-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 hidden xl:block">{user.name.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Logout"
                                >
                                    <FaSignOutAlt size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary" className="ml-2 font-semibold shadow-lg shadow-brand-500/20 px-6 rounded-full hover:-translate-y-0.5 transition-transform">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center gap-3">
                        <Link to="/wishlist" className="p-2 text-slate-600 relative">
                            <FaRegHeart size={22} />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="p-2 text-slate-600 relative">
                            <FaShoppingCart size={22} />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                        <button
                            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar - Shows below header on mobile when menu is open or just always show a compact one? Let's show it when menu opens for cleaner header */}
            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl overflow-hidden origin-top animate-in slide-in-from-top-2 z-40">
                    <div className="p-4 flex flex-col space-y-4 max-h-[80vh] overflow-y-auto">
                        <form onSubmit={searchHandler} className="relative">
                            <input
                                type="text"
                                placeholder="Search products, parts..."
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-base transition-all"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        </form>

                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="p-4 bg-slate-50 rounded-2xl text-center font-semibold text-slate-700 active:bg-slate-100 transition-colors">Shop All</Link>
                            <Link to="/products/mobile" onClick={() => setIsMenuOpen(false)} className="p-4 bg-slate-50 rounded-2xl text-center font-semibold text-slate-700 active:bg-slate-100 transition-colors">Mobile Parts</Link>
                            <Link to="/products/laptop-computer" onClick={() => setIsMenuOpen(false)} className="p-4 bg-slate-50 rounded-2xl text-center font-semibold text-slate-700 active:bg-slate-100 transition-colors">Laptop</Link>
                            <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="p-4 bg-slate-50 rounded-2xl text-center font-semibold text-slate-700 active:bg-slate-100 transition-colors">Categories</Link>
                        </div>

                        <div className="pt-2 border-t border-slate-100"></div>

                        {!user && (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full p-4 bg-slate-900 text-white rounded-2xl text-center font-bold active:bg-slate-800 transition-colors">Sign In</Link>
                        )}

                        {user && (
                            <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{user.name}</p>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-500 hover:bg-red-50 bg-white shadow-sm rounded-full">
                                    <FaSignOutAlt />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
