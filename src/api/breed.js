import service from '@/utils/request';
import {saveCattle} from "@/api/cattle";

export const pageBreedFrozenSemen = params => {
    return service.get("/breed/pageBreedFrozenSemen", {params});
};

export const listBreedFrozenSemen = params => {
    return service.get("/breed/listBreedFrozenSemen", {params});
};

export const getBreedFrozenSemen = frozenSemenCode => {
    return service.get("/breed/getBreedFrozenSemen", {params: {frozenSemenCode}});
};

export const saveBreedFrozenSemen = (type, data) => {
    return service.post("/breed/saveBreedFrozenSemen?type=" + type, data);
};

export const delBreedFrozenSemen = data => {
    return service.post("/breed/delBreedFrozenSemen", data);
};

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