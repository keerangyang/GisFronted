<template>
  <div id="map" ref="map"></div>
</template>

<script>
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Legend from "@arcgis/core/widgets/Legend";
import { project, load } from "@arcgis/core/geometry/projection";
import { gisServicePath, promisify } from "../../utils";
import PopupTemplate from "@arcgis/core/PopupTemplate";

const popupTemplate = new PopupTemplate({
  title: "拟合信息",
  outFields: ["NEAR_DIST", "Join_Count", "Residual", "StdResid"],
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "NEAR_DIST",
          label: "到人民广场距离（m）",
        },
        {
          fieldName: "Join_Count",
          label: "文化产业数",
          format: {
            digitSeparator: true,
            places: 0,
          },
        },
        {
          fieldName: "Residual",
          label: "残差",
          format: {
            places: 2,
          },
        },
        {
          fieldName: "StdResid",
          label: "标准差",
          format: {
            places: 2,
          },
        },
      ],
    },
  ],
});

export default {
  data: () => ({
    map: null,
    view: null,
    fishmapLayer: null,
    squareLayer: null,
  }),
  methods: {
    loadMap() {
      this.map = new Map({
        basemap: "gray",
        ground: "world-elevation",
      });

      this.view = new MapView({
        container: "map",
        map: this.map,
        center: [121.1253, 31.1731],
        zoom: 10,
      });

      this.loadFeatureLayer();
    },
    async loadFeatureLayer() {
      this.fishmapLayer = new FeatureLayer({
        url: gisServicePath("shanghai/distribution_square/MapServer/1"),
        popupTemplate,
      });

      this.squareLayer = new FeatureLayer({
        url: gisServicePath("shanghai/distribution_square/MapServer/0"),
      });

      this.map.add(this.fishmapLayer);
      this.map.add(this.squareLayer);

      await promisify(this.view);
      await promisify(this.fishmapLayer);
      await load();
      this.view.extent = project(this.fishmapLayer.fullExtent, {
        wkid: 102100,
      });
      this.view.ui.add(
        new Legend({
          view: this.view,
          layerInfos: [
            {
              layer: this.fishmapLayer,
              title: "标准差",
            },
          ],
        }),
        "bottom-left"
      );
    },
  },
  mounted() {
    this.loadMap();
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 25vw;
}
</style>
