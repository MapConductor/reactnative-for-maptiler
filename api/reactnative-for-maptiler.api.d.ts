import { MapTilerViewStateInterface } from '@mapconductor/react-for-maptiler/state';
export { MapTilerDesign, MapTilerMapDesignType, MapTilerViewState, MapTilerViewStateInterface, MapTilerViewStateParams, useMapTilerViewState } from '@mapconductor/react-for-maptiler/state';
import * as React from 'react';
import React__default from 'react';
import { HostComponent, NativeMethods, StyleProp, ViewStyle } from 'react-native';
import { NativeMapViewProps, NativeMapViewEvent, ReactNativeBridgeMapViewController, ReactNativeMapViewHolder } from '@mapconductor/js-sdk-react/internal';
export { NativeMarkerStatePayload as NativeMapTilerMarkerState, NativeMarkerTilingOptions, markerStateToNative, toNativeCameraPosition, toNativeMarkerTilingOptions } from '@mapconductor/js-sdk-react/internal';
import { MapViewControllerInterface, MarkerTilingOptions } from '@mapconductor/js-sdk-core';
import { MapViewBaseProps } from '@mapconductor/js-sdk-react/native';

type NativeMapTilerViewEvent<T> = NativeMapViewEvent<T>;
interface NativeMapTilerViewProps extends NativeMapViewProps {
}

type MapTilerMapViewRef = React__default.ComponentRef<HostComponent<NativeMapTilerViewProps>> & NativeMethods;
type MapTilerMap = null;

type MapTilerViewControllerInterface = MapViewControllerInterface;

/**
 * ネイティブブリッジの実装は全 RN プロバイダで同一なので
 * {@link ReactNativeBridgeMapViewController} に集約してある。ここはネイティブビューの
 * ref 型を与えるだけ。プロバイダ固有の振る舞いが要るときだけメソッドを override する。
 */
declare class MapTilerViewController extends ReactNativeBridgeMapViewController<MapTilerMapViewRef> {
}

/**
 * RN のホルダーは全プロバイダで同一（投影はネイティブ側が行う）なので
 * {@link ReactNativeMapViewHolder} に集約してある。ここは ref 型を与えるだけ。
 *
 * **投影を JS 側へ書き足さないこと。** android の MapTiler は WebView SDK で同期投影を
 * 持たないが、その穴はネイティブ側（`MapTilerMapViewHolder` のコア
 * `WebMercatorScreenProjection`）で埋めてある。JS にもう一度書くと式が 2 か所に増え、
 * タップの当たり判定（ネイティブ側にしかない）と食い違う。
 */
declare class MapTilerMapViewHolder extends ReactNativeMapViewHolder<MapTilerMapViewRef> {
}

interface MapTilerMapViewProps extends MapViewBaseProps<MapTilerViewStateInterface> {
    maxZoom?: number;
    minZoom?: number;
    className?: string;
    containerStyle?: StyleProp<ViewStyle>;
    onError?: (error: Error) => void;
    children?: React__default.ReactNode;
    markerTilingOptions?: MarkerTilingOptions;
}

/**
 * ネイティブイベントの配線・オーバーレイ収集・InfoBubble レイヤは全 RN プロバイダで
 * 同一なので {@link NativeMapViewHost} に集約してある。ここで渡すのは
 * 「どのネイティブビューか」「デザインをどう文字列化するか」だけ。
 */
declare function MapTilerMapView(props: MapTilerMapViewProps): React.JSX.Element;

export { type MapTilerMap, MapTilerMapView, MapTilerMapViewHolder, type MapTilerMapViewProps, type MapTilerMapViewRef, MapTilerViewController, type MapTilerViewControllerInterface, type NativeMapTilerViewEvent, type NativeMapTilerViewProps };
