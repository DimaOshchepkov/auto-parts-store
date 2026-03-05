import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axios from 'axios';

type RetryConfig = AxiosRequestConfig & { _retry?: boolean };

export const http: AxiosInstance = axios.create({
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// ---- CSRF init + queue ----
let csrfPromise: Promise<void> | null = null;
let refreshPromise: Promise<void> | null = null;

async function ensureCsrfCookie(): Promise<void> {
  // чтобы несколько параллельных запросов не дернули endpoint N раз
  if (!csrfPromise) {
    csrfPromise = http
      .get('/sanctum/csrf-cookie')
      .then(() => undefined)
      .finally(() => {
        // оставляем promise кешированным — можно и не сбрасывать
        // (если хочешь повторять init при перезагрузке — всё равно перезагрузка создаст новый runtime)
      });
  }
  return csrfPromise;
}

async function refreshCsrfCookie(): Promise<void> {
  // если уже обновляем — ждём тот же промис
  if (!refreshPromise) {
    refreshPromise = http
      .get('/sanctum/csrf-cookie')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// ---- Request interceptor: гарантируем, что CSRF cookie есть ----
http.interceptors.request.use(async (config) => {
  // Не дергаем csrf-cookie для самого endpoint'а, иначе рекурсия
  if (config.url?.includes('/sanctum/csrf-cookie')) return config;

  // Можно ограничить только “мутациями”, но обычно ок и для всех API
  await ensureCsrfCookie();

  return config;
});

// ---- Response interceptor: ловим 419 и ретраим ----
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const config = (error.config ?? {}) as RetryConfig;

    // 419 = CSRF token mismatch (Laravel)
    if (status === 419 && !config._retry) {
      config._retry = true;

      try {
        await refreshCsrfCookie();
        return http.request(config);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
