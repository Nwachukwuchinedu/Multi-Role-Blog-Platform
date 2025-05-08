import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("token"),
    role: localStorage.getItem("role") || "reader",
  }),
  actions: {
    setAuth(token, user) {
      this.token = token;
      this.user = user;
      this.role = user.role;
      this.isAuthenticated = true;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
    },
    logout() {
      this.token = null;
      this.user = null;
      this.role = "reader";
      this.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
  },
  getters: {
    isAdmin: (state) => state.role === "admin",
    isAuthor: (state) => ["author", "admin"].includes(state.role),
    isReader: (state) => state.role === "reader",
  },
});
