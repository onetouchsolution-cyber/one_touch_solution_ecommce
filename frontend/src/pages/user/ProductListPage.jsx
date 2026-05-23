import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilters from '../../components/product/ProductFilters';
import ProductSort from '../../components/product/ProductSort';

// Icon mapping for dynamically loaded subcategories
const subcategoryIcons = {
    'battery': '⚡',
    'screen': '📱',
    'display': '📱',
    'display-screen': '📱',
    'charging-port': '🔋',
    'card-display': '📇',
    'cables': '🔌',
    'accessories': '🎧',
    'tools': '🛠️',
    'screen-guard': '🛡️',
    'charger': '🔌',
    'diamond-case': '💎',
};

const getIconForSubcategory = (slug, name) => {
    if (subcategoryIcons[slug]) return subcategoryIcons[slug];
    
    const lowerName = name.toLowerCase();
    if (lowerName.includes('battery')) return '⚡';
    if (lowerName.includes('screen') || lowerName.includes('display')) return '📱';
    if (lowerName.includes('charge') || lowerName.includes('cable') || lowerName.includes('port')) return '🔌';
    if (lowerName.includes('case') || lowerName.includes('cover')) return '📱';
    if (lowerName.includes('tool')) return '🛠️';
    
    return '📦'; // Default icon
};

const ProductListPage = ({ vertical }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [filterMeta, setFilterMeta] = useState({ categories: [], subcategories: [], makes: [], models: [] });

    const params = Object.fromEntries([...searchParams]);

    const filters = {
        group: vertical,
        categoryKey: params.categoryKey || '',
        subcategorySlug: params.subcategorySlug || '',
        makeSlug: params.makeSlug || '',
        modelSlug: params.modelSlug || '',
        brandSlug: params.brandSlug || '',
        minPrice: params.minPrice || '',
        maxPrice: params.maxPrice || '',
        inStock: params.inStock || '',
        sort: params.sort || 'new',
        page: params.page || 1,
        ...params
    };

    const updateFilters = (newFilters) => {
        let nextParams = { ...params, ...newFilters };

        Object.keys(nextParams).forEach(key => {
            if (nextParams[key] === '' || nextParams[key] === undefined) delete nextParams[key];
        });

        if (vertical) delete nextParams.group;
        setSearchParams(nextParams);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams(filters);
                if (vertical) query.set('group', vertical);

                const { data } = await API.get(`/products?${query.toString()}`);

                if (data.products) {
                    setProducts(data.products);
                    setMeta({ page: data.page, pages: data.pages, total: data.total });
                } else {
                    setProducts(data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch products', error);
                setLoading(false);
            }
        };

        const fetchFilterMeta = async () => {
            try {
                const metaQuery = new URLSearchParams({
                    group: vertical || '',
                    categoryKey: filters.categoryKey || '',
                    subcategorySlug: filters.subcategorySlug || '',
                    makeSlug: filters.makeSlug || '',
                    modelSlug: filters.modelSlug || ''
                });

                const { data } = await API.get(`/products/filters/smart?${metaQuery.toString()}`);
                setFilterMeta(data);

                let cleanup = {};
                let needsCleanup = false;
                const isInvalid = (slug, list) => list && list.length > 0 && !list.some(i => i.slug === slug);

                if (filters.subcategorySlug && isInvalid(filters.subcategorySlug, data.subcategories)) {
                    cleanup.subcategorySlug = '';
                    needsCleanup = true;
                }

                if (filters.makeSlug && data.makes && data.makes.length > 0) {
                    const selected = filters.makeSlug.split(',');
                    const validSlugs = data.makes.map(m => m.slug);
                    const newSelected = selected.filter(s => validSlugs.includes(s));

                    if (newSelected.length !== selected.length) {
                        cleanup.makeSlug = newSelected.join(',');
                        needsCleanup = true;
                    }
                }

                if (filters.modelSlug && isInvalid(filters.modelSlug, data.models)) {
                    cleanup.modelSlug = '';
                    needsCleanup = true;
                }

                if (needsCleanup) {
                    updateFilters(cleanup);
                }

            } catch (err) {
                console.error("Failed to fetch filters", err);
            }
        };

        fetchProducts();
        fetchFilterMeta();
        window.scrollTo(0, 0);
    }, [searchParams, vertical]);

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-16 font-sans">
            {/* Top Categories Scrollable Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex gap-8 overflow-x-auto custom-scrollbar pb-2 hide-scrollbar">
                        {filterMeta.subcategories && filterMeta.subcategories.length > 0 && (
                            filterMeta.subcategories.map((subcat, i) => {
                                const isSelected = filters.subcategorySlug === subcat.slug;
                                return (
                                    <div 
                                        key={subcat._id || i} 
                                        onClick={() => updateFilters({ subcategorySlug: isSelected ? '' : subcat.slug, page: 1 })}
                                        className={`flex flex-col items-center gap-1.5 min-w-[70px] cursor-pointer group ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-colors shadow-sm border ${isSelected ? 'bg-brand-50 border-brand-200' : 'bg-slate-50 border-slate-100 group-hover:bg-brand-50'}`}>
                                            {getIconForSubcategory(subcat.slug, subcat.name)}
                                        </div>
                                        <span className={`text-[11px] font-semibold whitespace-nowrap ${isSelected ? 'text-brand-600' : 'text-slate-600 group-hover:text-brand-600'}`}>
                                            {subcat.name}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                
                {/* Mobile Filter Button & Title Area */}
                <div className="md:hidden flex flex-col gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 capitalize">
                        {vertical ? vertical.replace('-', ' & ') + ' Products' : 'All Products'}
                    </h1>
                    <div className="flex items-center gap-2 w-full">
                        <button
                            className="flex-1 flex items-center justify-center gap-2 h-11 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <FaFilter className="text-slate-400" /> Filters
                        </button>
                        <div className="flex-1">
                            <ProductSort currentSort={filters.sort} onSortChange={(val) => updateFilters({ sort: val, page: 1 })} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden md:block w-[260px] lg:w-[280px] flex-shrink-0">
                        <div className="sticky top-[110px] pr-2">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">Filters</h2>
                            <ProductFilters
                                filters={filters}
                                setFilters={(fn) => {
                                    const newState = fn(filters);
                                    updateFilters(newState);
                                }}
                                meta={filterMeta}
                            />
                        </div>
                    </aside>

                    {/* Mobile Filters Bottom Sheet */}
                    <AnimatePresence>
                        {showMobileFilters && (
                            <React.Fragment>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
                                    onClick={() => setShowMobileFilters(false)}
                                />
                                <motion.div
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    exit={{ y: '100%' }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#F8FAFC] rounded-t-3xl z-50 overflow-hidden flex flex-col md:hidden shadow-2xl"
                                >
                                    <div className="flex justify-between items-center p-5 bg-white border-b border-slate-100 shrink-0 rounded-t-3xl">
                                        <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                                        <button 
                                            onClick={() => setShowMobileFilters(false)}
                                            className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4">
                                        <ProductFilters
                                            filters={filters}
                                            setFilters={(fn) => {
                                                const newState = fn(filters);
                                                updateFilters(newState);
                                            }}
                                            meta={filterMeta}
                                        />
                                    </div>
                                    <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                                        <button 
                                            onClick={() => setShowMobileFilters(false)}
                                            className="w-full h-12 bg-brand-600 text-white font-bold rounded-xl shadow-md"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </motion.div>
                            </React.Fragment>
                        )}
                    </AnimatePresence>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        {/* Desktop Header */}
                        <div className="hidden md:flex justify-between items-end mb-6 bg-white p-5 rounded-[20px] shadow-sm border border-slate-100">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 capitalize mb-1">
                                    {vertical ? vertical.replace('-', ' & ') + ' Products' : 'All Products'}
                                </h1>
                                <p className="text-sm font-medium text-slate-500">
                                    Showing <span className="text-slate-900">{products.length}</span> of <span className="text-slate-900">{meta.total}</span> products
                                </p>
                            </div>
                            <div className="w-48">
                                <ProductSort currentSort={filters.sort} onSortChange={(val) => updateFilters({ sort: val, page: 1 })} />
                            </div>
                        </div>

                        {/* Products Grid */}
                        <ProductGrid products={products} loading={loading} />

                        {/* Pagination */}
                        {meta.pages > 1 && (
                            <div className="flex justify-center mt-12 gap-2">
                                {[...Array(meta.pages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => {
                                            updateFilters({ page: i + 1 });
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-sm
                                            ${(i + 1) === Number(filters.page)
                                                ? 'bg-brand-600 text-white shadow-brand-600/20'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
