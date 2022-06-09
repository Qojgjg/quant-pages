import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  action: 'None' | 'Prompts' | 'ReLogin';
  prompts: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      if (res.action === 'Prompts') {
        Message.error({
          content: res.prompts || 'Error',
          duration: 5 * 1000,
        });
      }
      return Promise.reject(new Error(res.prompts || 'Error'));
    }
    return res;
  },
  (error) => {
    const resp: AxiosResponse = error.response;
    if (resp.status === 401 || resp.status === 403) {
      Message.error({
        content: '请重新登录',
        duration: 5 * 1000,
      });

      const userStore = useUserStore();

      userStore.logout().then(() => {
        window.location.reload();
      });
    }

    return Promise.reject(error);
  }
);
