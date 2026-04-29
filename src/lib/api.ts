import axios from "axios";

const BASE_URL =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const API_PREFIX = typeof window !== "undefined" ? "/api/proxy" : "";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "X-API-Version": "1",
  },
});

let cachedCsrfToken: string | null = null;

api.interceptors.request.use(async (config) => {
  // Prefix all paths with /api/proxy when in browser
  if (
    typeof window !== "undefined" &&
    config.url &&
    !config.url.startsWith("/api/proxy")
  ) {
    config.url = `${API_PREFIX}${config.url}`;
  }

  const mutating = ["post", "put", "patch", "delete"].includes(
    config.method?.toLowerCase() || "",
  );

  if (mutating && typeof window !== "undefined") {
    if (!cachedCsrfToken) {
      try {
        const res = await axios.get("/api/proxy/auth/csrf-token", {
          withCredentials: true,
        });
        cachedCsrfToken = res.data.csrf_token;
      } catch (err) {
        console.error("Failed to fetch CSRF token", err);
      }
    }

    if (cachedCsrfToken) {
      config.headers["x-csrf-token"] = cachedCsrfToken;
    }
  }

  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh — cookie sent automatically via proxy
        await api.post("/auth/refresh");
        processQueue(null, "Refreshed");
        isRefreshing = false;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        if (typeof window !== "undefined") {
          // Call logout to clear httpOnly cookies server-side before redirecting
          try {
            await axios.post(
              "/api/proxy/auth/logout",
              {},
              { withCredentials: true },
            );
          } catch {
            // ignore logout errors
          }
          // Invalidate cached CSRF token
          cachedCsrfToken = null;
          window.location.href = "/";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export { BASE_URL };
