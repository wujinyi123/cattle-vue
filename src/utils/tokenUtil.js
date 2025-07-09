export default {
    setToken: token => {
        document.cookie = "token=" + token;
        localStorage.setItem('token', token);
    },
    getToken: () => localStorage.getItem('token'),
    removeToken: () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem('token');
        window.app.$store.commit('user/SET_CURRENT_USER', {});
    }
}