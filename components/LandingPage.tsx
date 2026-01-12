
import React, { useState } from 'react';
import Icon from './Icon';

interface LandingPageProps {
    onSearch: (location: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const suggestions = ["東京", "パリ", "ニューヨーク", "ロンドン", "ローマ"];

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
            <div className="text-center mb-8">
                <div className="font-bold text-5xl tracking-tight text-primary flex items-center gap-3 justify-center">
                    <Icon name="public" className="text-5xl" />
                    <h1>MachiLogue</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">世界の都市を、データで探求する。</p>
            </div>

            <form onSubmit={handleFormSubmit} className="w-full max-w-xl">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="都市名やランドマークを入力..."
                        className="w-full px-6 py-4 pr-14 text-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 rounded-full shadow-soft focus:ring-2 focus:ring-primary focus:outline-none transition"
                        aria-label="検索"
                    />
                    <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 p-3 bg-primary hover:bg-primary-dark rounded-full text-white transition">
                        <Icon name="search" />
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-500 dark:text-slate-400 mb-4">または、人気の都市を選択:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                    {suggestions.map(city => (
                        <button
                            key={city}
                            onClick={() => onSearch(city)}
                            className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-primary/50 transition font-medium"
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
