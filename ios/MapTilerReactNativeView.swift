import MapConductorCore
@_spi(MapConductorDriver) import MapConductorForMapTiler
import MapConductorReactMarkerClustering
import MapConductorReactNativeCore
import MapLibre
import UIKit

/// RN の MapTiler ビュー。
///
/// コマンドの受け口・マーカー取り込み・スクリーン座標の通知は
/// ``MCReactNativeMapViewBase``（js-sdk-react/ios）が全部持っているので、ここは
/// プロバイダ固有のアダプタを差すだけ。
///
/// **android 側とは中身が違う。** iOS の MapTiler は MapLibre ネイティブに MapTiler の
/// スタイル URL を差す作りで、android は MapTiler 独自の WebView SDK
/// （`com.maptiler.maptilersdk`）を Compose で載せている。prop と振る舞いは同じに
/// 揃えてあるが、片方の挙動から他方を推測しないこと。
@objc(MCMapTilerReactNativeView)
public final class MapTilerReactNativeView: MCReactNativeMapViewBase {
    public override func makeHost() -> MCReactNativeMapHost {
        MapTilerReactNativeHost()
    }
}

/// `MapTilerMapHost`（ios-sdk）を RN の基底クラスが扱える非ジェネリックな形へ翻訳する。
@MainActor
final class MapTilerReactNativeHost: MCReactNativeMapHost {
    weak var mcDelegate: MCReactNativeMapHostDelegate?

    private let state = MapTilerViewState()
    private lazy var mapHost: MapTilerMapHost = {
        MapTilerMapHost(
            state: state,
            handlers: MapViewHandlers(
                onMapLoaded: { [weak self] _ in self?.mcDelegate?.mcMapLoaded() },
                onMapClick: { [weak self] point in self?.mcDelegate?.mcMapClick(point) },
                onMapLongClick: { [weak self] point in self?.mcDelegate?.mcMapLongClick(point) },
                onCameraMoveStart: { [weak self] camera in self?.mcDelegate?.mcCameraMoveStart(camera) },
                onCameraMove: { [weak self] camera in self?.mcDelegate?.mcCameraMove(camera) },
                onCameraMoveEnd: { [weak self] camera in self?.mcDelegate?.mcCameraMoveEnd(camera) }
            )
        )
    }()

    var mcServiceRegistry: MutableMapServiceRegistry { state.serviceRegistry }
    var mcCameraZoom: Double { state.cameraPosition.zoom }

    func mcMakeMapView(content: MapViewContent) -> UIView {
        // API キーは JS からは渡さない。`MapTilerMapHost.resolveApiKey(nil)` が
        // Info.plist の `MapTilerAPIKey` から引く（SwiftUI 版と同じ経路）。
        mapHost.makeMapView(apiKey: nil, cameraRestriction: nil, content: content)
    }

    func mcUpdateContent(_ content: MapViewContent) {
        mapHost.updateContent(content)
        mapHost.updateInfoBubbleLayouts()
    }

    func mcSyncNativeViewSettings() {
        mapHost.syncNativeViewSettings()
    }

    func mcUnbind() {
        mapHost.unbind()
    }

    func mcSetMapDesign(id: String?) {
        // JS が送るのは `getValue()` ではなく id そのもの（MapTilerView.native.tsx を参照）。
        state.mapDesignType = MapTilerDesign.fromId(id)
    }

    func mcMoveCamera(_ camera: MapCameraPosition, durationMillis: Int64?) {
        if let durationMillis {
            state.moveCameraTo(cameraPosition: camera, durationMillis: durationMillis)
        } else {
            state.moveCameraTo(cameraPosition: camera)
        }
    }

    func mcFitBounds(_ bounds: GeoRectBounds, padding: Int) {
        state.fitBounds(bounds: bounds, padding: padding)
    }

    func mcApplyUISettings(_ settings: MapUISettings) {
        state.uiSettings = settings
    }

    func mcToScreenOffset(_ position: GeoPointProtocol) -> CGPoint? {
        state.getMapViewHolder()?.toScreenOffset(position: position)
    }

    func mcMakeLocalExtensionRenderer(
        type: String,
        extensionId: String,
        eventSink: @escaping NativeMapExtensionEventSink
    ) -> NativeMapExtensionRenderer? {
        guard type == "marker-clustering" else { return nil }
        return MarkerClusterExtensionRenderer<MapTilerActualMarker>(extensionId: extensionId, eventSink: eventSink)
    }
}
