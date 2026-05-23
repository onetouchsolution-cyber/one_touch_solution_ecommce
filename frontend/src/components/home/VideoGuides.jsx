import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const videos = [
    {
        id: 1,
        title: "How to replace iPhone 13 Screen",
        category: "Mobile Repair",
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isNew: true
    },
    {
        id: 2,
        title: "Installing NVMe SSD in Laptop",
        category: "Laptop Upgrades",
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isNew: false
    },
    {
        id: 3,
        title: "CCTV Camera Setup Guide",
        category: "Security Systems",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isNew: true
    },
    {
        id: 4,
        title: "Choosing the right power adapter",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isNew: false
    }
];

const VideoGuides = () => {
    return (
        <section className="mb-16">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">How-To & Video Guides</h2>
                <Link to="/guides" className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors uppercase tracking-wider">
                    View All
                </Link>
            </div>

            <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {videos.map((video) => (
                    <div key={video.id} className="snap-start shrink-0 w-[280px] md:w-auto relative group rounded-[1.5rem] overflow-hidden cursor-pointer">
                        {/* Image */}
                        <div className="relative pt-[65%] w-full bg-slate-900">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-80"></div>
                            <img 
                                src={video.image} 
                                alt={video.title} 
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-80"
                            />
                            
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 group-hover:bg-brand-600 group-hover:border-brand-500 group-hover:scale-110 transition-all duration-300 shadow-lg pl-1">
                                    <FaPlay size={16} />
                                </div>
                            </div>

                            {/* Badge */}
                            {video.isNew && (
                                <div className="absolute top-4 right-4 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                                    New
                                </div>
                            )}

                            {/* Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                <div className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">
                                    {video.category}
                                </div>
                                <h3 className="text-white font-semibold leading-tight line-clamp-2 text-sm md:text-base">
                                    {video.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VideoGuides;
