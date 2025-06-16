export default {
    set: (userInfo) => {
        localStorage.setItem('token', userInfo.token);
        localStorage.setItem('username', userInfo.username);
        localStorage.setItem('name', userInfo.name);
        localStorage.setItem('isSysAdmin', userInfo.isSysAdmin);
    },
    getToken: () => localStorage.getItem('token'),
    getUsername: () => localStorage.getItem('username'),
    getName: () => localStorage.getItem('name'),
    getIsSysAdmin: () => localStorage.getItem('isSysAdmin'),
    remove: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('isSysAdmin');
    }
}