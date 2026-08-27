import { NativeMapViewHost } from '@mapconductor/js-sdk-react/internal';
import type { MapTilerViewStateInterface } from '@mapconductor/react-for-maptiler/state';
import { MapTilerViewController } from './MapTilerViewController.native';
import type { MapTilerMapViewProps } from './MapTilerViewProps.native';
import type { MapTilerMapViewRef } from './MapTilerTypeAlias.native';
import NativeMapTilerMapView from './MapTilerViewNativeComponent';

/**
 * ネイティブイベントの配線・オーバーレイ収集・InfoBubble レイヤは全 RN プロバイダで
 * 同一なので {@link NativeMapViewHost} に集約してある。ここで渡すのは
 * 「どのネイティブビューか」「デザインをどう文字列化するか」だけ。
 */
export function MapTilerMapView(props: MapTilerMapViewProps) {
  return (
    <NativeMapViewHost<MapTilerMapViewRef, MapTilerViewStateInterface>
      {...props}
      nativeComponent={NativeMapTilerMapView}
      // web の `getValue()`（`mapDesign_id=...,style=...`）ではなく **id そのもの**を渡す。
      // ネイティブ側は android/iOS とも `MapTilerDesign.fromId` で引く。web の
      // スタイル URL 形式を送るとどのデザインにも一致せず、黙って既定（Streets）に落ちる。
      // reactnative-for-longdo と同じ取り決め。
      //
      // API キーはここに載せない。android は AndroidManifest の meta-data、
      // iOS は Info.plist の MapTilerAPIKey から**ネイティブが**引く。
      mapDesignValue={props.state.mapDesignType.id}
      createController={(ref, camera) => new MapTilerViewController(ref, camera)}
    />
  );
}
