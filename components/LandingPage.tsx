import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import type { SearchTag } from '../types';

interface LandingPageProps {
    onSearch: (location: string, tags: SearchTag[]) => void;
}

const AVAILABLE_TAGS: SearchTag[] = ['金融', 'トレンド', 'アート', '民俗', '交通・インフラ', 'グルメ', '人口流体'];

const CITY_CATEGORIES = [
    {
        title: "国内",
        cities: ["東京", "大阪", "京都", "札幌", "福岡", "那覇", "横浜", "名古屋", "金沢", "広島", "仙台"]
    },
    {
        title: "海外",
        cities: ["ソウル", "台北", "香港", "バンコク", "シンガポール", "パリ", "ロンドン", "ローマ", "ニューヨーク", "ロサンゼルス", "ドバイ"]
    },
    {
        title: "ランドマーク",
        cities: ["東京タワー", "東京スカイツリー", "USJ", "清水寺", "富士山", "エッフェル塔", "サグラダ・ファミリア", "自由の女神", "マチュピチュ"]
    }
];

const LandingPage: React.FC<LandingPageProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<SearchTag[]>([]);

    const suggestions = ["東京タワー", "パリ", "ギザのピラミッド", "パルテノン神殿"];

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim(), selectedTags);
        }
    };

    const toggleTag = (tag: SearchTag) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
        );
    };

    const getCityUrl = (city: string) => {
        const tagsQuery = selectedTags.length > 0 ? `?tags=${selectedTags.join(',')}` : '';
        return `/city/${encodeURIComponent(city)}${tagsQuery}`;
    };

    return (
        /* 外側のコンテナから min-h-screen を外して、中身で高さを制御 */
        <div className="w-full flex flex-col bg-background-light dark:bg-background-dark">
            
            {/* メイン：min-h-screen を設定してフッターを画面外へ押し出し。pt-24 で上部に余白。 */}
            <main className="min-h-screen flex flex-col items-center justify-start pt-24 md:pt-32 p-4">
                <div className="text-center mb-10">
                    <div className="font-bold text-5xl tracking-tight text-primary flex items-center gap-3 justify-center">
                        <Icon name="public" className="text-5xl" />
                        <h1>MachiLogue</h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">世界の都市を、データで探求する。</p>
                </div>

                <form onSubmit={handleFormSubmit} className="w-full max-w-xl space-y-8">
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

                    <div className="flex flex-col items-center gap-3">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">興味のあるテーマを選択:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {AVAILABLE_TAGS.map(tag => (
                                <button
                                    type="button"
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 flex items-center gap-1 ${
                                        selectedTags.includes(tag)
                                            ? 'bg-primary text-white border-primary shadow-md'
                                            : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                    }`}
                                >
                                    {selectedTags.includes(tag) && <Icon name="check" className="text-xs" />}
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">または、人気の都市やランドマークを選択:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {suggestions.map(city => (
                            <Link
                                key={city}
                                to={getCityUrl(city)}
                                className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-primary/50 transition font-medium text-slate-700 dark:text-slate-300"
                            >
                                {city}
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* フッター：メインが min-h-screen なので、初期状態では画面の下に隠れる */}
            <footer className="w-full bg-white/30 dark:bg-slate-900/30 border-t border-gray-100 dark:border-gray-800 py-6 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CITY_CATEGORIES.map((category, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row md:items-start gap-2">
                                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter shrink-0 mt-0.5">
                                    {category.title}
                                </h3>
                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    {category.cities.map(city => (
                                        <Link 
                                            key={city} 
                                            to={getCityUrl(city)}
                                            className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors leading-none"
                                        >
                                            {city}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50/50 dark:border-gray-800/50 text-center">
                        <p className="text-[9px] text-slate-300 dark:text-slate-600">© 2026 MachiLogue</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;