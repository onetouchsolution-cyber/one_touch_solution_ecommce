import React from 'react';
import { Link } from 'react-router-dom';

const WholesaleBanner = () => {
    return (
        <section className="my-12">
            <div className="relative w-full rounded-[2rem] overflow-hidden bg-slate-900 text-white shadow-2xl flex flex-col md:flex-row min-h-[250px]">
                {/* Left Content */}
                <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 md:w-1/2 lg:w-3/5">
                    <h2 className="text-sm md:text-base font-bold text-brand-400 tracking-widest uppercase mb-2">
                        Partner With Us.
                    </h2>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-6 text-white">
                        Wholesale Pricing <br className="hidden lg:block"/> For Technicians.
                    </h3>
                    <div>
                        <Link to="/contact" className="inline-block bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transform hover:-translate-y-0.5 text-sm uppercase tracking-wider">
                            Get Quote
                        </Link>
                    </div>
                </div>

                {/* Right Image/Visuals */}
                <div className="relative w-full md:w-1/2 lg:w-2/5 min-h-[200px] md:min-h-full">
                    {/* Dark gradient fade from left to right to blend image */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10"></div>
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }} // Placeholder, ideally industrial electronics or tools
                    />
                </div>
            </div>
        </section>
    );
};

export default WholesaleBanner;
