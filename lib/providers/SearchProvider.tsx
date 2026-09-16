'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import SearchSpotlight from '@/components/dashboard/SearchSpotlight';

interface SearchContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSearch = () => setIsOpen(prev => !prev);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <SearchContext.Provider value={{ isOpen, setIsOpen, toggleSearch }}>
            {children}
            <SearchSpotlight isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        return {
            isOpen: false,
            setIsOpen: () => {},
            toggleSearch: () => {},
        };
    }
    return context;
}
