import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaThLarge, FaShoppingCart, FaUser, FaClipboardList } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const MobileBottomNav = () => {
    const location = useLocation();
    const { getCartCount } = useCart();
    const { user } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                <Link to="/" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>
                    <FaHome size={20} className={isActive('/') ? 'scale-110 transition-transform' : ''} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link to="/categories" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/categories') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>
                    <FaThLarge size={20} className={isActive('/categories') ? 'scale-110 transition-transform' : ''} />
                    <span className="text-[10px] font-medium">Categories</span>
                </Link>

                <Link to="/cart" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${isActive('/cart') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>
                    <div className="relative">
                        <FaShoppingCart size={20} className={isActive('/cart') ? 'scale-110 transition-transform' : ''} />
                        {getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-3 bg-brand-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white shadow-sm">
                                {getCartCount()}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">Cart</span>
                </Link>

                {user && (
                    <Link to="/account/orders" className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/account/orders') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>
                        <FaClipboardList size={20} className={isActive('/account/orders') ? 'scale-110 transition-transform' : ''} />
                        <span className="text-[10px] font-medium">Orders</span>
                    </Link>
                )}

                <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/profile') || isActive('/login') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>
                    <FaUser size={20} className={isActive('/profile') || isActive('/login') ? 'scale-110 transition-transform' : ''} />
                    <span className="text-[10px] font-medium">{user ? "Profile" : "Login"}</span>
                </Link>
            </div>
        </div>
    );
};

export default MobileBottomNav;
