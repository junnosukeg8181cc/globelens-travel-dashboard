
import React from 'react';

interface HeroProps {
    locationName: string;
    subtitle: string;
    tags: string[];
    headerImageUrl: string;
}

const Hero: React.FC<HeroProps> = ({ locationName, subtitle, tags, headerImageUrl }) => {
    return (
        <header className="relative h-[400px] lg:h-[450px] w-full overflow-hidden">
            <img alt={`${locationName} skyline`} className="absolute inset-0 w-full h-full object-cover" src={headerImageUrl} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 pb-8 max-w-7xl mx-auto">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                             <span key={index} className={`px-3 py-1 text-white text-xs font-bold tracking-wider rounded-md uppercase shadow-sm ${index === 0 ? 'bg-gold' : 'bg-gray-800/60 backdrop-blur-md border border-white/20'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md">{locationName}</h1>
                    <p className="text-white/90 text-lg lg:text-xl font-light">{subtitle}</p>
                </div>
            </div>
        </header>
    );
};

export default Hero;
