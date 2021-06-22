<template>
  <main class="container">
    <header style="position: relative">
      <a-input-search
        placeholder="请输入关键词搜索文化产业"
        enter-button
        :disabled="!cultures"
        @search="onSearch"
      >
      </a-input-search>
      <div v-if="listVisible" class="list-container">
        <div v-if="loading" class="loading-container">
          <a-spin />
        </div>
        <a-list v-else-if="searchResults.length" :data-source="searchResults">
          <a-list-item slot="renderItem" slot-scope="culture, index">
            <a-list-item-meta :description="culture.ADDRESS">
              <span slot="title">{{ culture.NAME }}</span>
            </a-list-item-meta>
            <a-button
              slot="actions"
              type="link"
              @click="() => onViewDetail(culture, index)"
              >查看</a-button
            >
          </a-list-item>
        </a-list>
        <div v-else style="text-align: center">无匹配文化产业</div>
      </div>
    </header>
    <article>
      <div ref="map" id="map"></div>
    </article>
  </main>
</template>

<script>
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { watch } from "@arcgis/core/core/watchUtils";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { project, load } from "@arcgis/core/geometry/projection";
import { gisServicePath, promisify } from "../utils";
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
  data() {
    return {
      searchResults: [],
      cultures: null,
      graphics: null,
      loading: false,
      listVisible: false,
      map: null,
      view: null,
      featureLayer: null,
      layerView: null,
    };
  },
  methods: {
    onSearch(keyword) {
      console.log("search");
      this.loading = true;
      this.listVisible = true;
      this.searchResults = this.cultures.filter((culture) =>
        culture.NAME.includes(keyword)
      );
      this.loading = false;
    },
    onViewDetail(culture) {
      console.log(culture);
      const selectedGraphic = this.graphics.find(
        (graphic) => graphic.attributes.OBJECTID === culture.OBJECTID
      );

      console.log("selectedGraphic: ", selectedGraphic);

      this.listVisible = false;

      this.view.popup.open({
        features: [selectedGraphic],
        location: selectedGraphic.geometry.centroid,
      });
    },
    loadMap() {
      this.map = new Map({
        basemap: "dark-gray",
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
    async loadGraphics(updating) {
      if (updating) return;
      console.log("updated");
      const { features } = await this.layerView.queryFeatures();
      this.graphics = features;
      console.log("features: ", this.graphics);
    },
    async loadFeatureLayer() {
      this.featureLayer = new FeatureLayer({
        url: gisServicePath("shanghai/culture/MapServer/0"),
        popupTemplate,
      });

      this.map.add(this.featureLayer);

      await promisify(this.view);
      await promisify(this.featureLayer);

      this.layerView = await this.view.whenLayerView(this.featureLayer);
      watch(this.layerView, "updating", this.loadGraphics);

      const { features } = await this.featureLayer.queryFeatures();
      this.cultures = features.map((feature) => feature.attributes);

      await load();
      this.view.extent = project(this.featureLayer.fullExtent, {
        wkid: 102100,
      });
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
  height: 80vh;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-container {
  background: #fff;
  overflow: auto;
  padding: 8px 24px;
  width: 100%;
  max-height: 500px;
  position: absolute;
  z-index: 100;
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 20px;
  left: 0;
  text-align: center;
}
</style>
