'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

export const POPULAR_CITIES: string[] = [
    'Ahmedabad',
    'Amsterdam',
    'Auckland',
    'Austin',
    'Bangkok',
    'Barcelona',
    'Beijing',
    'Bengaluru (Bangalore)',
    'Berlin',
    'Boston',
    'Brisbane',
    'Brussels',
    'Bhubaneswar',
    'Calgary',
    'Chandigarh',
    'Chennai',
    'Chicago',
    'Coimbatore',
    'Dallas',
    'Delhi / New Delhi',
    'Dubai',
    'Dublin',
    'Frankfurt',
    'Geneva',
    'Guwahati',
    'Hong Kong',
    'Houston',
    'Hyderabad',
    'Indore',
    'Istanbul',
    'Jaipur',
    'Jakarta',
    'Johannesburg',
    'Kochi (Cochin)',
    'Kolkata',
    'Kuala Lumpur',
    'Lagos',
    'Lisbon',
    'London',
    'Los Angeles',
    'Lucknow',
    'Madrid',
    'Manchester',
    'Melbourne',
    'Mexico City',
    'Miami',
    'Milan',
    'Montreal',
    'Mumbai',
    'Munich',
    'Nagpur',
    'Noida',
    'New York',
    'Osaka',
    'Oslo',
    'Paris',
    'Patna',
    'Perth',
    'Phoenix',
    'Prague',
    'Pune',
    'Ranchi',
    'Riyadh',
    'Rome',
    'San Francisco',
    'Seattle',
    'Seoul',
    'Shanghai',
    'Singapore',
    'Stockholm',
    'Surat',
    'Sydney',
    'Taipei',
    'Tel Aviv',
    'Thane',
    'Tokyo',
    'Toronto',
    'Vadodara',
    'Vancouver',
    'Vienna',
    'Visakhapatnam',
    'Warsaw',
    'Washington, D.C.',
    'Zurich',
];

interface CityComboboxProps {
    value: string;
    onChange: (city: string) => void;
    placeholder?: string;
    id?: string;
    className?: string;
}

export function CityCombobox({
    value,
    onChange,
    placeholder = 'Mumbai',
    id,
    className = '',
}: CityComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync input value if external value changes
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    // Filter cities based on user input
    const filteredCities = inputValue.trim()
        ? POPULAR_CITIES.filter(city =>
            city.toLowerCase().includes(inputValue.toLowerCase())
        ).sort((a, b) => {
            // Prioritize cities that START with the typed text
            const aStartsWith = a.toLowerCase().startsWith(inputValue.toLowerCase());
            const bStartsWith = b.toLowerCase().startsWith(inputValue.toLowerCase());
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return a.localeCompare(b);
        })
        : POPULAR_CITIES;

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val);
        setIsOpen(true);
    };

    const handleSelectCity = (city: string) => {
        setInputValue(city);
        onChange(city);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Input Trigger */}
            <div className="relative flex items-center bg-background border border-input rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-ring focus-within:border-foreground/50 transition-all">
                <MapPin className="w-4 h-4 text-muted-foreground ml-3 shrink-0" />
                <input
                    id={id}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full bg-transparent px-2.5 h-8 sm:h-11 text-[11px] sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    autoComplete="off"
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    tabIndex={-1}
                    className="pr-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Dropdown Suggestions List */}
            {isOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-card border border-border rounded-xl shadow-xl py-1 divide-y divide-border/40 animate-in fade-in-50 slide-in-from-top-1">
                    {filteredCities.length > 0 ? (
                        filteredCities.map(city => (
                            <button
                                key={city}
                                type="button"
                                onClick={() => handleSelectCity(city)}
                                className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-foreground hover:bg-muted/70 flex items-center justify-between transition-colors"
                            >
                                <span>{city}</span>
                                {inputValue && city.toLowerCase() === inputValue.toLowerCase() && (
                                    <span className="text-[10px] bg-yellow/20 text-yellow-700 dark:text-yellow px-2 py-0.5 rounded-md font-semibold">
                                        Selected
                                    </span>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="px-3.5 py-2.5 text-xs text-muted-foreground italic text-center">
                            Press Enter to use &quot;{inputValue}&quot;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
