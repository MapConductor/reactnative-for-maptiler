import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { MarkerTilingOptions } from '@mapconductor/js-sdk-core';
import type { MapViewBaseProps } from '@mapconductor/js-sdk-react/native';
import type { MapTilerViewStateInterface } from '@mapconductor/react-for-maptiler/state';

export interface MapTilerMapViewProps extends MapViewBaseProps<MapTilerViewStateInterface> {
  maxZoom?: number;
  minZoom?: number;
  className?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
  markerTilingOptions?: MarkerTilingOptions;
}
