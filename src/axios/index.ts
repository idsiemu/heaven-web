import axios from 'axios'
import { TOKEN, REFRESH_TOKEN } from 'src/assets/utils/ENV';
import { useCookie } from "next-cookie";

const cookie = useCookie();
const heaven_token = cookie.get(TOKEN)
const refersh_token = cookie.get(REFRESH_TOKEN)

const interceptor = (value:string) => {
    const axiosApiInstance = axios.create();
    
    axiosApiInstance.interceptors.request.use(
        async config => {
          config.headers = {
            ...config.headers,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            [TOKEN]: heaven_token,
            [REFRESH_TOKEN]: refersh_token
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
            cookie.set(TOKEN, refreshed)
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