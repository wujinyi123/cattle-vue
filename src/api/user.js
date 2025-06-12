import service from '@/utils/request';

// 用户登录
export const loginApi = data => {
    return service.post("/user/login", data);
};

export const pageUser = params => {
    return service.get("/user/pageUser", {params});
};