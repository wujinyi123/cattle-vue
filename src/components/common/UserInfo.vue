<template>
  <div style="display: inline-block">
    <el-link type="primary" :underline="false" @click="getUserInfo">{{ username }}</el-link>
    <el-dialog :destroy-on-close="true" :append-to-body="true" title="用户信息" :visible.sync="userDialogVisible">
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">账号：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ userInfo.username }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">姓名：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ userInfo.name }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">工种：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ userInfo.job }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">联系方式：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ userInfo.phone }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">是否系统管理员：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ userInfo.isSysAdminValue }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">状态：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ userInfo.statusValue }}</el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getUser} from '@/api/user';

export default {
  name: 'UserInfo',
  props: {
    username: {
      type: String,
      default: 'NA'
    }
  },
  data() {
    return {
      userDialogVisible: false,
      userInfo: {}
    };
  },
  methods: {
    getUserInfo() {
      this.userDialogVisible = true;
      if (!this.userInfo.id) {
        getUser(this.username).then(res => this.userInfo = res || {});
      }
    }
  }
};
</script>

<style scoped>
.user-el-row {
  margin: 10px 0;
  font-size: 20px;
}

.user-el-col-label {
  text-align: right;
  font-weight: bold;
}

.user-el-col-value {
  text-align: left;
}
</style>
