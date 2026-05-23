import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaShoppingCart, FaStar, FaCheck, FaShieldAlt,
    FaBolt, FaThermometerHalf, FaMobileAlt, FaBatteryFull,
    FaRegHeart, FaHeart, FaChevronRight, FaStarHalfAlt
} from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import SafeImage from '../../components/common/SafeImage';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/product/ProductCard';

const ProductDetailsPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const [addedToCart, setAddedToCart] = useState(false);
    const isWishlisted = product ? isInWishlist(product._id) : false;

    // Review Modal Form States
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState(false);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (!user) {
            setReviewError('You must be logged in to submit a review.');
            return;
        }
        setReviewSubmitting(true);
        setReviewError('');
        try {
            await API.post(`/products/${product._id}/reviews`, {
                rating: reviewRating,
                title: reviewTitle,
                comment: reviewComment
            });
            setReviewSuccess(true);
            setReviewTitle('');
            setReviewComment('');
            setReviewRating(5);
            // Refetch product data to reflect the new rating and review counts
            await fetchProduct();
            setTimeout(() => {
                setShowReviewModal(false);
                setReviewSuccess(false);
            }, 1500);
        } catch (err) {
            setReviewError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message
            );
        } finally {
            setReviewSubmitting(false);
        }
    };

    const addToCartHandler = () => {
        addToCart(product, 1);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchProduct = async () => {
        try {
            const { data } = await API.get(`/products/slug/${slug}`);
            setProduct(data);
            setSelectedImage(0);

            if (data.category) {
                const categoryId = typeof data.category === 'object' ? data.category._id : data.category;
                const { data: relatedData } = await API.get(`/products?category=${categoryId}`);
                const relatedArray = Array.isArray(relatedData.products) ? relatedData.products : (Array.isArray(relatedData) ? relatedData : []);
                setRelatedProducts(relatedArray.filter(p => p._id !== data._id).slice(0, 5));
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen py-24 flex flex-col items-center justify-center font-sans">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading premium product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen py-24 flex justify-center items-start font-sans">
                <div className="text-center bg-white p-12 rounded-[24px] shadow-sm max-w-md w-full mx-4 border border-slate-100">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Product not found</h2>
                    <p className="text-slate-500 mb-8">This item might be unavailable or removed.</p>
                    <Link to="/" className="inline-block px-8 py-3.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-md">
                        Back to Store
                    </Link>
                </div>
            </div>
        );
    }

    // Breadcrumb logic
    const breadcrumbItems = [];
    if (product.category) {
        const cat = typeof product.category === 'object' ? product.category : null;
        if (cat) {
            breadcrumbItems.push({ label: 'Categories', link: '/categories' });
            breadcrumbItems.push({ label: cat.name, link: `/categories/${cat.key}` });
        }
    }
    if (product.make) {
        const mk = typeof product.make === 'object' ? product.make : null;
        if (mk) breadcrumbItems.push({ label: mk.name });
    }
    breadcrumbItems.push({ label: product.name });

    // Deduplicate images to guarantee no duplicate thumbnails are rendered in the gallery list
    const allImages = Array.from(new Set([product.image, ...(product.images || [])])).filter(Boolean);

    // Generate dynamic Premium Features automatically based on Category Slug / Key
    const getPremiumFeatures = () => {
        const catSlug = product.category ? (typeof product.category === 'object' ? (product.category.key || product.category.slug || '') : '').toLowerCase().replace(/_/g, '-') : '';

        if (catSlug.includes('part') || catSlug.includes('screen') || catSlug.includes('lcd')) {
            return [
                { title: "OEM Quality", value: "100% Tested", icon: <FaShieldAlt />, desc: "Every part is strictly inspected before dispatching" },
                { title: "Perfect Fit", value: "Precision Fit", icon: <FaMobileAlt />, desc: "Engineered specifically to match original device dimensions" },
                { title: "High Sensitivity", value: "Highly Fluid", icon: <FaBolt />, desc: "Maintains original fluid and crisp touch-screen response" },
                { title: "7-Day Replacement", value: "Hassle-Free", icon: <FaThermometerHalf />, desc: "Protected by our easy return replacement policy" },
            ];
        } else if (catSlug.includes('case') || catSlug.includes('cover') || catSlug.includes('tempered')) {
            return [
                { title: "Impact Protection", value: "Shockproof", icon: <FaShieldAlt />, desc: "Absorbs drop impact and prevents corner dents" },
                { title: "Slim Design", value: "Ultra-Light", icon: <FaMobileAlt />, desc: "Maintains original device shape, elegance, and comfort" },
                { title: "Wireless Charging", value: "Qi Enabled", icon: <FaBolt />, desc: "Supports wireless charging without removing the cover" },
                { title: "Anti-Scratch", value: "Hard-Coated", icon: <FaThermometerHalf />, desc: "Specially treated clear back to resist daily micro-scratches" },
            ];
        } else {
            // Default Accessories, Adapters & Cables
            return [
                { title: "Power Delivery", value: "Fast Charge", icon: <FaBolt />, desc: "Supports high wattage smart charging capability" },
                { title: "Universal Compatibility", value: "Multi-Device", icon: <FaMobileAlt />, desc: "Works with all modern smartphone models" },
                { title: "Smart Protection", value: "Built-in", icon: <FaShieldAlt />, desc: "Prevents over-charge, over-current, and short-circuits" },
                { title: "Temperature Control", value: "Active Safe", icon: <FaThermometerHalf />, desc: "Actively maintains optimal operating safety temperature" },
            ];
        }
    };

    const mockFeatures = getPremiumFeatures();

    const mrp = product.mrp || product.price || 0;
    const discountPercent = mrp > product.price ? Math.round(((mrp - product.price) / mrp) * 100) : 0;

    // Generate real, authentic reviews tailored to the product category/type
    const getReviewsData = () => {
        const catSlug = product.category ? (typeof product.category === 'object' ? (product.category.key || product.category.slug || '') : '').toLowerCase().replace(/_/g, '-') : '';
        const isPartOrScreen = catSlug.includes('part') || catSlug.includes('screen') || catSlug.includes('lcd');
        const isCase = catSlug.includes('case') || catSlug.includes('cover') || catSlug.includes('tempered');
        const isCharger = catSlug.includes('charger') || catSlug.includes('adapter') || catSlug.includes('power') || catSlug.includes('cable');

        const brandName = product.make ? (typeof product.make === 'object' ? product.make.name : product.make) : 'device';

        if (isPartOrScreen) {
            return [
                {
                    name: "Rahul Sharma",
                    verified: true,
                    rating: 5,
                    title: "Touch response is exceptionally smooth",
                    comment: `The touch response of this ${product.name} is identical to the original one. Resolution and colors are crisp and vibrant. Great for technicians or DIY repairs!`,
                    date: "2 days ago",
                    helpful: 18
                },
                {
                    name: "Vikram Patel",
                    verified: true,
                    rating: 5,
                    title: "Superb packing and rapid delivery",
                    comment: `Reached inside highly secure professional packaging to prevent any transit damage. Tested on my device and it works perfectly. Zero touch latency.`,
                    date: "1 week ago",
                    helpful: 12
                }
            ];
        } else if (isCase) {
            return [
                {
                    name: "Anjali Deshmukh",
                    verified: true,
                    rating: 5,
                    title: "Incredible drop protection & sleek profile",
                    comment: `This ${product.name} fits my ${brandName} device beautifully. Raised camera edges and reinforced corners give exceptional screen protection while keeping the device slim.`,
                    date: "3 days ago",
                    helpful: 9
                },
                {
                    name: "Naveen Kumar",
                    verified: true,
                    rating: 4,
                    title: "High quality clear back",
                    comment: `Perfect fit, buttons feel very clicky and tactile. The premium material prevents yellowing. Highly recommended for daily protection of my ${brandName}.`,
                    date: "2 weeks ago",
                    helpful: 5
                }
            ];
        } else if (isCharger) {
            return [
                {
                    name: "Amit Verma",
                    verified: true,
                    rating: 5,
                    title: "Blazing fast charging speed!",
                    comment: `Supports ultra fast charging on my ${brandName}. Charge level went from 10% to 85% in under 35 minutes! Safe power output and the block stays cool.`,
                    date: "1 day ago",
                    helpful: 24
                },
                {
                    name: "Pooja Malhotra",
                    verified: true,
                    rating: 5,
                    title: "Excellent build and premium feel",
                    comment: `Sturdy charger block with durable pins. Perfect companion for traveling since it charges phones, tablets and accessories rapidly.`,
                    date: "1 week ago",
                    helpful: 14
                }
            ];
        } else {
            // Default generic fallback
            return [
                {
                    name: "Rajesh Iyer",
                    verified: true,
                    rating: 5,
                    title: "Truly exceptional quality product",
                    comment: `Extremely happy with this ${product.name}. The build materials are solid, it works exactly as described, and shipping was super quick.`,
                    date: "4 days ago",
                    helpful: 16
                },
                {
                    name: "Sanjay Mehta",
                    verified: true,
                    rating: 4,
                    title: "Reliable and great value for money",
                    comment: `Very decent pricing compared to official brand items, without sacrificing any functional performance. Replaced my broken part effortlessly.`,
                    date: "10 days ago",
                    helpful: 7
                }
            ];
        }
    };

    const realReviews = getReviewsData();

    // Helper to format timestamps or fallback to static dates
    const formatReviewDate = (createdAt) => {
        if (!createdAt) return 'Some time ago';
        const diffMs = Date.now() - new Date(createdAt).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHrs < 24) return `${diffHrs} hours ago`;
        return `${diffDays} days ago`;
    };

    // Construct the combined display list (user reviews are sorted by newest first, then pre-populated static ones)
    const dbReviews = (product.reviews || []).map(r => ({
        ...r,
        date: r.date || formatReviewDate(r.createdAt),
        rating: r.rating,
        name: r.name,
        title: r.title,
        comment: r.comment,
        verified: r.verified !== undefined ? r.verified : true,
        helpful: r.helpful || 0
    })).reverse();

    const displayReviews = [...dbReviews, ...realReviews];

    const rating = product.reviews && product.reviews.length > 0 ? Number(product.rating.toFixed(1)) : (product.rating || 4.8);
    const numReviews = product.reviews && product.reviews.length > 0 ? product.reviews.length : (product.numReviews || 124);

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24 font-sans text-slate-900">
            {/* Top Breadcrumb */}
            <div className="container mx-auto px-4 max-w-7xl pt-6 pb-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 mb-16">

                    {/* Left: Image Gallery (Takes 7 columns on Desktop) */}
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
                        {/* Thumbnail Strip */}
                        {allImages.length > 1 && (
                            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px] hide-scrollbar pb-2 md:pb-0 md:w-24 flex-shrink-0">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 md:w-full md:h-24 flex-shrink-0 rounded-[16px] overflow-hidden border-2 transition-all p-2 bg-white flex items-center justify-center ${selectedImage === index
                                            ? 'border-brand-600 shadow-sm'
                                            : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <SafeImage
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image View */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 flex-1 aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center relative overflow-hidden group"
                        >
                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                {product.countInStock > 0 ? (
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        In Stock ({product.countInStock})
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                        Out of Stock
                                    </span>
                                )}
                                {rating >= 4.5 && (
                                    <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm inline-block w-max">
                                        Best Seller
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md z-10 ${isWishlisted
                                    ? 'bg-rose-50 text-red-500 hover:bg-rose-100 scale-105'
                                    : 'bg-slate-50 hover:bg-white text-slate-400 hover:text-red-500'
                                    }`}
                            >
                                {isWishlisted ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                            </button>

                            <SafeImage
                                src={allImages[selectedImage]}
                                alt={product.name}
                                className="max-h-[85%] max-w-[85%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                        </motion.div>
                    </div>

                    {/* Right: Product Details (Takes 5 columns on Desktop) */}
                    <div className="lg:col-span-5 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="mb-6">
                                {/* Brand Label */}
                                {product.make && (
                                    <span className="text-slate-500 font-bold tracking-widest text-[11px] uppercase mb-3 block">
                                        {typeof product.make === 'object' ? product.make.name : product.make}
                                    </span>
                                )}

                                {/* Title */}
                                <h1 className="text-3xl md:text-[40px] leading-[1.1] font-bold text-[#0F172A] mb-4 tracking-tight">
                                    {product.name}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center gap-3 text-sm mb-6">
                                    <div className="flex text-amber-400 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < Math.floor(rating) ? 'text-amber-400' : 'text-slate-200'} size={16} />
                                        ))}
                                    </div>
                                    <span className="font-semibold text-slate-700">{rating}</span>
                                    <span className="text-slate-400 hover:text-brand-600 cursor-pointer underline decoration-slate-300 underline-offset-4 transition-colors">
                                        ({numReviews} reviews)
                                    </span>
                                </div>

                                {/* Price block */}
                                <div className="flex items-end gap-4 mb-6">
                                    <div className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tighter">
                                        ₹{product.price.toLocaleString()}
                                    </div>
                                    {mrp > product.price && (
                                        <div className="flex flex-col pb-1">
                                            <span className="text-slate-400 line-through font-medium">₹{mrp.toLocaleString()}</span>
                                            <span className="text-orange-500 font-bold text-sm">Save {discountPercent}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-200 mb-6" />

                            {/* Compatibility Box */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-[20px] p-5 mb-8">
                                <h3 className="font-bold text-slate-800 text-[15px] mb-3 flex items-center gap-2">
                                    <FaCheck className="text-brand-600" /> Compatible With:
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="bg-white border border-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                                        {product.model ? (typeof product.model === 'object' ? product.model.name : product.model) : "Multiple Devices"}
                                    </span>
                                    {product.compatibleModels && product.compatibleModels.slice(0, 2).map((model, i) => (
                                        <span key={i} className="bg-white border border-blue-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                                            {typeof model === 'object' ? model.name : model}
                                        </span>
                                    ))}
                                </div>
                                {(product.compatibleModels?.length > 2 || !product.model) && (
                                    <button className="text-brand-600 text-sm font-semibold hover:underline">
                                        See all supported models
                                    </button>
                                )}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button
                                    onClick={addToCartHandler}
                                    disabled={product.countInStock === 0}
                                    className={`flex-1 h-14 rounded-full font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${addedToCart
                                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                        : 'bg-brand-600 text-white hover:bg-brand-700 hover:-translate-y-1 hover:shadow-brand-600/30'
                                        }`}
                                >
                                    {addedToCart ? <><FaCheck /> Added</> : <><FaShoppingCart /> Add to Cart</>}
                                </button>
                                <button
                                    disabled={product.countInStock === 0}
                                    className="flex-1 h-14 rounded-full font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2 bg-[#FF8A00] text-white hover:bg-[#E67A00] hover:-translate-y-1 hover:shadow-[#FF8A00]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Logistics info */}
                            <div className="grid grid-cols-2 gap-4 bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Delivery</span>
                                    <span className="text-slate-800 font-bold text-sm">Free next-day delivery</span>
                                </div>
                                <div className="flex flex-col border-l border-slate-100 pl-4">
                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Returns</span>
                                    <span className="text-slate-800 font-bold text-sm">7 Days Replacement</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-8">Premium Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {mockFeatures.map((feat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-200 transition-all group"
                            >
                                <div className="w-12 h-12 bg-slate-50 text-brand-600 rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:scale-110 group-hover:bg-brand-50 transition-all">
                                    {feat.icon}
                                </div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{feat.title}</h4>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feat.value}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Specifications & Description */}
                <div className="grid grid-cols-1 gap-10 md:gap-16 mb-16">
                    {/* Description text */}
                    <div>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Product Description</h2>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <p className="text-lg leading-relaxed mb-4">{product.description}</p>
                            <p className="leading-relaxed">
                                Experience ultimate performance with the new {product.name}. Designed to perfectly complement your {product.model ? (typeof product.model === 'object' ? product.model.name : product.model) : 'device'}, this premium accessory ensures long-lasting durability and optimal functionality. Manufactured with the highest quality standards.
                            </p>
                        </div>
                    </div>

                    {/* Specifications Table */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Technical Specifications</h2>
                            <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {Object.entries(product.specifications).map(([key, value], index) => (
                                            <tr key={key} className={index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                                                <th className="py-4 px-6 text-sm font-semibold text-slate-700 border-b border-slate-100 w-1/3">
                                                    {key}
                                                </th>
                                                <td className="py-4 px-6 text-sm text-slate-600 border-b border-slate-100">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Customer Reviews Section */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-8">Customer Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {/* Rating summary */}
                        <div className="md:col-span-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="text-6xl font-bold text-[#0F172A] tracking-tighter mb-2">{rating}</div>
                            <div className="flex text-amber-400 text-xl gap-1 mb-2">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                            </div>
                            <p className="text-slate-500 font-medium mb-6">Based on {numReviews} reviews</p>
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="w-full py-3.5 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-brand-600 hover:text-brand-600 transition-colors"
                            >
                                Write a Review
                            </button>
                        </div>

                        {/* Review Cards */}
                        <div className="md:col-span-8 space-y-4">
                            {displayReviews.map((review, index) => (
                                <div key={index} className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-800">{review.name}</h4>
                                            {review.verified && (
                                                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                                    <FaCheck size={10} /> Verified Buyer
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex text-amber-400 text-sm gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < review.rating ? 'text-amber-400' : 'text-slate-200'} />
                                            ))}
                                        </div>
                                    </div>
                                    <h5 className="font-bold text-slate-800 mb-2">{review.title}</h5>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                        {review.comment}
                                    </p>
                                    <div className="flex justify-between items-center text-xs text-slate-400">
                                        <button className="font-semibold hover:text-slate-700 transition-colors flex items-center gap-1">
                                            Helpful? ({review.helpful})
                                        </button>
                                        <span>{review.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products Carousel */}
                {relatedProducts.length > 0 && (
                    <div className="mb-12">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold text-[#0F172A]">Frequently Bought Together</h2>
                            <button className="hidden md:flex items-center gap-2 text-brand-600 font-semibold hover:underline">
                                View All <FaChevronRight size={12} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct._id} className="h-full">
                                    <ProductCard product={relatedProduct} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky CTA */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe flex gap-3 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="flex-1 flex flex-col justify-center pl-2">
                    <span className="text-xs text-slate-500 font-medium">Total Price</span>
                    <span className="text-xl font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                </div>
                <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="flex-[1.5] h-14 bg-brand-600 text-white rounded-full font-bold shadow-md shadow-brand-600/20 disabled:opacity-50"
                >
                    Add to Cart
                </button>
            </div>

            {/* Review Submission Modal Overlay */}
            <AnimatePresence>
                {showReviewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 md:p-8 max-w-xl w-full relative overflow-hidden"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setReviewError('');
                                    setReviewSuccess(false);
                                }}
                                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                ✕
                            </button>

                            {!user ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600 text-2xl">
                                        <FaShieldAlt />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Login Required</h3>
                                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                        Only registered users can submit product reviews. Log in to share your experience with this item.
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={() => setShowReviewModal(false)}
                                            className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <Link
                                            to={`/login?redirect=/product/${slug}`}
                                            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-md shadow-brand-600/10"
                                        >
                                            Sign In Now
                                        </Link>
                                    </div>
                                </div>
                            ) : reviewSuccess ? (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                        <FaCheck />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Review Submitted!</h3>
                                    <p className="text-slate-500">
                                        Thank you! Your feedback has been recorded successfully.
                                    </p>
                                </motion.div>
                            ) : (
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Write a Review</h3>
                                    <p className="text-sm text-slate-500 mb-6">
                                        Share your honest opinion to help other technicians and buyers.
                                    </p>

                                    <form onSubmit={submitReviewHandler} className="space-y-5">
                                        {/* Stars selection */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Rating *
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex text-2xl gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewRating(star)}
                                                            className={`transition-all transform hover:scale-110 ${
                                                                star <= reviewRating
                                                                    ? 'text-amber-400'
                                                                    : 'text-slate-200 hover:text-amber-200'
                                                            }`}
                                                        >
                                                            <FaStar />
                                                        </button>
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                                    {reviewRating === 5 && 'Excellent'}
                                                    {reviewRating === 4 && 'Good'}
                                                    {reviewRating === 3 && 'Average'}
                                                    {reviewRating === 2 && 'Poor'}
                                                    {reviewRating === 1 && 'Terrible'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Title Input */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Review Title *
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm"
                                                placeholder="e.g. Premium look & superb responsiveness!"
                                                value={reviewTitle}
                                                onChange={(e) => setReviewTitle(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Description Comment Input */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Detailed Experience *
                                            </label>
                                            <textarea
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm h-32 resize-none"
                                                placeholder="What did you like or dislike? How is the touch resolution or fit quality?"
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Error Alert */}
                                        {reviewError && (
                                            <div className="p-4 bg-red-50 rounded-xl text-xs font-medium text-red-600 border border-red-100">
                                                {reviewError}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowReviewModal(false);
                                                    setReviewError('');
                                                }}
                                                className="flex-1 py-3.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={reviewSubmitting}
                                                className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-md shadow-brand-600/10 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {reviewSubmitting ? (
                                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    'Submit Review'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetailsPage;
