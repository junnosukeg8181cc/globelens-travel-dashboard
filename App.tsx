import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from '@/components/LandingPage';
import DashboardPage from '@/components/DashboardPage';
import GeneratorPage from '@/components/GeneratorPage';
import type { SearchTag } from '@/types';

// 検索時の動きを制御するコンポーネント
const SearchHandler = () => {
    const navigate = useNavigate();
    
    const handleSearch = (location: string, tags: SearchTag[]) => {
        // タグがある場合はURLパラメータにする
        const query = tags.length > 0 ? `?tags=${tags.join(',')}` : '';
        // /city/Tokyo?tags=グルメ へ移動
        navigate(`/city/${encodeURIComponent(location)}${query}`);
    };

    return <LandingPage onSearch={handleSearch} />;
};

// ここが唯一の App 定義になります
const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* トップページ */}
                <Route path="/" element={<SearchHandler />} />
                
                {/* 詳細ページ */}
                <Route path="/city/:cityName" element={<DashboardPage />} />
                
                {/* 管理者用：データ生成工場 */}
                <Route path="/admin/generator" element={<GeneratorPage />} />
            </Routes>
        </Router>
    );
};

export default App;