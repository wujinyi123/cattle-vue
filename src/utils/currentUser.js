export default {
    set: (userInfo) => {
        document.cookie = "token=" + userInfo.token;
        localStorage.setItem('token', userInfo.token);
        localStorage.setItem('username', userInfo.username);
        localStorage.setItem('name', userInfo.name);
        localStorage.setItem('isSysAdmin', userInfo.isSysAdmin);
    },
    setInfo: (userInfo) => {
        localStorage.setItem('username', userInfo.username);
        localStorage.setItem('name', userInfo.name);
        localStorage.setItem('isSysAdmin', userInfo.isSysAdmin);
    },
    getToken: () => localStorage.getItem('token'),
    getUsername: () => localStorage.getItem('username'),
    getName: () => localStorage.getItem('name'),
    getIsSysAdmin: () => localStorage.getItem('isSysAdmin'),
    remove: () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('isSysAdmin');
    }
}