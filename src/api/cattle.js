import service from '@/utils/request';

export const pageCattle = params => {
    return service.get("/cattle/pageCattle", {params});
};

export const getCattle = cattleCode => {
    return service.get("/cattle/getCattle", {params: {cattleCode}});
};

export const saveCattle = (type, data) => {
    return service.post("/cattle/saveCattle?type=" + type, data);
};

export const delCattle = data => {
    return service.post("/cattle/delCattle", data);
};