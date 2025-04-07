import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";
import { useAuthStore } from "../stores/auth.store";

declare module "vue-router" {
  interface RouteMeta {
    layout?: string;
    title?: string;
  }
}

const routes: RouteRecordRaw[] = [
  // user
  {
    path: "/",
    component: () => import("../views/user/HomeView.vue"),
    meta: { layout: "user", title: "Swap Book | Home" },
  },
  {
    path: "/login",
    component: () => import("../views/user/auth/LoginUser.vue"),
    meta: { layout: "user", title: "Swap Book | Login" },
  },
  {
    path: "/admin/login",
    component: () => import("../views/admin/auth/LoginAdmin.vue"),
    meta: { layout: "admin login", title: "Swap Book | Login" },
  },
  // admin route
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "dashboard",
        component: () => import("../views/admin/DashboardView.vue"),
        meta: {
          title: "Dashboard | Admin",
        },
      },
      {
        path: "users",
        component: () => import("../views/admin/UsersView.vue"),
        meta: {
          title: "Dashboard | User",
        },
      },
    ],
  },
  // 404 route
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/NotFounds.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  document.title = to.meta.title || "Swap Book";

  // Handle guest-only routes (like login pages)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next(authStore.isAdmin ? "/admin/dashboard" : "/");
  }

  // Handle protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    authStore.setReturnUrl(to.fullPath);
    return next("/admin/login");
  }

  // Handle admin-only routes
  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      authStore.setReturnUrl(to.fullPath);
      return next("/admin/login");
    }
    if (!authStore.isAdmin) {
      return next("/");
    }
  }

  next();
});

export default router;
