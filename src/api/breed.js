import service from '@/utils/request';

export const pageBeedRegister = params => {
    return service.get("/breed/pageBeedRegister", {params});
};

export const addBeedRegister = data => {
    return service.post("/breed/addBeedRegister", data);
};

export const delBeedRegister = data => {
    return service.post("/breed/delBeedRegister", data);
};

export const pageBeedPregnancyCheck = params => {
    return service.get("/breed/pageBeedPregnancyCheck", {params});
};

export const addBeedPregnancyCheck = data => {
    return service.post("/breed/addBeedPregnancyCheck", data);
};

export const delBeedPregnancyCheck = data => {
    return service.post("/breed/delBeedPregnancyCheck", data);
};