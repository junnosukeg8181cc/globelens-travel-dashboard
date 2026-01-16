import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async'; 
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Hero from './Hero';
import Tabs from './Tabs';
import EconomicSnapshot from './EconomicSnapshot';
import MajorIndustries from './MajorIndustries';
import HistoryPage from './HistoryPage';
import PlanPage from './PlanPage';
import TourismInformation from './TourismInformation';
import LoadingAnimation from './LoadingAnimation';
import { getLocationData } from '@/services/locationService';
import type { LocationData, Tab, SearchTag } from '@/types';

const DashboardPage: React.FC = () => {
    const { cityName } = useParams<{ cityName: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('tourism');

    const currentTags = (searchParams.get('tags')?.split(',') || []) as SearchTag[];

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) root.classList.add('dark');
        else root.classList.remove('dark');
    }, [isDarkMode]);

    useEffect(() => {
        if (cityName) {
            const loadData = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const data = await getLocationData(cityName, currentTags);
                    setLocationData(data);
                } catch (err) {
                    console.error(`Failed to fetch location data for ${cityName}:`, err);
                    setError(`「${cityName}」のデータの読み込みに失敗しました。`);
                } finally {
                    setIsLoading(false);
                }
            };
            loadData();
        }
    }, [cityName, searchParams.toString()]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    
    const renderDashboardContent = () => {
        if (!locationData) return null;
        switch (activeTab) {
            case 'tourism':
                return (
                    <div className="space-y-8">
                        <TourismInformation tourismInfo={locationData.tourismInfo} locationName={locationData.locationName} />
                        <MajorIndustries industries={locationData.majorIndustries} />
                        <EconomicSnapshot data={locationData.economicSnapshot} />
                    </div>
                );
            case 'history':
                return <HistoryPage events={locationData.historicalTimeline} deepDive={locationData.deepDive} />;
            case 'plan':
                return <PlanPage plan={locationData.travelPlan} />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* SEOメタタグの設定 */}
            {locationData && (
                <Helmet>
                    <title>{`${locationData.locationName}の観光・経済・歴史データ | MachiLogue`}</title>
                    <meta name="description" content={`${locationData.locationName}の歴史、主要産業、経済指標をAIが詳細に分析。${locationData.subtitle}`} />
                    
                    {/* SNSシェア用 (OGP) */}
                    <meta property="og:title" content={`${locationData.locationName}を探求する | MachiLogue`} />
                    <meta property="og:description" content={locationData.subtitle} />
                    <meta property="og:image" content={locationData.headerImageUrl} />
                    <meta property="og:type" content="article" />
                    
                    {/* Twitter用 */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={`${locationData.locationName}の旅データ`} />
                    <meta name="twitter:description" content={locationData.subtitle} />
                    <meta name="twitter:image" content={locationData.headerImageUrl} />
                </Helmet>
            )}

            <Header 
                isDarkMode={isDarkMode} 
                toggleDarkMode={toggleDarkMode} 
                onNavigateHome={() => navigate('/')} 
                locationName={locationData?.locationName || cityName} 
                tags={currentTags} 
            />
            <main className="pt-16 pb-16">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center m-4 rounded">
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
};

export default DashboardPage;