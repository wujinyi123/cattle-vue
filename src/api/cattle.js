import service from '@/utils/request';

export const pageCattle = params => {
    return service.get("/cattle/pageCattle", {params});
};

export const getCattle = cattleId => {
    return service.get("/cattle/getCattle", {params: {cattleId}});
};

export const saveCattle = (type, data) => {
    return service.post("/cattle/saveCattle?type=" + type, data);
};

export const delCattle = data => {
    return service.post("/cattle/delCattle", data);
};

export const listCattle = params => {
    return service.get("/cattle/listCattle", {params});
};