import service from '@/utils/request';

export const pageInventoryBuy = params => {
    return service.get("/inventory/pageInventoryBuy", {params});
};

export const addInventoryBuy = data => {
    return service.post("/inventory/addInventoryBuy", data);
};

export const delInventoryBuy = data => {
    return service.post("/inventory/delInventoryBuy", data);
};

export const pageInventoryDeath= params => {
    return service.get("/inventory/pageInventoryDeath", {params});
};

export const addInventoryDeath = data => {
    return service.post("/inventory/addInventoryDeath", data);
};

export const delInventoryDeath = data => {
    return service.post("/inventory/delInventoryDeath", data);
};

export const pageInventorySell= params => {
    return service.get("/inventory/pageInventorySell", {params});
};

export const addInventorySell = data => {
    return service.post("/inventory/addInventorySell", data);
};

export const delInventorySell = data => {
    return service.post("/inventory/delInventoryDeath", data);
};