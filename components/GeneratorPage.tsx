import React, { useState } from 'react';
import { getLocationData } from '@/services/locationService';

// 生成したい都市のリスト（好きなだけ追加してください）
const TARGET_CITIES = [
    // --- 都市（既存） ---
    "東京", "大阪", "京都", "札幌", "福岡", "那覇", "横浜", "名古屋", "金沢", "広島", "仙台", "石垣", "宮古島",
    "ソウル", "釜山", "台北", "高雄", "香港", "バンコク", "プーケット", "ホーチミン", "ハノイ", "ダナン", "シンガポール", "セブ", "上海",
    "ホノルル", "グアム", "シドニー", "メルボルン", "ゴールドコースト",
    "パリ", "ロンドン", "ローマ", "バルセロナ", "マドリード", "ミラノ", "ヴェネツィア", "ミュンヘン", "フランクフルト", "ウィーン", "ヘルシンキ",
    "ニューヨーク", "ロサンゼルス", "サンフランシスコ", "ラスベガス", "バンクーバー", "ドバイ", "アブダビ",

    // --- ランドマーク（国内） ---
    "東京タワー", "東京スカイツリー", "東京ディズニーランド", "東京ディズニーシー","ディズニーランド", "ディズニーシー","USJ", "ユニバ",
    "ユニバーサル・スタジオ・ジャパン", "清水寺", "金閣寺", "伏見稲荷大社", 
    "厳島神社", "出雲大社", "伊勢神宮", "姫路城", "富士山", "白川郷",

    // --- ランドマーク（海外） ---
    "ギザのピラミッド", "パルテノン神殿", "エッフェル塔", "ルーヴル美術館", 
    "サグラダ・ファミリア", "モン・サン・ミッシェル", "コロッセオ", "ノイシュヴァンシュタイン城",
    "マリーナベイ・サンズ", "アンコールワット", "タージ・マハル", "万里の長城", "九份",
    "自由の女神", "グランドキャニオン", "マチュピチュ", "オペラハウス"
];

const GeneratorPage: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const startGeneration = async () => {
        setIsGenerating(true);
        setLogs([]);
        setProgress(0);

        addLog("🚀 データ生成プロセスを開始します...");

        for (let i = 0; i < TARGET_CITIES.length; i++) {
            const city = TARGET_CITIES[i];
            addLog(`処理中 (${i + 1}/${TARGET_CITIES.length}): ${city}...`);
            
            try {
                // キャッシュがあればスキップ、なければ生成して保存が勝手に行われる
                await getLocationData(city, []); 
                addLog(`✅ ${city}: 完了（保存済み/キャッシュ済み）`);
            } catch (error) {
                console.error(error);
                addLog(`❌ ${city}: エラー発生！スキップします`);
            }

            // 進捗バー更新
            setProgress(Math.round(((i + 1) / TARGET_CITIES.length) * 100));
            
            // API制限回避のため、少し休憩
            await new Promise(resolve => setTimeout(resolve, 5000)); 
        }

        addLog("🎉 全ての処理が完了しました！");
        setIsGenerating(false);
    };

    return (
        <div className="max-w-3xl mx-auto p-8 font-mono">
            <h1 className="text-2xl font-bold mb-6">🏭 データ事前生成ファクトリー</h1>
            
            <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    リストにある {TARGET_CITIES.length} 都市のデータを生成し、Supabaseにキャッシュします。<br/>
                    Gemini APIの制限を考慮し、5秒ごとに実行します。
                </p>
                <button 
                    onClick={startGeneration} 
                    disabled={isGenerating}
                    className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
                        isGenerating 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                >
                    {isGenerating ? '生成中...' : '生成スタート'}
                </button>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-6 dark:bg-gray-700 overflow-hidden">
                <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="bg-black text-green-400 p-4 rounded-xl h-96 overflow-y-auto text-sm font-mono shadow-inner">
                {logs.length === 0 ? <p className="opacity-50">待機中...</p> : logs.map((log, i) => (
                    <div key={i} className="mb-1 border-b border-green-900/30 pb-1">{log}</div>
                ))}
            </div>
        </div>
    );
};

export default GeneratorPage;