import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // user
    {
      path: "/",
      component: () => import("../views/user/HomeView.vue"),
      meta: { layout: "user" },
    },
    // admin route
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        {
          path: "",
          component: () => import("../views/admin/DashboardView.vue"),
        },
        {
          path: "users",
          component: () => import("../views/admin/UsersView.vue"),
        },
      ],
    },
    // 404 route
    {
      path: "/:pathMatch(.*)*",
      component: () => import("../views/NotFounds.vue"),
    },
  ],
});
export default router;
