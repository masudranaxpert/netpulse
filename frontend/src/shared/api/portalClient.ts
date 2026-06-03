import axios from "axios";

const TOKEN_KEY = "portal_token";

export const getPortalToken = () => localStorage.getItem(TOKEN_KEY);
export const setPortalToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearPortalToken = () => localStorage.removeItem(TOKEN_KEY);

export const portalApi = axios.create({
  baseURL: "/api/portal",
  headers: { "Content-Type": "application/json" },
});

portalApi.interceptors.request.use((config) => {
  const token = getPortalToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

portalApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearPortalToken();
      if (!window.location.pathname.startsWith("/portal/login")) {
        window.location.assign("/portal/login");
      }
    }
    return Promise.reject(err);
  },
);
