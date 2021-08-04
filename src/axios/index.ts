import axios from 'axios'
import { TOKEN, REFRESH_TOKEN } from 'src/assets/utils/ENV';
import { useCookie } from "next-cookie";
import { getCookieValue } from 'src/utils/cookie';

const interceptor = (value:string) => {
    
    const axiosApiInstance = axios.create();
    axiosApiInstance.interceptors.request.use(
        async config => {
          config.headers = {
            ...config.headers,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            [TOKEN]: getCookieValue(TOKEN),
            [REFRESH_TOKEN]: getCookieValue(REFRESH_TOKEN),
          };
          return config;
        },
        error => {
          Promise.reject(error);
        }
    );

    axiosApiInstance.interceptors.response.use(
        async response => {
          if(response.data.data[value].status === 201){
            const originalRequest = response.config
            const refreshed = response.data.data[value].token
            const cookie = useCookie();
            cookie.set(TOKEN, refreshed, { path: '/' });
            originalRequest.headers[TOKEN] = refreshed
            const { data } = await axios(originalRequest);
            return data
          }
          return response.data
        },
        async error => {
          return Promise.reject(error);
        }
    );
    return axiosApiInstance;
}

export default interceptor