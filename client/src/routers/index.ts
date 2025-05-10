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
    component: () => import("../layouts/UserLayout.vue"),
    meta: { layout: "user", title: "Swap Book" },
    children: [
      {
        path: "/",
        component: () => import("../views/user/HomeView.vue"),
        meta: { layout: "home-page", title: "Swap Book | Home" },
      },
    ],
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
        name: "Users Management",
        meta: {
          title: "Dashboard | User",
        },
      },
      {
        path: "profile",
        component: () => import("../views/admin/auth/Profile.vue"),
        name: "Profile",
        meta: {
          title: "Dashboard | Profile",
        },
      },
      {
        path: "categories",
        component: () => import("../views/admin/categories/CategoriesView.vue"),
        name: "Categories",
        meta: {
          title: "Dashboard | Categories",
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

  // Skip redirection for public routes
  if (to.meta.isPublic) {
    return next();
  }

  // Handle guest-only routes (login pages)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next(authStore.isAdmin ? "/admin/dashboard" : "/");
  }

  // Handle protected routes
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      authStore.setReturnUrl(to.fullPath);
      return next(authStore.isAdmin ? "/admin/login" : "/");
    }

    // Handle admin-only routes
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return next("/");
    }
  }


  next();
});

export default router;
