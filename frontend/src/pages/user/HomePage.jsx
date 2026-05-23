import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import HeroSlider from '../../components/home/HeroSlider';
import CategorySlider from '../../components/home/CategorySlider';
import WholesaleBanner from '../../components/home/WholesaleBanner';
import ProductShowcaseRow from '../../components/home/ProductShowcaseRow';
import VideoGuides from '../../components/home/VideoGuides';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products (ideally these would be separate endpoints)
                const { data } = await API.get('/products');
                // The API returns { products: [], total: ... } or just an array
                const productsData = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
                setProducts(productsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-200 border-t-brand-600"></div>
            </div>
        );
    }
    console.log(products);
    // Mocking the categories using the same products array for UI demonstration
    const featuredMobileCases = products.filter(p => p.category?.name?.toLowerCase().includes('case')).slice(0, 8);
    const trendingComponents = products.filter(p => p.category?.name?.toLowerCase().includes('cctv') || p.category?.name?.toLowerCase().includes('component')).slice(0, 8);
    const newArrivals = [...products].reverse().slice(0, 8);

    // If filter yields empty array, fallback to slicing the main array
    const displayFeatured = featuredMobileCases.length > 0 ? featuredMobileCases : products.slice(0, 8);
    const displayTrending = trendingComponents.length > 0 ? trendingComponents : products.slice(4, 12);
    const displayNew = newArrivals.length > 0 ? newArrivals : products.slice(8, 16);

    return (
        <div className="container mx-auto px-4 lg:px-8">
            {/* 1. Desktop: Wide Hero Banner | Mobile: Compact Hero Slider */}
            <HeroSlider />

            {/* 2. Category Section */}
            <CategorySlider />

            {/* 3. Wholesale Technician Banner */}
            <WholesaleBanner />

            {/* 4. Featured Mobile Cases (or general featured) */}
            <ProductShowcaseRow
                title="Featured Mobile Cases"
                products={displayFeatured}
                viewAllLink="/categories?key=mobile_cases"
            />

            {/* 5. Trending Components */}
            <ProductShowcaseRow
                title="Trending Components"
                products={displayTrending}
                viewAllLink="/products/laptop-computer"
            />

            {/* 6. New Arrivals */}
            <ProductShowcaseRow
                title="New Arrivals"
                products={displayNew}
                viewAllLink="/products"
            />

            {/* 7. Video Guide Section */}
            <VideoGuides />

        </div>
    );
};

export default HomePage;
