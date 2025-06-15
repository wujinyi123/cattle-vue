import service from '@/utils/request';

export const login = data => {
    return service.post("/user/login", data);
};

export const getCurrentUser = () => {
    return service.get("/user/getCurrentUser");
};

export const pageUser = params => {
    return service.get("/user/pageUser", {params});
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

export const delUser = data => {
    return service.post("/user/delUser", data);
};