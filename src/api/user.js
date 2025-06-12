import service from '../utils/request';

// 用户登录
export const loginApi = (data) => {
    return service.post("/user/login", data);
};
