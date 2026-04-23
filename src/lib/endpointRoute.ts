import axios from "axios";

const endpointRoute = axios.create({
  baseURL: "https://wealtment-backend.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage on every request
endpointRoute.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("wm_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Surface backend error messages cleanly
endpointRoute.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

export default endpointRoute;

// token helpers
export const saveToken = (token: string) =>
  typeof window !== "undefined" && localStorage.setItem("wm_token", token);

export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("wm_token") : null;

export const clearToken = () =>
  typeof window !== "undefined" && localStorage.removeItem("wm_token");
