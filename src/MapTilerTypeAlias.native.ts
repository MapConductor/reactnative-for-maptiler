import type React from 'react';
import type { HostComponent, NativeMethods } from 'react-native';
import type { NativeMapTilerViewProps } from './MapTilerViewNativeComponent';

export type MapTilerMapViewRef =
  React.ComponentRef<HostComponent<NativeMapTilerViewProps>> & NativeMethods;
export type MapTilerMap = null;
