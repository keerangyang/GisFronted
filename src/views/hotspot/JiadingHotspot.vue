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
// import PopupTemplate from "@arcgis/core/PopupTemplate";

export default {
  data: () => ({
    map: null,
    view: null,
    fishmapLayer: null,
    hotAreaLayer: null,
  }),
  methods: {
    loadMap() {
      this.map = new Map({
        basemap: "oceans",
        ground: "world-elevation",
      });

      this.view = new MapView({
        container: "map",
        map: this.map,
        center: [121.1253, 31.1731],
        zoom: 8,
      });

      this.loadFeatureLayer();
    },
    async loadFeatureLayer() {
      this.fishmapLayer = new FeatureLayer({
        url: gisServicePath("shanghai/hotspot_jiading/MapServer/0"),
        opacity: 0.6,
        // popupTemplate,
      });

      this.hotAreaLayer = new FeatureLayer({
        url: gisServicePath("shanghai/hotspot_jiading/MapServer/1"),
        opacity: 0.6,
      });

      this.map.add(this.fishmapLayer);
      this.map.add(this.hotAreaLayer);

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
              title: "热点值",
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
