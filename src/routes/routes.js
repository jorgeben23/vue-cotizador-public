import { createRouter, createWebHistory } from "vue-router";

import Inicio from "./../components/Inicio.vue";
import Cart from "./../components/Cart.vue";
import ListPackage from "./../components/Administrador/ListPackage.vue";
import CreatePackage from "./../components/Administrador/CreatePackage.vue";

const routes = [
  { path: "/", component: Inicio },
  { path: "/cart", component: Cart },
  { path: "/list-package", component: ListPackage },
  { path: "/create-package", component: CreatePackage },
  { path: "/edit-package", component: CreatePackage },
];

const router = createRouter({
  routes,
  history: createWebHistory('/cotizador'),
  linkActiveClass: "vue-school-active-link", // para acoplar el active en los links
});

export default router;
