import axios from "axios";
import { useUserStore } from '@/store/user';

const httpInstance = axios.create({
    baseURL: "http://ai.tordor.top:38100",
    timeout: 5000
});
//拦截器
// 定义允许无Token访问的URL常量
const LOGIN_URL = '/api/admin/login';
const REG_URL = '/api/admin/reg';

httpInstance.interceptors.request.use(config => {
    // 移除敏感信息的console.log，改为必要时使用适当的日志级别进行记录
    const userStore = useUserStore();
    const token = userStore.userInfo.token;
    console.log(config.url);
    // 检查Token是否存在以及URL是否是允许无Token访问的特殊URL
    if (token) {
        // 如果有Token，则添加到请求头中
        config.headers.token = `${token}`;
    } else if (config.url !== '/api/admin/login') {
        // 如果没有Token且不是登录或注册请求，拒绝请求
        return Promise.reject(new Error('未登录，请先登录！'));
    }
    return config;
}, error => {
    // 对于请求错误，可以考虑增加更多的错误处理逻辑或错误日志
    // 此处保持简单处理，直接返回拒绝的Promise
    return Promise.reject(error);
});
httpInstance.interceptors.response.use(response => {
    return response.data;
}, error => {
    return Promise.reject(error);
});
export const baseURL = httpInstance.defaults.baseURL;
export default httpInstance;