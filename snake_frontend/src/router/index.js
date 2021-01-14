import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import UserHome from "../views/UserHome.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/UserHome",
    name: "UserHome",
    component: UserHome
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
