import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendar, FaMobileAlt } from 'react-icons/fa';
import API from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';

const ModelListPage = () => {
    const { categorySlug, makeSlug } = useParams();
    const [category, setCategory] = useState(null);
    const [make, setMake] = useState(null);
    const [models, setModels] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const isCategoryMode = !!categorySlug;

    useEffect(() => {
        fetchData();
    }, [categorySlug, makeSlug]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = models.filter(model =>
                model.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredModels(filtered);
        } else {
            setFilteredModels(models);
        }
    }, [searchTerm, models]);

    const fetchData = async () => {
        try {
            const { data: makeData } = await API.get(`/makes/${makeSlug}`);
            setMake(makeData);

            let modelsData;

            if (isCategoryMode) {
                const { data: categories } = await API.get('/categories');
                const foundCategory = categories.find(cat => cat.slug === categorySlug);
                setCategory(foundCategory);

                if (foundCategory) {
                    const { data } = await API.get(`/models/category-slug/${categorySlug}/make-slug/${makeSlug}`);
                    modelsData = data;
                }
            } else {
                const { data } = await API.get(`/models/make-slug/${makeSlug}`);
                modelsData = data;
            }

            setModels(modelsData || []);
            setFilteredModels(modelsData || []);
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
                    <p className="text-slate-500 font-medium">Loading models...</p>
                </div>
            </div>
        );
    }

    if (!make) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen py-20 flex justify-center items-start">
                <div className="text-center bg-white p-10 rounded-[24px] shadow-sm max-w-md w-full mx-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaMobileAlt className="text-3xl text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Make not found</h2>
                    <p className="text-slate-500 mb-8">We couldn't find the manufacturer you're looking for.</p>
                    <Link to="/makes" className="inline-block bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-md">
                        Browse Makes
                    </Link>
                </div>
            </div>
        );
    }

    const breadcrumbItems = isCategoryMode && category
        ? [
            { label: 'Categories', link: '/categories' },
            { label: category.name, link: `/category/${category.slug}` },
            { label: 'Makes', link: `/category/${categorySlug}/makes` },
            { label: make.name },
            { label: 'Models' }
        ]
        : [
            { label: 'Makes', link: '/makes' },
            { label: make.name },
            { label: 'Models' }
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
                        <div className="flex items-center gap-6">
                            {make.logo ? (
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-[24px] p-4 flex items-center justify-center border border-slate-100 shadow-sm">
                                    <img src={make.logo} alt={make.name} className="max-w-full max-h-full object-contain" />
                                </div>
                            ) : (
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-[24px] flex items-center justify-center text-5xl font-bold text-slate-300 border border-slate-200">
                                    {make.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
                                    {make.name} <span className="text-slate-400 font-light">Models</span>
                                </h1>
                                <p className="text-slate-500 text-lg max-w-xl">
                                    {isCategoryMode && category ? `Select a model to view compatible ${category.name.toLowerCase()} parts.` : 'Select your device model to explore compatible premium parts and accessories.'}
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full md:w-[320px] relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search models (e.g., S21, iPhone 13)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-800 placeholder-slate-400 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl mt-12">
                {/* Models Grid */}
                {filteredModels.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[24px] border border-dashed border-slate-200 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaSearch className="text-2xl text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No models found</h3>
                        <p className="text-slate-500 mb-6">{searchTerm ? `No results matching "${searchTerm}"` : 'No models available currently.'}</p>
                        <Link
                            to={isCategoryMode ? `/category/${categorySlug}/makes` : '/makes'}
                            className="inline-block px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-colors"
                        >
                            Go Back to Makes
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredModels.map((model, index) => (
                            <motion.div
                                key={model._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="h-full"
                            >
                                <Link
                                    to={
                                        isCategoryMode
                                            ? `/category/${categorySlug}/make/${makeSlug}/model/${model.slug}/products`
                                            : `/make/${makeSlug}/model/${model.slug}/products`
                                    }
                                    className="block h-full bg-white rounded-[20px] shadow-soft hover:shadow-card-hover transition-all duration-300 p-5 border border-slate-100 hover:border-brand-100 group flex flex-col"
                                >
                                    <div className="h-40 mb-5 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform p-4 flex items-center justify-center relative">
                                        {model.image ? (
                                            <img
                                                src={model.image}
                                                alt={model.name}
                                                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="text-4xl font-bold text-slate-200">
                                                {model.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        {/* Hover arrow indicator */}
                                        <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all text-brand-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col text-center">
                                        <h3 className="text-[17px] font-bold text-slate-800 mb-2 group-hover:text-brand-600 transition-colors">
                                            {model.name}
                                        </h3>
                                        {model.description && (
                                            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                                                {model.description}
                                            </p>
                                        )}
                                        <div className="mt-auto pt-4 border-t border-slate-50/50 flex justify-center">
                                            {model.releaseYear ? (
                                                <div className="inline-flex items-center text-[11px] font-semibold tracking-wider uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                                                    <FaCalendar className="mr-1.5" />
                                                    {model.releaseYear}
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center text-[11px] font-semibold tracking-wider uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                                                    View Products
                                                </div>
                                            )}
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

export default ModelListPage;
