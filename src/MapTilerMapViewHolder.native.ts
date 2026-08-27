import { ReactNativeMapViewHolder } from '@mapconductor/js-sdk-react/internal';
import type { MapTilerMapViewRef } from './MapTilerTypeAlias.native';

/**
 * RN のホルダーは全プロバイダで同一（投影はネイティブ側が行う）なので
 * {@link ReactNativeMapViewHolder} に集約してある。ここは ref 型を与えるだけ。
 *
 * **投影を JS 側へ書き足さないこと。** android の MapTiler は WebView SDK で同期投影を
 * 持たないが、その穴はネイティブ側（`MapTilerMapViewHolder` のコア
 * `WebMercatorScreenProjection`）で埋めてある。JS にもう一度書くと式が 2 か所に増え、
 * タップの当たり判定（ネイティブ側にしかない）と食い違う。
 */
export class MapTilerMapViewHolder extends ReactNativeMapViewHolder<MapTilerMapViewRef> {}
