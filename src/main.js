import "ant-design-vue/dist/antd.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { Menu, Layout, List, Button, Spin, Input } from "ant-design-vue";
Vue.config.productionTip = false;

Vue.use(Input);
Vue.use(Spin);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Layout);
Vue.use(List);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
