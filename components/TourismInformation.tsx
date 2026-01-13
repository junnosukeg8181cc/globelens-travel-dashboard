import React from 'react';
import CityMap from './CityMap';
import WeatherForecast from './WeatherForecast';
import Icon from './Icon';
import type { TourismInfo } from '../types';

interface TourismInformationProps {
    tourismInfo: TourismInfo;
    locationName: string;
}

const TourismInformation: React.FC<TourismInformationProps> = ({ tourismInfo, locationName }) => {
    const {
        latitude,
        longitude,
        regionalCenter,
        distanceFromCenter,
        language,
        currency,
        currencyRate,
        area,
        tourismInfo: tourismSummary,
    } = tourismInfo;

    const infoItems = [
        {
            icon: 'place',
            label: '地域の中心',
            value: regionalCenter,
            subValue: distanceFromCenter,
        },
        {
            icon: 'language',
            label: '主要言語',
            value: language,
        },
        {
            icon: 'attach_money',
            label: '通貨',
            value: currency,
            subValue: currencyRate,
        },
        {
            icon: 'square_foot',
            label: '地域面積',
            value: area,
        },
    ];

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">観光情報</h2>
            
            {/* 地図セクション */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Icon name="map" className="text-primary" />
                    地図
                </h3>
                <CityMap tourismInfo={tourismInfo} locationName={locationName} />
            </div>

            {/* 天気予報セクション */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Icon name="wb_sunny" className="text-primary" />
                    天気予報
                </h3>
                <WeatherForecast latitude={latitude} longitude={longitude} />
            </div>

            {/* 基本情報グリッド */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Icon name="info" className="text-primary" />
                    基本情報
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {infoItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                    <Icon name={item.icon} className="text-xl" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{item.label}</p>
                                    <p className="text-slate-900 dark:text-white font-semibold text-base">{item.value}</p>
                                    {item.subValue && (
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{item.subValue}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 観光情報サマリ */}
            {tourismSummary && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <Icon name="explore" className="text-primary" />
                        観光情報サマリ
                    </h3>
                    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {tourismSummary}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TourismInformation;
