import { createRouter, createWebHistory } from "vue-router";
import RoomView from "../views/RoomView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  {
    path: "/room/:roomid",
    name: "room",
    component: RoomView,
  },
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
