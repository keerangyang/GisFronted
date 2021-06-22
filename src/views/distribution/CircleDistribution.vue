<template>
  <div id="map" ref="map"></div>
</template>

<script>
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { project, load } from "@arcgis/core/geometry/projection";
import { gisServicePath, promisify } from "../../utils";
import PopupTemplate from "@arcgis/core/PopupTemplate";

const popupTemplate = new PopupTemplate({
  title: "{NAME}",
  outFields: ["ADDRESS", "TEL", "DSITRICT", "TYPE0", "TYPE1", "TYPE3"],
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "DISTRICT",
          label: "区",
        },
        {
          fieldName: "ADDRESS",
          label: "地址",
        },
        {
          fieldName: "TEL",
          label: "电话",
        },
        {
          fieldName: "TYPE0",
          label: "0级分类",
        },
        {
          fieldName: "TYPE1",
          label: "1级分类",
        },
        {
          fieldName: "TYPE3",
          label: "2级分类",
        },
      ],
    },
  ],
});

export default {
  data: () => ({
    map: null,
    view: null,
    outerCircleLayer: null,
    outerCircleCultureLayer: null,
    middleCircleLayer: null,
    middleCircleCultureLayer: null,
    innerCircleLayer: null,
    innerCircleCultureLayer: null,
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
      this.outerCircleLayer = new FeatureLayer({
        url: gisServicePath("shanghai/distribution_circle/MapServer/3"),
      });
      this.outerCircleCultureLayer = new FeatureLayer({
        url: gisServicePath("shanghai/distribution_circle/MapServer/5"),
        popupTemplate,
      });
      this.middleCircleLayer = new FeatureLayer({
        url: gisServicePath("shanghai/distribution_circle/MapServer/2"),
      });
      this.middleCircleCultureLayer = new FeatureLayer({
        url: gisServicePath("shanghai/distribution_circle/MapServer/6"),
        popupTemplate,
      });
      this.innerCircleLayer = new FeatureLayer({
        url: gisServicePath("shanghai/distribution_circle/MapServer/1"),
      });
      this.innerCircleCultureLayer = new FeatureLayer({
        url: gisServicePath("shanghai/distribution_circle/MapServer/0"),
        popupTemplate,
      });

      this.map.add(this.outerCircleLayer);
      this.map.add(this.outerCircleCultureLayer);
      this.map.add(this.middleCircleLayer);
      this.map.add(this.middleCircleCultureLayer);
      this.map.add(this.innerCircleLayer);
      this.map.add(this.innerCircleCultureLayer);

      const promises = [
        promisify(this.view),
        promisify(this.outerCircleLayer),
        promisify(this.outerCircleCultureLayer),
        promisify(this.middleCircleLayer),
        promisify(this.middleCircleCultureLayer),
        promisify(this.innerCircleLayer),
        promisify(this.innerCircleCultureLayer),
        load(),
      ];

      await Promise.all(promises);
      this.view.extent = project(this.outerCircleCultureLayer.fullExtent, {
        wkid: 102100,
      });
    },
  },
  mounted() {
    this.loadMap();
  },
};
</script>

<style>
#map {
  width: 100%;
  height: 25vw;
}
</style>
