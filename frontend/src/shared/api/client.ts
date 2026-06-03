import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const path = window.location.pathname;
    if (err.response?.status === 401 && path.startsWith("/admin") && path !== "/admin/login") {
      window.location.assign("/admin/login");
    }
    return Promise.reject(err);
  },
);
