import Vue from "vue";
import VueRouter from "vue-router";
// import { component } from "vue/types/umd";
import Home from "../views/Home.vue";
import UserHome from "../views/UserHome.vue";
import Game from "../views/Game.vue";

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
  },
  {
    path: "/Game",
    name: "Game",
    component: Game
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
