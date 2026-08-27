package com.mapconductor.react.maptiler

import android.content.Context
import android.view.View
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.platform.ComposeView
import com.mapconductor.core.features.GeoPointInterface
import com.mapconductor.core.map.MapCameraPosition
import com.mapconductor.core.map.MutableMapServiceRegistry
import com.mapconductor.core.marker.MarkerTilingOptions
import com.mapconductor.maptiler.MapTilerDesign
import com.mapconductor.maptiler.MapTilerMapDesignTypeInterface
import com.mapconductor.maptiler.MapTilerMapSurface
import com.mapconductor.maptiler.MapTilerMapViewController
import com.mapconductor.maptiler.MapTilerMapViewScope
import com.mapconductor.maptiler.MapTilerViewState
import com.mapconductor.react.wrapper.MapConductorMapViewWrapperBase
import com.mapconductor.react.wrapper.MapConductorReactNativeHost
import com.mapconductor.react.wrapper.MapConductorReactNativeHostDelegate

/**
 * RN の MapTiler ビュー。
 *
 * コマンドの受け口・マーカーの取り込み・拡張のレイヤは
 * [MapConductorMapViewWrapperBase]（js-sdk-react/android）が持つ。
 */
class MapTilerMapViewWrapper(context: Context) : MapConductorMapViewWrapperBase(context) {
    override val host: MapConductorReactNativeHost = MapTilerReactNativeHost()
}

/**
 * MapTiler の地図一式を RN のラッパー基底が扱える形へ翻訳する。
 *
 * **このプロバイダは Compose を内側に持つ。** android の MapTiler SDK は WebView
 * （MapLibre GL JS）ベースで、マーカーと InfoBubble を地図SDKではなく Compose の
 * オーバーレイ（`MapTilerProjectedAnnotation`）で描く。そのため層ごと
 * [MapTilerMapSurface] を載せる。reactnative-for-longdo と同じ扱い。
 *
 * **iOS 側とは実装が違う。** iOS の MapTiler は MapLibre ネイティブで、
 * `MapTilerMapHost` が `MLNMapView` を直接作る。同じ prop・同じ振る舞いに見えるが、
 * 中身は別物なので片方の挙動から他方を推測しないこと。
 *
 * マーカーは共通基底 → `controller.compositionMarkers()` → `controller.markers` と
 * 流れ、そのオーバーレイが描く。
 */
private class MapTilerReactNativeHost : MapConductorReactNativeHost {
    override val providerName = "MapTiler"
    override val extensionScope = MapTilerMapViewScope()
    override val deliversCameraEventsDirectly = true

    private val state = MapTilerViewState(mapDesignType = MapTilerDesign.Streets, id = "rn-maptiler")

    // MapTilerMapSurface は marker rendering capability を state 側へ登録する。
    // RN 拡張ホストにも同じインスタンスを渡さないと clustering 等が解決できない。
    override val serviceRegistry: MutableMapServiceRegistry
        get() = state.serviceRegistry

    private var controller: MapTilerMapViewController? = null
    private val mapDesign = mutableStateOf<MapTilerMapDesignTypeInterface>(MapTilerDesign.Streets)

    override fun createMapView(
        context: Context,
        initialCamera: MapCameraPosition,
        markerTiling: MarkerTilingOptions,
        delegate: MapConductorReactNativeHostDelegate,
    ): View {
        state.moveCameraTo(initialCamera)
        return ComposeView(context).apply {
            setContent {
                state.mapDesignType = mapDesign.value
                MapTilerMapSurface(
                    state = state,
                    // そのまま渡す。タイル経路に倒すかはコントローラが件数を見て決める
                    // （他プロバイダと同じ規則）。ここで独自のゲートを作らないこと。
                    markerTiling = markerTiling,
                    onControllerReady = { viewController ->
                        if (!delegate.isAttached) return@MapTilerMapSurface
                        controller = viewController
                        delegate.onControllerReady(viewController)
                    },
                    // 地図の準備完了は WebView の `onMapViewInitialized` から来る。
                    // コントローラ生成時に鳴らしてはいけない（まだ何も描けない）。
                    onMapLoaded = { if (delegate.isAttached) delegate.onMapLoaded() },
                    // MapTilerMapSurface が JS のイベントから start / move / end を合成する。
                    // コントローラの汎用リスナーだけでは move-end 時の move しか取れないため、
                    // Longdo と同じくホスト delegate へ直接返す（deliversCameraEventsDirectly）。
                    onMapClick = { if (delegate.isAttached) delegate.onMapClick(it) },
                    onMapLongClick = { if (delegate.isAttached) delegate.onMapLongClick(it) },
                    onCameraMoveStart = { if (delegate.isAttached) delegate.onCameraMoveStart(it) },
                    onCameraMove = { if (delegate.isAttached) delegate.onCameraMove(it) },
                    onCameraMoveEnd = { if (delegate.isAttached) delegate.onCameraMoveEnd(it) },
                )
            }
        }
    }

    override fun setMapDesign(id: String?) {
        mapDesign.value = MapTilerDesign.fromId(id)
        controller?.setMapDesignType(mapDesign.value)
    }

    /**
     * 投影はコントローラのホルダーが持つ（コアの `WebMercatorScreenProjection`）。
     * ここで JS 側の投影に逃がさないこと。同じ式が 2 か所に増えるうえ、
     * タップの当たり判定（ネイティブ側にしかない）と食い違う。
     */
    override fun toScreenOffset(position: GeoPointInterface): Offset? =
        controller?.holder?.toScreenOffset(position)

    override fun destroy() {
        controller?.destroy()
        controller = null
    }
}
