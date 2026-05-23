import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FilterSection = ({ title, items, selectedItems, onChange, searchKey = 'name' }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    if (!items || items.length === 0) return null;

    return (
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full font-bold text-slate-800 text-[15px] group"
            >
                {title}
                <span className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    {isOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                            {items.map(item => {
                                const isChecked = selectedItems.includes(item.slug);
                                return (
                                    <label key={item._id || item.slug} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => onChange(item.slug)}
                                                className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-[6px] checked:bg-brand-600 checked:border-brand-600 focus:outline-none transition-all cursor-pointer group-hover:border-brand-400"
                                            />
                                            <svg className="absolute w-3 h-3 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className={`text-[14px] flex-1 truncate transition-colors ${isChecked ? 'text-slate-900 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                            {item[searchKey]}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ProductFilters = ({ filters, setFilters, meta = {} }) => {

    const toggleFilter = (key, slug) => {
        setFilters(prev => {
            const rawValue = prev[key] || '';
            const current = rawValue ? rawValue.split(',') : [];

            let updated;
            if (current.includes(slug)) {
                updated = current.filter(i => i !== slug);
            } else {
                updated = [...current, slug];
            }
            return {
                ...prev,
                [key]: updated.join(','),
                page: 1
            };
        });
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    return (
        <div className="space-y-0 w-full">
            {/* Price Filter */}
            <div className="bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 mb-4">
                <h3 className="font-bold text-slate-800 text-[15px] mb-4">Price Range</h3>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Min"
                            value={filters.minPrice || ''}
                            onChange={handlePriceChange}
                            className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <span className="text-slate-300 font-medium">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="Max"
                            value={filters.maxPrice || ''}
                            onChange={handlePriceChange}
                            className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div className="bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 mb-4">
                <h3 className="font-bold text-slate-800 text-[15px] mb-4">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={filters.inStock === 'true'}
                            onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked ? 'true' : '', page: 1 }))}
                            className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-[6px] checked:bg-brand-600 checked:border-brand-600 focus:outline-none transition-all cursor-pointer group-hover:border-brand-400"
                        />
                        <svg className="absolute w-3 h-3 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-[14px] text-slate-600 group-hover:text-slate-900 transition-colors">In Stock Only</span>
                </label>
            </div>

            {/* Dynamic Filters */}
            <FilterSection
                title="Category"
                items={meta.categories}
                selectedItems={filters.categoryKey ? filters.categoryKey.split(',') : []}
                onChange={(slug) => toggleFilter('categoryKey', slug)}
                searchKey="name"
            />

            <FilterSection
                title="Brand (Make)"
                items={meta.makes}
                selectedItems={filters.makeSlug ? filters.makeSlug.split(',') : []}
                onChange={(slug) => toggleFilter('makeSlug', slug)}
            />

            <FilterSection
                title="Model"
                items={meta.models}
                selectedItems={filters.modelSlug ? filters.modelSlug.split(',') : []}
                onChange={(slug) => toggleFilter('modelSlug', slug)}
            />

            <FilterSection
                title="Subcategory"
                items={meta.subcategories}
                selectedItems={filters.subcategorySlug ? filters.subcategorySlug.split(',') : []}
                onChange={(slug) => toggleFilter('subcategorySlug', slug)}
            />

            <div className="pt-2">
                <button
                    onClick={() => setFilters(prev => ({ categoryKey: '', subcategorySlug: '', makeSlug: '', modelSlug: '', minPrice: '', maxPrice: '', inStock: '', page: 1 }))}
                    className="w-full py-3.5 text-[14px] font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-[14px] transition-all"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
};

export default ProductFilters;
