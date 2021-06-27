import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const BlankView = {
  template: "<router-view></router-view>",
};

const routes = [
  {
    path: "/culture",
    component: () => import("../views/Culture.vue"),
  },
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
      {
        path: "/distribution/circle",
        component: () => import("../views/distribution/CircleDistribution.vue"),
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
    path: "/industryplan",
    component:BlankView,
    children:[
      {
        path:"/industryplan/industry",
        component:()=>import("../views/industryplan/industry.vue"),
      }
    ],
  },
  {
    path:"/trafficpressure",
    component:BlankView,
    children:[
      {
        path:"/trafficpressure/highway",
        component:()=>import("../views/trafficpressure/highway.vue")
      },
      {
        path:"/trafficpressure/subway",
        component:()=>import("../views/trafficpressure/subway.vue")
      }
    ]
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
