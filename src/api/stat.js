import service from '@/utils/request';

export const homeStat = farmCode => {
    return service.get("/stat/homeStat", {params: {farmCode}});
};