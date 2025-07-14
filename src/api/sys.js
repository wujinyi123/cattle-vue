import service from '@/utils/request';

export const listSysJob = () => {
    return service.get("/sys/listSysJob");
};

export const getSysJob = jobCode => {
    return service.get("/sys/getSysJob", {params: {jobCode}});
};

export const saveSysJob = (type, data) => {
    return service.post("/sys/saveSysJob?type=" + type, data);
};

export const delSysJob = jobCode => {
    return service.post("/sys/delSysJob?jobCode=" + jobCode);
};

export const pageSysConfig = params => {
    return service.get("/sys/pageSysConfig", {params});
};

export const listSysConfig = code => {
    return service.get("/sys/listSysConfig", {params:{code}});
};

export const addSysConfig = data => {
    return service.post("/sys/addSysConfig", data);
};

export const delSysConfig = data => {
    return service.post("/sys/delSysConfig", data);
};