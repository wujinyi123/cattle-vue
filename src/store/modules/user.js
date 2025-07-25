const state = () => ({
    userInfo: {},
    currentFarmCode: ''
});

const mutations = {
    SET_CURRENT_USER(state, userInfo) {
        state.userInfo = userInfo;
        let farmCodeList = userInfo.farmPowerList && userInfo.farmPowerList.map(item => item.farmCode) || [];
        let currentFarmCode = localStorage.getItem('currentFarmCode');
        if (!currentFarmCode || !farmCodeList.includes(currentFarmCode)) {
            currentFarmCode = farmCodeList.length > 0 ? farmCodeList[0] : '';
        }
        if (currentFarmCode) {
            state.currentFarmCode = currentFarmCode;
            localStorage.setItem('currentFarmCode', currentFarmCode);
        }
    },
    SET_CURRENT_FARM_CODE(state, farmCode) {
        state.currentFarmCode = farmCode;
        localStorage.setItem('currentFarmCode', farmCode);
    }
};

const actions = {
    /*setCurrentUser({commit}) {
        getCurrentUser().then(res => commit('SET_CURRENT_USER', res));
    }*/
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};