// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/useUserStore";

// Layouts
import DefaultLayout from "../layouts/DefaultLayout.vue";
import AuthorLayout from "../layouts/AuthorLayout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";

// Pages
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import PostDetail from "../pages/PostDetail.vue";
import MyPosts from "../pages/MyPosts.vue";
import Dashboard from "../pages/Dashboard.vue";
import NotFound from "../pages/NotFound.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "post/:id", name: "PostDetail", component: PostDetail },
    ],
  },

  {
    path: "/author",
    component: AuthorLayout,
    meta: { requiresAuth: true, requiresAuthor: true },
    children: [
      { path: "posts", name: "MyPosts", component: MyPosts },
      {
        path: "posts/new",
        name: "NewPost",
        component: () => import("../pages/NewPost.vue"),
      },
      {
        path: "posts/edit/:id",
        name: "EditPost",
        component: () => import("../pages/EditPost.vue"),
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("../pages/Profile.vue"),
      },
    ],
  },

  {
    path: "/admin",
    // component: AdminLayout,
    // meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: "dashboard", name: "AdminDashboard", component: Dashboard },
      {
        path: "users",
        name: "UserManagement",
        component: () => import("../pages/UserManagement.vue"),
      },
      {
        path: "posts",
        name: "PostModeration",
        component: () => import("../pages/PostModeration.vue"),
      },
    ],
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next("/login");
  } else if (to.meta.requiresAuthor && !userStore.isAuthor) {
    next("/login");
  } else if (!isAuthenticated && to.meta.requiresAuth) {
    next("/login");
  } else if (to.meta.guestOnly && isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
