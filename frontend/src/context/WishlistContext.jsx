import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            const storedWishlist = localStorage.getItem('wishlistItems');
            return storedWishlist ? JSON.parse(storedWishlist) : [];
        } catch (error) {
            console.error('Failed to load wishlist from localStorage:', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        } catch (error) {
            console.error('Failed to save wishlist to localStorage:', error);
        }
    }, [wishlistItems]);

    const addToWishlist = (product) => {
        setWishlistItems((prevItems) => {
            const exists = prevItems.some((item) => item._id === product._id);
            if (!exists) {
                return [...prevItems, product];
            }
            return prevItems;
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== productId));
    };

    const toggleWishlist = (product) => {
        setWishlistItems((prevItems) => {
            const exists = prevItems.some((item) => item._id === product._id);
            if (exists) {
                return prevItems.filter((item) => item._id !== product._id);
            } else {
                return [...prevItems, product];
            }
        });
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some((item) => item._id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
