import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createGeoPoint, createMapCameraPosition } from '@mapconductor/js-sdk-core';
import { MapTilerDesign } from '@mapconductor/react-for-maptiler/state';
import { buildPackage } from './helpers/buildPackage.mjs';

// MapTilerMapView は共有の NativeMapViewHost に「どのネイティブビューか」「デザインをどう文字列化するか」を
// 渡すだけの層。React を描画せず関数として呼び、返ってきた要素の props で受け渡しを確かめる。
// MapTiler はデザインを id で渡す（getValue() の合成形でも styleId でもない）。
const { mod, cleanup } = await buildPackage('mapview-tests');
after(cleanup);
const { MapTilerMapView, MapTilerViewState, MapTilerViewController, NativeMapViewHost, ReactNativeBridgeMapViewController } = mod;

test('the shared native host is rendered with the MapTilerMapView native view', () => {
  const element = MapTilerMapView({ state: new MapTilerViewState() });
  assert.equal(element.type, NativeMapViewHost);
  // Android の REACT_CLASS / iOS の RCT_EXPORT_MODULE と揃っていないと
  // 「View config not found」で落ちる名前。
  assert.deepEqual(element.props.nativeComponent, { nativeViewName: 'MapTilerMapView' });
  // このプロバイダはネイティブ固有の prop（API キー等）を渡さない。
  assert.equal(element.props.nativeProps, undefined);
});

test('the design value sent to native follows the state design', () => {
  const state = new MapTilerViewState();
  assert.equal(MapTilerMapView({ state }).props.mapDesignValue, 'Streets');
  state.mapDesignType = MapTilerDesign.Satellite;
  assert.equal(MapTilerMapView({ state }).props.mapDesignValue, 'Satellite');
});

test('app props pass through to the host untouched', () => {
  const state = new MapTilerViewState();
  const onMapClick = () => {};
  const props = MapTilerMapView({ state, onMapClick, children: 'child' }).props;
  assert.equal(props.state, state);
  assert.equal(props.onMapClick, onMapClick);
  assert.equal(props.children, 'child');
});

test('createController builds a MapTilerViewController bound to the native ref and initial camera', () => {
  const view = { nodeHandle: 7 };
  const camera = createMapCameraPosition({ position: createGeoPoint({ latitude: 35.68, longitude: 139.76 }), zoom: 12 });
  const controller = MapTilerMapView({ state: new MapTilerViewState() }).props.createController({ current: view }, camera);
  assert.ok(controller instanceof MapTilerViewController);
  assert.ok(controller instanceof ReactNativeBridgeMapViewController);
  assert.equal(controller.getCameraPosition(), camera);
  assert.equal(controller.holder.mapView, view);
  controller.destroy();
});

test('the id is sent, not the composite getValue() string', () => {
  const design = MapTilerDesign.Streets;
  const value = MapTilerMapView({ state: new MapTilerViewState({ mapDesignType: design }) }).props.mapDesignValue;
  assert.equal(value, design.id);
  assert.notEqual(value, design.getValue());
});
