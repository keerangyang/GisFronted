<template>
  <div id="map" ref="map"></div>
</template>

<script>
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Legend from "@arcgis/core/widgets/Legend";
import { project, load } from "@arcgis/core/geometry/projection";
import { gisServicePath, promisify } from "../../utils";
import PopupTemplate from "@arcgis/core/PopupTemplate";

const popupTemplate = new PopupTemplate({
  title: "{NAME}文化产业信息",
  outFields: ["DIS_CODE", "Join_Count", "PER"],
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "DIS_CODE",
          label: "编号",
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
          fieldName: "PER",
          label: "文化产业百分比",
          format: {
            places: 3,
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
    featureLayer: null,
  }),
  methods: {
    loadMap() {
      this.map = new Map({
        basemap: "oceans",
        ground: "world-elevation",
      });

      this.view = new SceneView({
        container: "map",
        map: this.map,
        camera: {
          position: [121.1253, 31.1731, 707],
          tilt: 40,
          heading: 50,
        },
      });

      this.loadFeatureLayer();
    },
    async loadFeatureLayer() {
      this.featureLayer = new FeatureLayer({
        url: gisServicePath("shanghai/distribution_district/MapServer/1"),
        outFields: ["*"],
        popupTemplate,
      });

      this.map.add(this.featureLayer);

      await promisify(this.view);
      await promisify(this.featureLayer);
      await load();
      this.view.extent = project(this.featureLayer.fullExtent, {
        wkid: 102100,
      });
      this.view.ui.add(
        new Legend({
          view: this.view,
          layerInfos: [
            {
              layer: this.featureLayer,
              title: "文化产业数",
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
