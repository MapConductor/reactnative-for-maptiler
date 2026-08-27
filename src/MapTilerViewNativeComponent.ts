import { requireNativeComponent } from 'react-native';
import type {
  NativeMapViewEvent,
  NativeMapViewProps,
} from '@mapconductor/js-sdk-react/internal';

// 共通のブリッジ props / イベント型は js-sdk-react に集約してある。
export type NativeMapTilerViewEvent<T> = NativeMapViewEvent<T>;

export interface NativeMapTilerViewProps extends NativeMapViewProps {
}

export {
  toNativeCameraPosition,
  toNativeMarkerTilingOptions,
  type NativeMarkerTilingOptions,
} from '@mapconductor/js-sdk-react/internal';

export default requireNativeComponent<NativeMapTilerViewProps>(
  // Align to android/src/main/java/com/mapconductor/react/maptiler/MapConductorMapTilerViewManager.kt (REACT_CLASS)
  'MapTilerMapView'
);
