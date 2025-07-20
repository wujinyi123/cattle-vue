import service from '@/utils/request';

export const importRequireField = templateCode => {
    return service.get("/common/importRequireField", {params: {templateCode}});
};

export const hasHelpFile = () => {
    return service.get("/common/hasHelpFile");
};