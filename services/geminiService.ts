import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { LocationData } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("【致命的エラー】APIキーが読み込めません。.env.local の VITE_GEMINI_API_KEY を確認してください。");
}

const genAI = new GoogleGenerativeAI(apiKey || "dummy_key");

// Unsplash画像検索
const fetchImageFromUnsplash = async (query: string): Promise<string> => {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey) return "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80";

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
            { headers: { Authorization: `Client-ID ${accessKey}` } }
        );
        const data = await response.json();
        return data.results?.[0]?.urls?.regular || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80";
    } catch (e) {
        return "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80";
    }
};

const locationSchema = {
    description: "Location data schema",
    type: SchemaType.OBJECT,
    properties: {
        locationName: { type: SchemaType.STRING },
        englishLocationName: { type: SchemaType.STRING, description: "画像検索用の英語名（例: 'Minoh City'）" },
        subtitle: { type: SchemaType.STRING },
        tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        economicSnapshot: {
            type: SchemaType.OBJECT,
            properties: {
                year: { type: SchemaType.STRING, description: "データ年（例: '2023年'）" },
                dataScope: { type: SchemaType.STRING, description: "データの範囲（例: '大阪府箕面市の統計データ'）" },
                gdp: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING }, currency: { type: SchemaType.STRING }, growth: { type: SchemaType.STRING } }, required: ["value", "currency", "growth"] },
                tradeVolume: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING }, currency: { type: SchemaType.STRING } }, required: ["value", "currency"] },
                annualVisitors: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING } }, required: ["value"] },
                unemploymentRate: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING } }, required: ["value"] },
                inflationRate: { type: SchemaType.OBJECT, properties: { value: { type: SchemaType.STRING } }, required: ["value"] }
            },
            required: ["year", "dataScope", "gdp", "tradeVolume", "annualVisitors", "unemploymentRate", "inflationRate"],
        },
        majorIndustries: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, icon: { type: SchemaType.STRING }, colorKey: { type: SchemaType.STRING } }, required: ["name", "icon", "colorKey"] },
        },
        historicalTimeline: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.OBJECT, properties: { year: { type: SchemaType.STRING }, title: { type: SchemaType.STRING }, description: { type: SchemaType.STRING }, icon: { type: SchemaType.STRING } }, required: ["year", "title", "description", "icon"] },
        },
        deepDive: {
            type: SchemaType.OBJECT,
            properties: {
                title: { type: SchemaType.STRING },
                summary: { type: SchemaType.STRING },
                fullStory: { type: SchemaType.STRING },
                source: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, details: { type: SchemaType.STRING } }, required: ["name", "details"] },
            },
            required: ["title", "summary", "fullStory", "source"],
        },
        travelPlan: {
            type: SchemaType.OBJECT,
            properties: {
                title: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
                itinerary: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.OBJECT, properties: { time: { type: SchemaType.STRING }, title: { type: SchemaType.STRING }, description: { type: SchemaType.STRING }, icon: { type: SchemaType.STRING }, historicalContext: { type: SchemaType.STRING } }, required: ["time", "title", "description", "icon", "historicalContext"] }
                }
            },
            required: ["title", "description", "itinerary"]
        },
        tourismInfo: {
            type: SchemaType.OBJECT,
            properties: {
                latitude: { type: SchemaType.NUMBER, description: "緯度（数値）" },
                longitude: { type: SchemaType.NUMBER, description: "経度（数値）" },
                regionalCenter: { type: SchemaType.STRING, description: "属する地域の中心都市名" },
                distanceFromCenter: { type: SchemaType.STRING, description: "中心部からの距離（例: '大阪市中心部から約15km'）" },
                language: { type: SchemaType.STRING, description: "主要言語" },
                currency: { type: SchemaType.STRING, description: "通貨名（例: '米ドル (USD)'）" },
                currencyCode: { type: SchemaType.STRING, description: "3文字のISO通貨コード（例: 'USD', 'EUR', 'KRW', 'JPY'）" }, // 追加
                currencyRate: { type: SchemaType.STRING, description: "日本円との概算レート（例: '1 USD ≈ 150 JPY'）" },
                area: { type: SchemaType.STRING, description: "属する地域の面積" },
                tourismInfo: { type: SchemaType.STRING, description: "観光情報サマリ（400文字程度）" }
            },
            required: ["latitude", "longitude", "regionalCenter", "distanceFromCenter", "language", "currency", "currencyCode", "currencyRate", "area", "tourismInfo"]
        }
    },
    required: ["locationName", "englishLocationName", "subtitle", "tags", "economicSnapshot", "majorIndustries", "historicalTimeline", "travelPlan", "deepDive", "tourismInfo"],
};

export const fetchLocationData = async (location: string, tags: string[] = []): Promise<LocationData> => {
    // 【修正】のすけさん指定の最新エースモデルリスト
    const modelsToTry = [
        "gemini-2.5-flash-lite", // エース
        "gemini-3-flash-preview", // ちょっと賢い版
        "gemini-pro",             // 旧エース
    ];

    // タグが選択されている場合の追加指示
    const tagsInstruction = tags.length > 0 
        ? `\n**【最重要】ユーザーの関心テーマ:**\nユーザーは特に以下の分野に興味があります: ${tags.join(', ')}。\n歴史タイムライン、Deep Dive (fullStory)、旅行プランを作成する際は、これらのテーマに関連する出来事やスポット、文脈を優先的に取り上げてください。` 
        : "";

    const prompt = `
        Role: 世界のトップトラベルジャーナリスト兼経済アナリスト。
        Objective: 「${location}」の観光・経済・歴史データを生成する。

        ${tagsInstruction}

        **【重要】言語とアイコンのルール (Strict Rules):**
        1. **文章はすべて日本語**で出力してください。
        2. **ただし、アイコン名 (icon fields) だけは絶対に翻訳しないでください！**
           - Google Material Icons の公式名（英語のsnake_case）をそのまま使ってください。
           - OK: "history_edu", "attach_money", "train"
           - NG: "歴史", "お金", "電車", "Train" (大文字NG)
        
        **データ生成ルール:**
        - **Deep Dive (fullStory):** 読者を惹き込む「2000文字以上の長編レポート」が必要です。
           単なる羅列ではなく、以下の5つの視点を**それぞれ400文字以上**深く掘り下げて、一つの物語として構成してください。
           1. 【歴史の深層】: 起源から現代に至るまでのドラマチックな変遷
           2. 【経済の鼓動】: 産業構造の変化と、それが人々の生活にどう影響しているか
           3. 【文化と人々】: 地元の人しか知らない風習、食文化、気質
           4. 【知られざる側面】: 一般的なガイドブックには載らない裏話や課題
           5. 【未来への展望】: この都市が今後どう変わっていくかの予測
        - **数値データ:** 推定値で良いので、必ず具体的な数字を入れてください（"不明"はNG）。
        - **観光情報 (tourismInfo):** - 緯度経度は正確な数値で出力してください。
            - currencyCodeは必ず3文字のISOコード（例: USD）で出力してください。
            - 観光情報サマリは日本語で200文字程度で簡潔に記述してください。
    `;

    let lastError;

    for (const modelId of modelsToTry) {
        try {
            console.log(`Trying model: ${modelId} ...`);
            const model = genAI.getGenerativeModel({
                model: modelId,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: locationSchema as any,
                }
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonText = response.text();
            
            if (!jsonText) throw new Error("Empty response");
            
            const data = JSON.parse(jsonText);
            const imageUrl = await fetchImageFromUnsplash(data.englishLocationName || location);

            return { ...data, headerImageUrl: imageUrl } as LocationData;

        } catch (error: any) {
            console.warn(`Model ${modelId} failed:`, error.message);
            lastError = error;
        }
    }

    throw new Error(`データの取得に失敗しました。: ${lastError?.message}`);
};