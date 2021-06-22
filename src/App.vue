<template>
  <a-layout id="app">
    <a-layout-sider>
      <a-menu
        :default-selected-keys="['district']"
        v-model="selectedKeys"
        theme="dark"
        mode="inline"
      >
        <template v-for="item in menu">
          <template v-if="'children' in item">
            <a-sub-menu :key="item.key">
              <span slot="title">{{ item.text }}</span>
              <a-menu-item
                v-for="{ key, text, link } in item.children"
                :key="key"
              >
                <router-link :to="link"
                  ><span>{{ text }}</span></router-link
                >
              </a-menu-item>
            </a-sub-menu>
          </template>

          <template v-else>
            <a-menu-item :key="item.key">
              <router-link :to="item.link"
                ><span>{{ item.text }}</span></router-link
              >
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script>
const menu = [
  {
    key: "distribution",
    text: "文化产业分布",
    children: [
      {
        key: "district",
        text: "各区县分布",
        link: "/distribution/district",
      },
      {
        key: "square",
        text: "人命广场分布",
        link: "/distribution/square",
      },
    ],
  },
  {
    key: "hotspot",
    text: "文化产业热点",
    children: [
      {
        key: "yangpu",
        text: "杨浦区文化产业热点",
        link: "/hotspot/yangpu",
      },
      {
        key: "jiading",
        text: "嘉定区文化产业热点",
        link: "/hotspot/jiading",
      },
    ],
  },
];

export default {
  data: () => ({
    menu,
    selectedKeys: ["district"],
  }),
  mounted() {
    console.log("mouted");
    const pathArr = this.$route.path.split("/");
    this.selectedKeys = [pathArr[pathArr.length - 1]];
  },
};
</script>

<style>
@import url(https://js.arcgis.com/4.19/esri/themes/light/main.css);

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
</style>

<style scoped>
.content {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
</style>
