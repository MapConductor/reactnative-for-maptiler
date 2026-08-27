module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: './android',
        packageImportPath:
          'import com.mapconductor.react.maptiler.MapConductorMapTilerPackage;',
        packageInstance: 'new MapConductorMapTilerPackage()',
      },
      ios: {
        sourceDir: './ios',
      },
    },
  },
};
