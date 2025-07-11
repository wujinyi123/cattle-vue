import service from '@/utils/request';

export const pageFarm = params => {
    return service.get("/farm/pageFarm", {params});
};

export const listFarm = params => {
    return service.get("/farm/listFarm", {params});
};

export const getFarm = farmCode => {
    return service.get("/farm/getFarm", {params: {farmCode}});
};

export const saveFarm = (type, data) => {
    return service.post("/farm/saveFarm?type=" + type, data);
};

export const delFarm = data => {
    return service.post("/farm/delFarm", data);
};

export const pageFarmZone = params => {
    return service.get("/farm/pageFarmZone", {params});
};

export const listFarmZone = params => {
    return service.get("/farm/listFarmZone", {params});
};

export const getFarmZone = farmZoneCode => {
    return service.get("/farm/getFarmZone", {params: {farmZoneCode}});
};

export const saveFarmZone = (type, data) => {
    return service.post("/farm/saveFarmZone?type=" + type, data);
};

export const delFarmZone = data => {
    return service.post("/farm/delFarmZone", data);
};