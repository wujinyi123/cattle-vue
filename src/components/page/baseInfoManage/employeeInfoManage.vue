<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="账号" :label-width="formLabelWidth">
                <el-input v-model="query.form.username" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                <el-input v-model="query.form.name" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工种" :label-width="formLabelWidth">
                <el-input v-model="query.form.job" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="联系方式" :label-width="formLabelWidth">
                <el-input v-model="query.form.phone" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否管理员" :label-width="formLabelWidth">
                <el-select v-model="query.form.isSysAdmin" style="width:100%">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option v-for="item in isSysAdminList"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" :label-width="formLabelWidth">
                <el-select v-model="query.form.status" style="width:100%">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option v-for="item in userStatusList"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="24" style="text-align:right">
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div v-if="isSysAdmin==='Y'">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addUser">添加</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="updateUser">修改</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="patchUserStatus">批量修改状态</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="resetPassword">批量重置密码</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="delUser">批量删除</el-button>
        </div>
      </div>
      <el-table
          :data="tableData"
          v-loading="loading"
          current-row-key="id"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="job" label="工种"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column prop="isSysAdminValue" label="是否系统管理员"></el-table-column>
        <el-table-column prop="statusValue" label="状态"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="sizes, total, prev, pager, next"
            :current-page="query.pageNum"
            :page-size="query.pageSize"
            :total="pageTotal"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="saveDialog.title" :visible.sync="saveDialog.visible">
      <el-form :model="saveDialog.form">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.username" :disabled="saveDialog.type=='update'" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工种" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.job" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否管理员" :label-width="formLabelWidth">
          <el-select v-model="saveDialog.form.isSysAdmin" style="width:100%">
            <el-option v-for="item in isSysAdminList"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="saveDialog.form.status" style="width:100%">
            <el-option v-for="item in userStatusList"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量修改状态" :visible.sync="setUserStatusDialog.visible">
      <el-form :model="setUserStatusDialog.form" style="width:1000px">
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio-group v-model="setUserStatusDialog.form.value">
            <el-radio v-for="item in userStatusList"
                      :key="item.key"
                      :label="item.key">
              {{ item.value }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setUserStatusDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="setUserStatus">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import currentUser from "@/utils/currentUser";
import {pageUser, getUser, saveUser, setUserStatus, resetPassword, delUser} from '@/api/user';
import configValue from '@/components/common/configValue';

export default {
  name: 'employeeInfoManage',
  data() {
    return {
      isSysAdmin:'N',
      isSysAdminList: [],
      userStatusList: [],
      query: {
        form: {
          username: '',
          name: '',
          job: '',
          phone: '',
          isSysAdmin: '',
          status: 'incumbent',
          pageNum: 1,
          pageSize: 10
        }
      },
      tableData: [],
      loading: false,
      multipleSelection: [],
      pageTotal: 0,
      formLabelWidth: '100px',
      saveDialog: {
        title: '',
        type: 'add',
        visible: false,
        form: {
          username: '',
          name: '',
          job: '',
          phone: '',
          isSysAdmin: 'N',
          status: 'incumbent'
        }
      },
      setUserStatusDialog: {
        visible: false,
        form: {
          value: ''
        }
      }
    };
  },
  created() {
    this.isSysAdmin = currentUser.getIsSysAdmin();
    this.isSysAdminList = configValue.whetherOrNot;
    this.userStatusList = configValue.userStatus;
    this.getData();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.$set(this.query, 'pageSize', val);
      this.getData();
    },
    handlePageChange(val) {
      this.$set(this.query, 'pageNum', val);
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.loading = true;
      pageUser(this.query.form).then(res => {
        let userStatusMap = {};
        this.userStatusList.forEach(item => userStatusMap[item.key] = item.value);
        let isSysAdminMap = {};
        this.isSysAdminList.forEach(item => isSysAdminMap[item.key] = item.value);
        res.list.forEach(item => item.isSysAdminValue = isSysAdminMap[item.isSysAdmin]);
        res.list.forEach(item => item.statusValue = userStatusMap[item.status]);
        this.tableData = res.list;
        this.pageTotal = res.total;
        this.multipleSelection = [];
        this.loading = false;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, 'pageNum', 1);
      this.getData();
    },
    addUser() {
      this.saveDialog.title = '新增';
      this.saveDialog.type = 'add';
      this.saveDialog.form.username = '';
      this.saveDialog.form.name = '';
      this.saveDialog.form.job = '';
      this.saveDialog.form.phone = '';
      this.saveDialog.form.isSysAdmin = 'N';
      this.saveDialog.form.status = 'incumbent';
      this.saveDialog.visible = true;
    },
    updateUser() {
      if (this.multipleSelection.length != 1) {
        this.$message.error('仅请选择一条数据');
        return;
      }
      this.saveDialog.title = '修改';
      this.saveDialog.type = 'update';
      getUser(this.multipleSelection[0].username).then(res => {
        this.saveDialog.form.username = res.username;
        this.saveDialog.form.name = res.name;
        this.saveDialog.form.job = res.job;
        this.saveDialog.form.phone = res.phone;
        this.saveDialog.form.isSysAdmin = res.isSysAdmin;
        this.saveDialog.form.status = res.status;
      });
      this.saveDialog.visible = true;
    },
    saveUser() {
      saveUser(this.saveDialog.type, this.saveDialog.form).then(res => {
        if (res > 0) {
          this.saveDialog.visible = false;
          this.$message.success('保存成功');
          this.getData();
        } else {
          this.$message.error('保存失败');
        }
      });
    },
    patchUserStatus() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('至少选择一条数据');
        return;
      }
      this.setUserStatusDialog.visible = true;
    },
    setUserStatus() {
      if (!this.setUserStatusDialog.form.value) {
        this.$message.error('请选择状态');
        return;
      }
      setUserStatus(this.setUserStatusDialog.form.value, this.multipleSelection.map(item => item.username)).then(res => {
        if (res > 0) {
          this.setUserStatusDialog.visible = false;
          this.$message.success('修改成功');
          this.getData();
        } else {
          this.$message.error('修改失败');
        }
      });
    },
    resetPassword() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('至少选择一条数据');
        return;
      }
      this.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(this.multipleSelection.map(item => item.username)).then(res => {
          if (res > 0) {
            this.$message.success('重置密码成功');
            this.getData();
          } else {
            this.$message.error('重置密码失败');
          }
        });
      });
    },
    delUser() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('至少选择一条数据');
        return;
      }
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser(this.multipleSelection.map(item => item.username)).then(res => {
          if (res > 0) {
            this.$message.success('删除成功');
            this.getData();
          } else {
            this.$message.error('删除失败');
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-el-row {
  margin: 10px 0;
  text-align: center;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
