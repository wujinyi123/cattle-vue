<template>
  <div class="personal-center-wrap">
    <div style="padding-top: 60px">
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">账号：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ user.username }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">姓名：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ user.name }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">性别：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ user.sex }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">是否系统管理员：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ user.isSysAdmin }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">岗位：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ user.jobName }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">所在牧场：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ user.farmName }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">数据权限：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ user.farmPowerName }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">联系方式：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ user.phone }}</el-col>
      </el-row>
      <el-row class="user-el-row">
        <el-col :span="10" class="user-el-col-label">过期时间：</el-col>
        <el-col :span="14" class="user-el-col-value">{{ user.expireDate }}</el-col>
      </el-row>
      <el-row style="text-align: center;margin-top: 30px">
        <el-col :span="20">
          <el-button type="primary" @click="openUpdatePassword">修改用户密码</el-button>
          <el-button type="primary" @click="updatePhone">修改联系方式</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog :destroy-on-close="true" title="修改用户密码" :visible.sync="updatePasswordDialog.visible">
      <el-form :model="updatePasswordDialog.form" ref="updatePasswordDialog.form" :rules="updatePasswordDialog.rules">
        <el-form-item label="旧密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="updatePasswordDialog.form.password" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
          <el-input type="password" v-model="updatePasswordDialog.form.newPassword" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码" :label-width="formLabelWidth" prop="confirmPassword">
          <el-input type="password" v-model="updatePasswordDialog.form.confirmPassword" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePasswordDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {updatePassword, updatePhone} from '@/api/user';
import tokenUtil from "@/utils/tokenUtil";

export default {
  name: 'PersonalCenter',
  data() {
    return {
      formLabelWidth: '150px',
      user: {},
      updatePasswordDialog: {
        visible: false,
        form: {},
        rules: {
          password: [{required: true, message: '旧密码不能为空', trigger: 'change'}],
          newPassword: [{required: true, message: '新密码不能为空', trigger: 'change'}],
          confirmPassword: [{required: true, message: '再次输入新密码不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    this.getCurrentUserInfo();
  },
  methods: {
    getCurrentUserInfo() {
      this.user = {...this.$store.state.user.userInfo};
    },
    openUpdatePassword() {
      this.updatePasswordDialog.form = {};
      this.updatePasswordDialog.visible = true;
    },
    updatePassword() {
      this.$refs['updatePasswordDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        updatePassword(this.updatePasswordDialog.form).then(res => {
          if (res > 0) {
            this.updatePasswordDialog.visible = false;
            this.updatePasswordDialog.form = {};
            this.$message.success('修改成功，请重新登录');
            tokenUtil.removeToken();
            this.$router.push('/login');
          } else {
            this.$message.error('修改失败');
          }
        });
      });
    },
    updatePhone() {
      this.$prompt('请输入联系方式', '修改联系方式', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (!value) {
          this.$message.error('联系方式不能为空');
        } else {
          updatePhone({phone: value}).then(res => {
            if (res > 0) {
              this.$message.success('修改成功');
              window.location.reload();
            } else {
              this.$message.error('修改失败');
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.personal-center-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('../../../assets/img/personal-center-bg.jpeg');
  background-size: 100%;
}

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
