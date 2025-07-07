import service from '@/utils/request';

export const homeStat = () => {
    return service.get("/stat/homeStat");
};