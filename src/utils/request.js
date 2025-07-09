import axios from 'axios';
import {Message} from "element-ui";
import tokenUtil from '@/utils/tokenUtil'

const service = axios.create({
    baseURL: "/api",
    timeout: 10000,
});

service.interceptors.request.use(
    config => {
        const token = tokenUtil.getToken();
        if (token) {
            config.headers["token"] = token;
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        let data = getResponseData(response);
        if (data.statusCodeValue != 200) {
            Message.error(data.body || '系统异常');
        }
        return data.body;
    },
    error => {
        let data = getResponseData(error.response);
        Message.error(data.body || '系统异常');
        if (data.statusCodeValue == 401) {
            tokenUtil.removeToken();
            window.app.$router.push('/login');
        }
    }
);

let getResponseData = response => {
    let data = response && response.data;
    if (data && typeof (data) == 'string') {
        try {
            data = JSON.parse(data);
        } catch {
            data = {}
        }
    }
    return data;
}
export default service;
