import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 md:pb-12 border-t border-slate-800">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                    {/* Brand & About (Takes up 2 columns on large screens) */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-block mb-6">
                            <div className="flex items-center gap-3 group">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 font-bold text-2xl shadow-lg">
                                    OT
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-white tracking-tight leading-none">ONE TOUCH</span>
                                    <span className="text-xs text-brand-500 font-bold tracking-[0.2em] uppercase mt-1">Tech Repair</span>
                                </div>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                            Your premium destination for mobile parts, laptop components, CCTV systems, and high-quality repair accessories. We supply technicians and DIYers with reliable parts.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-all transform hover:-translate-y-1"><FaFacebook size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-all transform hover:-translate-y-1"><FaTwitter size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-all transform hover:-translate-y-1"><FaInstagram size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-600 hover:text-white transition-all transform hover:-translate-y-1"><FaLinkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Quick Links</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/products" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">Shop All Products</Link></li>
                            <li><Link to="/categories" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">Categories</Link></li>
                            <li><Link to="/about" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">About Us</Link></li>
                            <li><Link to="/contact" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Support</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/faq" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">FAQ</Link></li>
                            <li><Link to="/shipping" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">Returns & Refunds</Link></li>
                            <li><Link to="/privacy" className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Stay Updated</h4>
                        <p className="text-slate-400 text-sm mb-4">Subscribe to our newsletter for exclusive deals and repair tips.</p>
                        <form className="flex flex-col gap-3">
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="w-full bg-slate-800 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 border border-slate-700 placeholder-slate-500 text-sm"
                                />
                            </div>
                            <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-slate-500 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} One Touch Solution. All rights reserved. <br className="md:hidden" />
                        <span className="hidden md:inline"> | </span> Designed for Tech Repair Professionals.
                    </div>
                    
                    {/* Payment Icons (Placeholders for now) */}
                    <div className="flex gap-2 opacity-60">
                        <div className="w-10 h-6 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400">VISA</div>
                        <div className="w-10 h-6 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400">MC</div>
                        <div className="w-10 h-6 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400">AMEX</div>
                        <div className="w-10 h-6 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-400">PP</div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
