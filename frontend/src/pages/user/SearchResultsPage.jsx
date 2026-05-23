import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaBox, FaSearch } from 'react-icons/fa';
import SafeImage from '../../components/common/SafeImage';
import ProductCard from '../../components/product/ProductCard';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState({ models: [], products: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const { data } = await API.get(`/search?q=${query}`);
                setResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (!query) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen py-24 flex justify-center items-start font-sans">
                <div className="text-center bg-white p-10 rounded-[24px] shadow-sm max-w-md w-full mx-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaSearch className="text-3xl text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Search Products</h2>
                    <p className="text-slate-500">Please enter a search term to find models and parts.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen py-24 flex flex-col items-center font-sans">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Searching for "{query}"...</p>
            </div>
        );
    }

    const hasResults = results.models.length > 0 || results.products.length > 0;

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-10">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                        Search Results for <span className="text-brand-600">"{query}"</span>
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Found {results.models.length} models and {results.products.length} products.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl mt-12">
                {!hasResults && (
                    <div className="text-center py-24 bg-white rounded-[24px] border border-dashed border-slate-200 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaSearch className="text-2xl text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No results found</h3>
                        <p className="text-slate-500 mb-6">We couldn't find anything matching "{query}".</p>
                        <Link to="/" className="inline-block px-6 py-2.5 bg-brand-600 text-white font-bold rounded-full hover:bg-brand-700 transition-colors shadow-md">
                            Go Back Home
                        </Link>
                    </div>
                )}

                {/* Models Section */}
                {results.models.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-600 flex items-center justify-center">
                                <FaMobileAlt size={18} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Matching Models</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                            {results.models.map((model, index) => (
                                <motion.div
                                    key={model._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="h-full"
                                >
                                    <Link
                                        to={`/make/${model.make?.slug || 'unknown'}/model/${model.slug}/products`}
                                        className="bg-white rounded-[16px] shadow-sm hover:shadow-md transition-all p-5 border border-slate-100 hover:border-brand-200 block text-center group h-full flex flex-col"
                                    >
                                        <div className="h-20 w-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-50 transition-colors p-3">
                                            {model.image ? (
                                                <SafeImage src={model.image} alt={model.name} className="h-full w-full object-contain mix-blend-multiply" />
                                            ) : (
                                                <FaMobileAlt className="text-3xl text-slate-300 group-hover:text-brand-400 transition-colors" />
                                            )}
                                        </div>
                                        <h3 className="font-bold text-[15px] text-slate-800 group-hover:text-brand-600 transition-colors mt-auto leading-snug">
                                            {model.name}
                                        </h3>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Section */}
                {results.products.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <FaBox size={18} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Matching Products</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {results.products.map((product, index) => (
                                <div key={product._id} className="h-full">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;
