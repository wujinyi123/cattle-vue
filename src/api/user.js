import service from '@/utils/request';
import tokenUtil from "@/utils/tokenUtil";
import {Message} from "element-ui";

export const login = data => {
    return service.post("/user/login", data);
};

export function getCurrentUser() {
    let xhr = new XMLHttpRequest();
    let data;
    xhr.open("GET", "/api/user/getCurrentUser", false); // 第三个参数设置为false表示同步请求
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            data = xhr.responseText;
        }
    };
    xhr.send();
    data = data && JSON.parse(data) || {};
    if (data.statusCodeValue == 200) {
        return data.body || {};
    }
    if (data.statusCodeValue == 401) {
        Message.error(data.body || '登录过期');
        tokenUtil.removeToken();
        window.app.$router.push('/login');
        return null;
    } else {
        Message.error(data.body || '系统异常');
        return null;
    }

}

export const pageUser = params => {
    return service.get("/user/pageUser", {params});
};

export const listUser = () => {
    return service.get("/user/listUser");
};

export const getUser = username => {
    return service.get("/user/getUser", {params: {username}});
};

export const saveUser = (type, data) => {
    return service.post("/user/saveUser?type=" + type, data);
};

export const setUserStatus = (status, data) => {
    return service.post("/user/setUserStatus?status=" + status, data);
};

export const resetPassword = data => {
    return service.post("/user/resetPassword", data);
};

export const updatePassword = data => {
    return service.post("/user/updatePassword", data);
};

export const updatePhone = data => {
    return service.post("/user/updatePhone", data);
};

export const delUser = data => {
    return service.post("/user/delUser", data);
};

export const reloadPassword = username => {
    return service.post("/user/reloadPassword?username=" + username);
}