export default {
    set: (userInfo) => {
        localStorage.setItem('token', userInfo.token);
        localStorage.setItem('username', userInfo.username);
        localStorage.setItem('name', userInfo.name);
    },
    getToken: () => localStorage.getItem('token'),
    getUsername: () => localStorage.getItem('username'),
    getName: () => localStorage.getItem('name'),
    getInfo: () => {
        return {
            token: localStorage.getItem('token'),
            username: localStorage.getItem('username'),
            name: localStorage.getItem('name')
        }
    },
    remove: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
    }
}