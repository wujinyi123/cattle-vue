import service from '@/utils/request';

export const pageFarm = params => {
    return service.get("/farm/pageFarm", {params});
};

export const getFarm = farmId => {
    return service.get("/farm/getFarm", {params: {farmId}});
};

export const saveFarm = (type, data) => {
    return service.post("/farm/saveFarm?type=" + type, data);
};

export const delFarm = data => {
    return service.post("/farm/delFarm", data);
};