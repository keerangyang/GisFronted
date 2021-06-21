import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const BlankView = {
  template: "<router-view></router-view>",
};

const routes = [
  {
    path: "/distribution",
    component: BlankView,
    children: [
      {
        path: "/distribution/district",
        component: () =>
          import("../views/distribution/DistrictDistribution.vue"),
      },
      {
        path: "/distribution/square",
        component: () => import("../views/distribution/SquareDistribution.vue"),
      },
    ],
  },
  {
    path: "/hotspot",
    component: BlankView,
    children: [
      {
        path: "/hotspot/yangpu",
        component: () => import("../views/hotspot/YangpuHotspot.vue"),
      },
      {
        path: "/hotspot/jiading",
        component: () => import("../views/hotspot/JiadingHotspot.vue"),
      },
    ],
  },
  {
    path: "/",
    redirect: "/distribution/district",
  },
  {
    path: "/index",
    redirect: "/distribution/district",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
