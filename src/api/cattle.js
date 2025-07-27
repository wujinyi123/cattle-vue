import service from '@/utils/request';

export const pageCattle = params => {
    return service.get("/cattle/pageCattle", {params});
};

export const listCattle = params => {
    return service.get("/cattle/listCattle", {params});
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

export const pageCattleChangeZone = params => {
    return service.get("/cattle/pageCattleChangeZone", {params});
};

export const addCattleChangeZone = data => {
    return service.post("/cattle/addCattleChangeZone", data);
};

export const pageCattleTransfer = params => {
    return service.get("/cattle/pageCattleTransfer", {params});
};

export const addCattleTransfer = data => {
    return service.post("/cattle/addCattleTransfer", data);
};

export const updateCattleTransferApprover = data => {
    return service.post("/cattle/updateCattleTransferApprover", data);
};

export const updateCattleTransferStatus = data => {
    return service.post("/cattle/updateCattleTransferStatus", data);
};

export const getCattleTransferNum = (currentFarmCode) => {
    return service.get("/cattle/getCattleTransferNum", {params: {currentFarmCode}});
};