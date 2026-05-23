import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaMobileAlt } from 'react-icons/fa';
import API from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';

const MakeListPage = () => {
    const { categorySlug } = useParams();
    const [category, setCategory] = useState(null);
    const [makes, setMakes] = useState([]);
    const [filteredMakes, setFilteredMakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [categorySlug]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = makes.filter(make =>
                make.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMakes(filtered);
        } else {
            setFilteredMakes(makes);
        }
    }, [searchTerm, makes]);

    const fetchData = async () => {
        try {
            const { data: categories } = await API.get('/categories');
            const foundCategory = categories.find(cat => cat.slug === categorySlug);
            setCategory(foundCategory);

            if (foundCategory) {
                const { data: makesData } = await API.get(`/makes/category/${foundCategory._id}`);
                setMakes(makesData);
                setFilteredMakes(makesData);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen py-12 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading manufacturers...</p>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen py-20 flex justify-center items-start">
                <div className="text-center bg-white p-10 rounded-[24px] shadow-sm max-w-md w-full mx-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaMobileAlt className="text-3xl text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Category not found</h2>
                    <p className="text-slate-500 mb-8">We couldn't find the category you're looking for.</p>
                    <Link to="/categories" className="inline-block bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-md">
                        Browse Categories
                    </Link>
                </div>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Categories', link: '/categories' },
        { label: category.name, link: `/category/${category.slug}` },
        { label: 'Makes' }
    ];

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 py-10 md:py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="mb-6">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
                                {category.name} <span className="text-slate-400 font-light">Brands</span>
                            </h1>
                            <p className="text-slate-500 text-lg max-w-xl">
                                Select your device manufacturer to explore premium {category.name.toLowerCase()} options.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full md:w-[320px] relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search brands (e.g., Apple, Samsung)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-800 placeholder-slate-400 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl mt-12">
                {/* Makes Grid */}
                {filteredMakes.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[24px] border border-dashed border-slate-200 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaSearch className="text-2xl text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No brands found</h3>
                        <p className="text-slate-500 mb-6">{searchTerm ? `No results matching "${searchTerm}"` : 'No manufacturers available currently.'}</p>
                        <Link to="/categories" className="inline-block px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-colors">
                            Browse Other Categories
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredMakes.map((make, index) => (
                            <motion.div
                                key={make._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="h-full"
                            >
                                <Link
                                    to={`/category/${categorySlug}/make/${make.slug}/models`}
                                    className="block h-full bg-white rounded-[20px] shadow-soft hover:shadow-card-hover transition-all duration-300 p-6 border border-slate-100 hover:border-brand-100 group flex flex-col items-center text-center relative overflow-hidden"
                                >
                                    <div className="w-24 h-24 mb-5 flex-shrink-0 bg-slate-50 rounded-full flex items-center justify-center group-hover:scale-[1.05] group-hover:bg-brand-50 transition-all duration-300 p-4 relative z-10 border border-slate-100/50">
                                        {make.logo ? (
                                            <img
                                                src={make.logo}
                                                alt={make.name}
                                                className="max-w-full max-h-full object-contain mix-blend-multiply"
                                            />
                                        ) : (
                                            <div className="text-4xl font-bold text-slate-300 group-hover:text-brand-400 transition-colors">
                                                {make.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-[18px] font-bold text-slate-800 mb-2 group-hover:text-brand-600 transition-colors relative z-10">
                                        {make.name}
                                    </h3>
                                    {make.description && (
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed relative z-10">
                                            {make.description}
                                        </p>
                                    )}
                                    
                                    {/* Hover Arrow Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                        <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-brand-600 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MakeListPage;
