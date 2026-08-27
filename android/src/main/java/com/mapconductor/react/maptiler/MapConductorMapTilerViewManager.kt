package com.mapconductor.react.maptiler

import com.mapconductor.react.wrapper.MapConductorMapViewCommands
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class MapConductorMapTilerViewManager : SimpleViewManager<MapTilerMapViewWrapper>() {
    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): MapTilerMapViewWrapper =
        MapTilerMapViewWrapper(reactContext)

    override fun onAfterUpdateTransaction(view: MapTilerMapViewWrapper) {
        super.onAfterUpdateTransaction(view)
        view.initializeMapIfNeeded()
    }

    @ReactProp(name = "cameraPosition")
    fun setCameraPosition(
        view: MapTilerMapViewWrapper,
        cameraPosition: ReadableMap?,
    ) {
        view.setCameraPosition(cameraPosition)
    }

    @ReactProp(name = "mapDesignType")
    fun setMapDesignType(
        view: MapTilerMapViewWrapper,
        mapDesignType: String?,
    ) {
        view.setMapDesignType(mapDesignType)
    }

    @ReactProp(name = "infoBubblePositions")
    fun setInfoBubblePositions(
        view: MapTilerMapViewWrapper,
        positions: ReadableArray?,
    ) {
        view.setInfoBubblePositions(positions)
    }

    @ReactProp(name = "markerTilingOptions")
    fun setMarkerTilingOptions(
        view: MapTilerMapViewWrapper,
        options: ReadableMap?,
    ) {
        view.setMarkerTilingOptions(options)
    }

    override fun receiveCommand(
        root: MapTilerMapViewWrapper,
        commandId: String,
        args: ReadableArray?,
    ) {
        // コマンド名の対応は全プロバイダ共通。写経すると綴り違いが黙って無効化されるため
        // js-sdk-react に集約してある。
        MapConductorMapViewCommands.receive(root, commandId, args)
    }

    override fun onDropViewInstance(view: MapTilerMapViewWrapper) {
        view.onDropViewInstance()
        super.onDropViewInstance(view)
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        MapConductorMapViewCommands.directEventTypeConstants()

    companion object {
        const val REACT_CLASS = "MapTilerMapView"
    }
}
