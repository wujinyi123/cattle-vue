export const getPageActionPower = pageCode => {
    let userInfo = {...window.app.$store.state.user.userInfo};
    if (userInfo.isSysAdmin === 'Y') {
        return {
            insert: true,
            update: true,
            delete: true
        }
    }
    let jobPower = userInfo.jobObj && userInfo.jobObj.jobPower;
    let jobPowerObj = {};
    try {
        jobPowerObj = JSON.parse(jobPower);
    } catch (e) {

    }
    let actionList = jobPowerObj[pageCode] || [];
    return {
        insert: actionList.includes('insert'),
        update: actionList.includes('update'),
        delete: actionList.includes('delete')
    }
}