
import React from 'react';
import Icon from './Icon';

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    onNavigateHome: () => void;
    locationName?: string;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, onNavigateHome, locationName }) => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 lg:px-12">
            <button onClick={onNavigateHome} className="flex items-center gap-4 group">
                <div className="p-2 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition">
                    <Icon name="arrow_back" className="text-gray-600 dark:text-gray-300" />
                </div>
                <div className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
                    <Icon name="public" />
                    GlobeLens
                </div>
            </button>
            <div className="hidden md:flex items-center justify-center">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{locationName || '都市を選択'}</span>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300">
                    <Icon name="share" />
                </button>
                <button onClick={toggleDarkMode} className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 transition">
                    <Icon name={isDarkMode ? 'light_mode' : 'dark_mode'} />
                </button>
            </div>
        </nav>
    );
};

export default Header;
