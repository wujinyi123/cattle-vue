import service from '@/utils/request';

export const login = data => {
    return service.post("/user/login", data);
};

export const getCurrentUser = async () => {
    return await service.get("/user/getCurrentUser");
};

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