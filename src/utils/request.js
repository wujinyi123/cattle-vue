import axios from 'axios';
import { Message } from "element-ui";

const service = axios.create({
    baseURL: "/api",
    timeout: 10000,
});

service.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
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
        let data = response.data;
        if (typeof(data)=='string') {
            try {
                data = JSON.parse(data);
            } catch {
                data = {}
            }
        }
        if (data.statusCodeValue!=200) {
            Message.error(data.body || '系统异常');
        }
        return data.body;
    },
    error => {
        Message.error(error);
    }
);

export default service;
