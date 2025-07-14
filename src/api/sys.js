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