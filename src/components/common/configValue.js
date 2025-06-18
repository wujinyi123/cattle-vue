export default {
    getValueList: map => {
        if (!map) {
            return [];
        }
        let list = [];
        let keys = Object.keys(map);
        keys.forEach(key => list.push({key, value: map[key]}));
    },
    whetherOrNot: {
        Y: '是',
        N: '否'
    },
    userStatus: {
        incumbent: '在职',
        resign: '离职'
    },
    cattleBreed: {
        Aengus: '安格斯',
        SimonDahl: '西门达尔',
        TatsugiZan: '立木赞',
        BelgianBlue: '比利时蓝',
        Other: '其他'
    },
    cattleSex: {
        male: '公',
        female: '母'
    },
    breedingMethod: {
        nature: '自然',
        samePeriod: '同期',
        principal: '本交'
    }
}