import { supabase } from '../lib/supabase'; // または './supabase' （前回の移動状況に合わせて）
import { fetchLocationData as fetchFromGemini } from './geminiService';
import type { LocationData, SearchTag } from '../types';

export const getLocationData = async (locationName: string, tags: SearchTag[]): Promise<LocationData> => {
  // ■ ここがポイント！
  // タグの順番が変わっても同じとみなすために、ソートして連結します
  // 例: ['歴史', 'グルメ'] -> "グルメ,歴史"
  const tagsKey = tags.slice().sort().join(',');

  // 1. Supabase (キャッシュ) を見に行く
  // "city_name" と "tags" の両方が一致するものを探す
  const { data: cache, error } = await supabase
    .from('locations')
    .select('data')
    .eq('city_name', locationName)
    .eq('tags', tagsKey) // ← タグも条件に追加
    .single();

  if (cache && cache.data) {
    console.log(`[Cache Hit] ${locationName} (tags: ${tagsKey}) のデータはDBから取得しました！`);
    return cache.data as LocationData;
  }

  // 2. キャッシュになければGeminiに聞く
  console.log(`[Cache Miss] ${locationName} (tags: ${tagsKey}) のデータがないのでGeminiに聞きます...`);
  try {
    const geminiData = await fetchFromGemini(locationName, tags); // 型エラーが出る場合は tags as string[]

    // 3. 結果をSupabaseに保存
    const { error: insertError } = await supabase
      .from('locations')
      .insert([
        { 
          city_name: locationName, 
          tags: tagsKey, // ← 保存時にもタグ情報を入れる
          data: geminiData 
        }
      ]);
    
    if (insertError) console.error('DB保存エラー:', insertError);

    return geminiData;
  } catch (err) {
    throw err;
  }
};