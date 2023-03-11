import path from 'node:path';

import { Temporal } from '@js-temporal/polyfill';
import * as bcrypt from 'bcrypt';
import { Like } from "typeorm";

import { FeatureItem } from '../src/model/feature_item';
import { FeatureSection } from '../src/model/feature_section';
import { LimitedTimeOffer } from '../src/model/limited_time_offer';
import { MediaFile } from '../src/model/media_file';
import { Order } from '../src/model/order';
import { Product } from '../src/model/product';
import { ProductMedia } from '../src/model/product_media';
import { Profile } from '../src/model/profile';
import { Recommendation } from '../src/model/recommendation';
import { Review } from '../src/model/review';
import { ShoppingCartItem } from '../src/model/shopping_cart_item';
import { User } from '../src/model/user';
import { dataSource } from '../src/server/data_source';
import { DATABASE_SEED_PATH } from '../src/server/utils/database_paths';

import { hakusai, kyuri } from './aozora';
import { getFileList } from './get_file_list';

const TZ = process.env.TZ ?? 'Asia/Tokyo';
const BASE_DATE = process.env.SEED_BASE_UNIXTIME
  ? Temporal.Instant.fromEpochMilliseconds(Number(process.env.SEED_BASE_UNIXTIME))
  : Temporal.Now.instant();

const familyNames = [
  { display: '宮森', name: 'miyamori' },
  { display: '安原', name: 'yasuhara' },
  { display: '坂木', name: 'sakaki' },
  { display: '東堂', name: 'todo' },
  { display: '今井', name: 'imai' },
  { display: '本田', name: 'honda' },
  { display: '高梨', name: 'takanashi' },
  { display: '矢野', name: 'yano' },
  { display: '落合', name: 'ochiai' },
  { display: '渡辺', name: 'watanabe' },
];
const givenNames = [
  { display: 'あおい', name: 'aoi' },
  { display: '絵麻', name: 'ema' },
  { display: 'しずか', name: 'shizuka' },
  { display: '美沙', name: 'misa' },
  { display: 'みどり', name: 'midori' },
  { display: '豊', name: 'yutaka' },
  { display: '太郎', name: 'taro' },
  { display: '絵梨花', name: 'erika' },
  { display: '達也', name: 'tatsuya' },
  { display: '隼', name: 'shun' },
];
const farmNames = ['農園', 'ファーム', 'ナチュラルファーム', '畑'];
const vegetableFruitNames = [
  {
    display: 'キャベツ',
    name: 'cabbage',
  },
  {
    display: 'りんご',
    name: 'apple',
  },
  {
    display: 'バナナ',
    name: 'banana',
  },
  {
    display: 'ブルーベリー',
    name: 'blueberry',
  },
  {
    display: '人参',
    name: 'carrot',
  },
  {
    display: 'いちご',
    name: 'strawberry',
  },
  {
    display: 'トマト',
    name: 'tomato',
  },
];
const comments = [
  'とても美味しいです。毎週購入していますが、飽きることがありません。この野菜は、育成過程で農薬や化学肥料を使用せず、自然の力を借りて育てられたため、味が濃く、鮮烈でした。また、安全性にも配慮されているため、心置きなく食べることができました。',
  '農薬を極力少なくして栽培しているということで、子供に食べさせても安心です。この野菜は、一般的な野菜と比較しても栄養素が豊富で、食べると身体が喜ぶような感覚がありました。また、野菜本来の味わいを存分に楽しめるため、お料理にも使いやすかったです。',
  'これを一度食べてしまうと、スーパーの野菜は味が薄くて食べる気がしません。いつも美味しい野菜を届けてくださってありがとうございます！大変鮮度が良く、新鮮なうちに収穫されたものであるため、その鮮度が味わいにも影響していると感じました。また、安全性にも配慮されたこの野菜は、化学肥料や農薬による汚染の心配がありません。',
  'これを食べて、まるで大地の恵みをいただいているかのような感覚に陥りました。それほど、自然の力を借りて育てられた野菜の美味しさは、一般的な野菜とは比較になりません。',
  '健康に気を遣う人には、この商品をおすすめします。農薬や化学肥料を使用せず、自然に育てられた野菜は、身体にも優しいだけでなく、美味しいので、まるで天国の味わいのようでした。',
  '自然の恵みがたっぷりと詰まっていて、食べると身体が喜ぶような感覚を与えてくれました。野菜本来の旨味や甘みがしっかりと感じられ、食べる人を幸せな気持ちにしてくれました。',
  'まるで自然そのものから直接採れたかのような新鮮さと味わいがありました。育てられる過程で使用された農薬や化学肥料が心配なく、安心して食べることができるという安全性も嬉しいポイントでした。',
  '食べた時に優しい味わいが広がり、まるで自然に包まれているような感覚に浸ることができました。また、自然に育てられた野菜は身体にも優しく、健康にも良いということが分かり、感動的な食体験でした。',
];
const featureSections = [
  'おいしい農産物特集',
  'ポイント2倍キャンペーン',
  '健康応援フェア',
  '産地直送・生産者限定品',
  '生産者の顔が見える品',
  'ご褒美グルメ',
  '自炊レパートリーを増やそう！',
  '今おすすめしたい旬の野菜・果物',
  'プレミアムな一品',
  '地産地消で SDGs を推進しよう',
];
const descriptions = [kyuri, hakusai];
const discountRates = [0.05, 0.1, 0.15, 0.2, 0.3, 0.5];

// https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/chunk.js
function chunk<T>(array: T[], size: number): T[][] {
  const length = array.length;
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}

async function insert(entities: unknown[]): Promise<void> {
  const partitions = chunk(entities, 5000);

  for (const partition of partitions) {
    await dataSource.manager.save(partition);
  }
}


async function updateMediaFiles(): Promise<MediaFile[]> {

  const mediaList: MediaFile[] = await dataSource.manager.find(MediaFile, {
    where: { filename: Like('%jpg')}
  });

  for (let i = 0; i < mediaList.length; i++) {
    const name = mediaList[i].filename;
    mediaList[i].filename = name.substring(0,name.length-4)+".webp";
  }
  await insert(mediaList);

  return mediaList;
}


async function seed(): Promise<void> {
  console.log('Initializing database...');
  dataSource.setOptions({ database: DATABASE_SEED_PATH });
  dataSource.driver.database = DATABASE_SEED_PATH;
  await dataSource.initialize();
  await dataSource.synchronize(false);

  console.log('Update jpg to webp...');
  const mediaList = await updateMediaFiles();

}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
