import service from '@/utils/request';

// 角色
export const listRole = () => {
    return service.get("/user/listRole");
};

// 用户登录
export const login = data => {
    return service.post("/user/login", data);
};

export const pageUser = params => {
    return service.get("/user/pageUser", {params});
};