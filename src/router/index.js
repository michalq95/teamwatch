import { createRouter, createWebHistory } from "vue-router";
import RoomView from "../views/RoomView.vue";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/room/:roomid",
    name: "room",
    component: RoomView,
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
