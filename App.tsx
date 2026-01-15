import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Tabs from './components/Tabs';
import EconomicSnapshot from './components/EconomicSnapshot';
import MajorIndustries from './components/MajorIndustries';
import HistoryPage from './components/HistoryPage';
import PlanPage from './components/PlanPage';
import LandingPage from './components/LandingPage';
import TourismInformation from './components/TourismInformation';
import { fetchLocationData } from './services/geminiService';
import type { LocationData, SearchTag } from './types';
import LoadingAnimation from './components/LoadingAnimation';

export type Tab = 'tourism' | 'history' | 'plan';
type View = 'landing' | 'dashboard';

const App: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('tourism');
    const [view, setView] = useState<View>('landing');
    const [currentLocation, setCurrentLocation] = useState<string>('');
    const [currentTags, setCurrentTags] = useState<SearchTag[]>([]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (view === 'dashboard' && currentLocation && !locationData) {
            const loadData = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    // タグ情報を渡してデータを取得
                    const data = await fetchLocationData(currentLocation, currentTags);
                    setLocationData(data);
                } catch (err) {
                    console.error(`Failed to fetch location data for ${currentLocation}:`, err);
                    setError(`「${currentLocation}」のデータの読み込みに失敗しました。入力内容を再確認するか、別の場所をお試しください。`);
                } finally {
                    setIsLoading(false);
                }
            };

            loadData();
        }
    }, [view, currentLocation, currentTags, locationData]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    // handleSearchの引数にtagsを追加
    const handleSearch = (location: string, tags: SearchTag[]) => {
        setLocationData(null); // Force reload
        setCurrentLocation(location);
        setCurrentTags(tags);
        setView('dashboard');
        setActiveTab('tourism');
    };

    const handleNavigateHome = () => {
        setView('landing');
        setCurrentLocation('');
        setCurrentTags([]);
        setLocationData(null);
    };

    const renderDashboardContent = () => {
        const data = locationData;
        if (!data) return null;

        switch (activeTab) {
            case 'tourism':
                return (
                    <div className="space-y-8">
                        <TourismInformation tourismInfo={data.tourismInfo} locationName={data.locationName} />
                        <MajorIndustries industries={data.majorIndustries} />
                        <EconomicSnapshot data={data.economicSnapshot} />
                    </div>
                );
            case 'history':
                return <HistoryPage events={data.historicalTimeline} deepDive={data.deepDive} />;
            case 'plan':
                return <PlanPage plan={data.travelPlan} />;
            default:
                return null;
        }
    };

    const renderView = () => {
        switch (view) {
            case 'landing':
                return <LandingPage onSearch={handleSearch} />;
            case 'dashboard':
            default:
                return (
                    <>
                        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} onNavigateHome={handleNavigateHome} locationName={locationData?.locationName} tags={currentTags} />
                        <main className="pt-16 pb-16">
                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center m-4 rounded" role="alert">
                                    <p>{error}</p>
                                </div>
                            )}
                            {isLoading && <LoadingAnimation />}
                            {locationData && !isLoading && (
                                <>
                                    <Hero
                                        locationName={locationData.locationName}
                                        subtitle={locationData.subtitle}
                                        tags={locationData.tags}
                                        headerImageUrl={locationData.headerImageUrl}
                                    />
                                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                                    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
                                       {renderDashboardContent()}
                                    </div>
                                </>
                            )}
                        </main>
                    </>
                );
        }
    };

    return <>{renderView()}</>;
};

export default App;