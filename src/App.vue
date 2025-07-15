<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import tokenUtil from "@/utils/tokenUtil";
import {getCurrentUser} from "@/api/user";

export default {
  beforeCreate() {
    if (tokenUtil.getToken() && (!this.$store.state.user.userInfo || !this.$store.state.user.userInfo.username)) {
      let userInfo = getCurrentUser();
      if (userInfo) {
        this.$store.commit('user/SET_CURRENT_USER', userInfo);
      }
    }
  }
}
</script>
<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css"; /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>