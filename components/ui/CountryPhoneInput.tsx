'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Phone, ChevronDown } from 'lucide-react';

export interface CountryCode {
    code: string;       // e.g. "+91"
    country: string;    // e.g. "IN"
    flag: string;       // e.g. "🇮🇳"
    name: string;       // e.g. "India"
}

// Alphabetically sorted comprehensive list of country codes
export const ALL_COUNTRY_CODES: CountryCode[] = [
    { code: '+93', country: 'AF', flag: '🇦🇫', name: 'Afghanistan' },
    { code: '+355', country: 'AL', flag: '🇦🇱', name: 'Albania' },
    { code: '+213', country: 'DZ', flag: '🇩🇿', name: 'Algeria' },
    { code: '+376', country: 'AD', flag: '🇦🇩', name: 'Andorra' },
    { code: '+244', country: 'AO', flag: '🇦🇴', name: 'Angola' },
    { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina' },
    { code: '+374', country: 'AM', flag: '🇦🇲', name: 'Armenia' },
    { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
    { code: '+43', country: 'AT', flag: '🇦🇹', name: 'Austria' },
    { code: '+994', country: 'AZ', flag: '🇦🇿', name: 'Azerbaijan' },
    { code: '+973', country: 'BH', flag: '🇧🇭', name: 'Bahrain' },
    { code: '+880', country: 'BD', flag: '🇧🇩', name: 'Bangladesh' },
    { code: '+375', country: 'BY', flag: '🇧🇾', name: 'Belarus' },
    { code: '+32', country: 'BE', flag: '🇧🇪', name: 'Belgium' },
    { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
    { code: '+359', country: 'BG', flag: '🇧🇬', name: 'Bulgaria' },
    { code: '+855', country: 'KH', flag: '🇰🇭', name: 'Cambodia' },
    { code: '+1', country: 'CA', flag: '🇨🇦', name: 'Canada' },
    { code: '+56', country: 'CL', flag: '🇨🇱', name: 'Chile' },
    { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
    { code: '+57', country: 'CO', flag: '🇨🇴', name: 'Colombia' },
    { code: '+385', country: 'HR', flag: '🇭🇷', name: 'Croatia' },
    { code: '+357', country: 'CY', flag: '🇨🇾', name: 'Cyprus' },
    { code: '+420', country: 'CZ', flag: '🇨🇿', name: 'Czech Republic' },
    { code: '+45', country: 'DK', flag: '🇩🇰', name: 'Denmark' },
    { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt' },
    { code: '+372', country: 'EE', flag: '🇪🇪', name: 'Estonia' },
    { code: '+358', country: 'FI', flag: '🇫🇮', name: 'Finland' },
    { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
    { code: '+995', country: 'GE', flag: '🇬🇪', name: 'Georgia' },
    { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
    { code: '+30', country: 'GR', flag: '🇬🇷', name: 'Greece' },
    { code: '+852', country: 'HK', flag: '🇭🇰', name: 'Hong Kong' },
    { code: '+36', country: 'HU', flag: '🇭🇺', name: 'Hungary' },
    { code: '+354', country: 'IS', flag: '🇮🇸', name: 'Iceland' },
    { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
    { code: '+62', country: 'ID', flag: '🇮🇩', name: 'Indonesia' },
    { code: '+353', country: 'IE', flag: '🇮🇪', name: 'Ireland' },
    { code: '+972', country: 'IL', flag: '🇮🇱', name: 'Israel' },
    { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
    { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
    { code: '+962', country: 'JO', flag: '🇯🇴', name: 'Jordan' },
    { code: '+7', country: 'KZ', flag: '🇰🇿', name: 'Kazakhstan' },
    { code: '+254', country: 'KE', flag: '🇰🇪', name: 'Kenya' },
    { code: '+965', country: 'KW', flag: '🇰🇼', name: 'Kuwait' },
    { code: '+961', country: 'LB', flag: '🇱🇧', name: 'Lebanon' },
    { code: '+60', country: 'MY', flag: '🇲🇾', name: 'Malaysia' },
    { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico' },
    { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Netherlands' },
    { code: '+64', country: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
    { code: '+234', country: 'NG', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+47', country: 'NO', flag: '🇳🇴', name: 'Norway' },
    { code: '+968', country: 'OM', flag: '🇴🇲', name: 'Oman' },
    { code: '+92', country: 'PK', flag: '🇵🇰', name: 'Pakistan' },
    { code: '+63', country: 'PH', flag: '🇵🇭', name: 'Philippines' },
    { code: '+48', country: 'PL', flag: '🇵🇱', name: 'Poland' },
    { code: '+351', country: 'PT', flag: '🇵🇹', name: 'Portugal' },
    { code: '+974', country: 'QA', flag: '🇶🇦', name: 'Qatar' },
    { code: '+40', country: 'RO', flag: '🇷🇴', name: 'Romania' },
    { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
    { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' },
    { code: '+27', country: 'ZA', flag: '🇿🇦', name: 'South Africa' },
    { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
    { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain' },
    { code: '+94', country: 'LK', flag: '🇱🇰', name: 'Sri Lanka' },
    { code: '+46', country: 'SE', flag: '🇸🇪', name: 'Sweden' },
    { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Switzerland' },
    { code: '+886', country: 'TW', flag: '🇹🇼', name: 'Taiwan' },
    { code: '+66', country: 'TH', flag: '🇹🇭', name: 'Thailand' },
    { code: '+90', country: 'TR', flag: '🇹🇷', name: 'Turkey' },
    { code: '+380', country: 'UA', flag: '🇺🇦', name: 'Ukraine' },
    { code: '+971', country: 'AE', flag: '🇦🇪', name: 'United Arab Emirates' },
    { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
    { code: '+84', country: 'VN', flag: '🇻🇳', name: 'Vietnam' },
];

interface CountryPhoneInputProps {
    value: string;
    onChange: (fullNumber: string) => void;
    placeholder?: string;
    id?: string;
    className?: string;
}

export function CountryPhoneInput({
    value,
    onChange,
    placeholder = '98765 43210',
    id,
    className = '',
}: CountryPhoneInputProps) {
    const [selectedCode, setSelectedCode] = useState<string>('+91');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse initial value or value changes
    useEffect(() => {
        if (!value) {
            setPhoneNumber('');
            return;
        }

        const matched = ALL_COUNTRY_CODES.find(c => value.startsWith(c.code));
        if (matched) {
            setSelectedCode(matched.code);
            const rest = value.slice(matched.code.length).trim();
            setPhoneNumber(rest);
        } else if (value.startsWith('+')) {
            const spaceIdx = value.indexOf(' ');
            if (spaceIdx > -1) {
                const code = value.slice(0, spaceIdx);
                setSelectedCode(code);
                setPhoneNumber(value.slice(spaceIdx + 1));
            } else {
                setPhoneNumber(value);
            }
        } else {
            setPhoneNumber(value);
        }
    }, [value]);

    // Handle outside click to close dropdown panel
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle typing in phone input
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value;

        let detectedCode = selectedCode;
        if (input.startsWith('+')) {
            const matched = ALL_COUNTRY_CODES.find(c => input.startsWith(c.code));
            if (matched) {
                detectedCode = matched.code;
                input = input.slice(matched.code.length).trim();
                setSelectedCode(detectedCode);
            }
        } else {
            for (const c of ALL_COUNTRY_CODES) {
                const rawDigits = c.code.replace('+', '');
                if (input.startsWith(rawDigits) && input.length >= rawDigits.length + 7) {
                    detectedCode = c.code;
                    input = input.slice(rawDigits.length).trim();
                    setSelectedCode(detectedCode);
                    break;
                }
            }
        }

        setPhoneNumber(input);
        onChange(input ? `${detectedCode} ${input}` : '');
    };

    const handleSelectCountry = (code: string) => {
        setSelectedCode(code);
        onChange(phoneNumber ? `${code} ${phoneNumber}` : '');
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Input Container */}
            <div className="relative flex items-center bg-background border border-input rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-ring focus-within:border-foreground/50 transition-all">
                {/* Country Code Trigger (Seamless inline trigger without box) */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 pl-3 pr-1 py-2 text-xs sm:text-sm font-mono font-semibold text-foreground hover:text-foreground/80 transition-colors shrink-0 focus:outline-none"
                >
                    <span>{selectedCode}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Phone Digits Input */}
                <input
                    id={id}
                    type="tel"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full bg-transparent px-2 h-8 sm:h-11 text-[11px] sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
                    autoComplete="off"
                />
            </div>

            {/* Floating Dropdown Panel (Matches CityCombobox panel style) */}
            {isOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-card border border-border rounded-xl shadow-xl py-1 divide-y divide-border/40 animate-in fade-in-50 slide-in-from-top-1">
                    {ALL_COUNTRY_CODES.map(c => (
                        <button
                            key={c.country + c.code}
                            type="button"
                            onClick={() => handleSelectCountry(c.code)}
                            className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-foreground hover:bg-muted/70 flex items-center justify-between transition-colors"
                        >
                            <span className="font-medium">{c.name}</span>
                            <span className="font-mono text-xs text-muted-foreground">{c.code}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
