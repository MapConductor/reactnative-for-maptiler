require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name = "MapConductorReactForMapTiler"
  s.version = package["version"]
  s.summary = package["description"]
  s.license = package["license"]
  s.author = package["author"]
  s.homepage = "https://github.com/mapconductor/react-sdk"
  s.source = { :path => __dir__ }
  s.platform = :ios, "16.1"
  s.source_files = "ios/*.{h,m,mm,swift}"
  # MapConductorForMapTiler は source pod（ios-sdk/ios-for-maptiler の podspec を参照）。
  # iOS の MapTiler は **MapLibre ネイティブ**にスタイル URL を差す作りで、
  # android の WebView SDK（com.maptiler.maptilersdk）とは実装が違う。
  # MapLibre は dynamic framework かつ CocoaPods trunk にあるので、そのまま依存できる。
  s.dependency "React-Core"
  s.dependency "MapConductorCore", "~> 1.3.0"
  s.dependency "MapConductorReactNativeCore"
  s.dependency "MapConductorReactMarkerClustering"
  s.dependency "MapConductorForMapTiler", "~> 1.3.0"
  s.dependency "MapLibre", "~> 6.20"
end
