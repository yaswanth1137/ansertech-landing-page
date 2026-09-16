'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Bot, Phone, Calendar, Users, Settings, LogOut, X } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    icon: any;
    href: string;
    category: 'Navigation' | 'Actions' | 'Recent';
}

const STATIC_RESULTS: SearchResult[] = [
    { id: 'overview', title: 'Dashboard Overview', description: 'View business health analytics', icon: Command, href: '/dashboard', category: 'Navigation' },
    { id: 'agents', title: 'AI Agents', description: 'Manage and monitor your agents', icon: Bot, href: '/dashboard/agents', category: 'Navigation' },
    { id: 'calls', title: 'Call Logs', description: 'Review conversation transcripts', icon: Phone, href: '/dashboard/call-logs', category: 'Navigation' },
    { id: 'bookings', title: 'Bookings', description: 'Manage appointments', icon: Calendar, href: '/dashboard/bookings', category: 'Navigation' },
    { id: 'customers', title: 'Customers', description: 'Customer relationship management', icon: Users, href: '/dashboard/customers', category: 'Navigation' },
    { id: 'settings', title: 'Settings', description: 'Configure your profile', icon: Settings, href: '/dashboard/settings', category: 'Navigation' },
    { id: 'create-agent', title: 'Create New Agent', description: 'Start building a new AI agent', icon: Bot, href: '/dashboard/agents?action=new', category: 'Actions' },
    { id: 'logout', title: 'Sign Out', description: 'Securely end your session', icon: LogOut, href: '#', category: 'Actions' },
];

export default function SearchSpotlight({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredResults = query === ''
        ? STATIC_RESULTS.slice(0, 5)
        : STATIC_RESULTS.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

    const handleSelect = useCallback((item: SearchResult) => {
        if (item.id === 'logout') {
            signOut({ callbackUrl: '/' });
        } else {
            router.push(item.href);
        }
        onClose();
        setQuery('');
    }, [router, onClose]);

    useEffect(() => {
        if (isOpen) {
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredResults.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredResults[selectedIndex]) {
                    handleSelect(filteredResults[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredResults, selectedIndex, handleSelect, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-surface-overlay border border-border rounded-2xl shadow-[var(--shadow-dialog)] overflow-hidden"
                    >
                        {/* Search Input */}
                        <div className="relative flex items-center p-4 border-b border-border/50">
                            <Search size={20} className="text-muted-foreground mr-3" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search pages, actions, and settings..."
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                className="w-full bg-transparent text-lg text-foreground placeholder:text-muted-foreground/50 outline-none"
                            />
                            <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-muted text-muted-foreground rounded border border-border">ESC</span>
                                <button onClick={onClose}>
                                    <X size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[450px] overflow-y-auto p-2 custom-scrollbar">
                            {filteredResults.length > 0 ? (
                                <div className="space-y-1">
                                    {filteredResults.map((item, index) => {
                                        const isActive = index === selectedIndex;
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={item.id}
                                                onMouseMove={() => setSelectedIndex(index)}
                                                onClick={() => handleSelect(item)}
                                                className={cn(
                                                    "flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
                                                    isActive
                                                        ? "bg-muted/50 border-l-2 border-primary translate-x-1"
                                                        : "hover:bg-muted/30 border-l-2 border-transparent"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                                    isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                                )}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                        {item.title}
                                                        {isActive && (
                                                            <motion.span
                                                                initial={{ opacity: 0, x: -5 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                className="text-[10px] uppercase tracking-widest text-primary font-bold"
                                                            >
                                                                Enter
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-1 rounded">
                                                    {item.category}
                                                </div>
                                                <ArrowRight size={14} className={cn(
                                                    "transition-all duration-300",
                                                    isActive ? "text-primary translate-x-0 opacity-100" : "text-muted-foreground -translate-x-2 opacity-0"
                                                )} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <Search size={40} className="mb-4 opacity-20" />
                                    <p className="text-sm">No results found for "{query}"</p>
                                    <p className="text-xs mt-1 text-muted-foreground/60">Try searching for "Agents" or "Settings"</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 py-3 bg-surface-sunken/50 border-t border-border/50">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 bg-muted border border-border rounded">↑</kbd>
                                        <kbd className="px-1 py-0.5 bg-muted border border-border rounded">↓</kbd>
                                    </div>
                                    <span>to navigate</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                    <kbd className="px-1 py-0.5 bg-muted border border-border rounded">Enter</kbd>
                                    <span>to select</span>
                                </div>
                            </div>
                            <div className="text-[10px] text-muted-foreground font-medium">
                                AnserTech <span className="text-primary">Global Search</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
