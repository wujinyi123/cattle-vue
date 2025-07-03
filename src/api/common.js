import service from '@/utils/request';

export const pageSysConfig = params => {
    return service.get("/common/pageSysConfig", {params});
};

export const addSysConfig = data => {
    return service.post("/common/addSysConfig", data);
};

export const delSysConfig = data => {
    return service.post("/common/delSysConfig", data);
};

export const importRequireField = templateCode => {
    return service.get("/common/importRequireField", {params: {templateCode}});
};