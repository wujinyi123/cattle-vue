import service from '@/utils/request';

export const pageBreedRegister = params => {
    return service.get("/breed/pageBreedRegister", {params});
};

export const addBreedRegister = data => {
    return service.post("/breed/addBreedRegister", data);
};

export const delBreedRegister = data => {
    return service.post("/breed/delBreedRegister", data);
};

export const pageBreedPregnancyCheck = params => {
    return service.get("/breed/pageBreedPregnancyCheck", {params});
};

export const addBreedPregnancyCheck = data => {
    return service.post("/breed/addBreedPregnancyCheck", data);
};

export const addBreedPregnancyCheckByCattle = data => {
    return service.post("/breed/addBreedPregnancyCheckByCattle", data);
};

export const delBreedPregnancyCheck = data => {
    return service.post("/breed/delBreedPregnancyCheck", data);
};

export const pageBreedPregnancyResult = params => {
    return service.get("/breed/pageBreedPregnancyResult", {params});
};

export const addBreedPregnancyResult = data => {
    return service.post("/breed/addBreedPregnancyResult", data);
};

export const delBreedPregnancyResult = data => {
    return service.post("/breed/delBreedPregnancyResult", data);
};