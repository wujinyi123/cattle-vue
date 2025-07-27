import service from '@/utils/request';

export const pageQuarantineRegister = params => {
    return service.get("/healthDisease/pageQuarantineRegister", {params});
};

export const addQuarantineRegister = data => {
    return service.post("/healthDisease/addQuarantineRegister", data);
};

export const delQuarantineRegister = data => {
    return service.post("/healthDisease/delQuarantineRegister", data);
};

export const pageImmunityRegister = params => {
    return service.get("/healthDisease/pageImmunityRegister", {params});
};

export const addImmunityRegister = data => {
    return service.post("/healthDisease/addImmunityRegister", data);
};

export const delImmunityRegister = data => {
    return service.post("/healthDisease/delImmunityRegister", data);
};