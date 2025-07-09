<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="账号" :label-width="formLabelWidth">
                <el-input v-model="query.form.username" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                <el-input v-model="query.form.name" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工种" :label-width="formLabelWidth">
                <el-input v-model="query.form.job" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="联系方式" :label-width="formLabelWidth">
                <el-input v-model="query.form.phone" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否管理员" :label-width="formLabelWidth">
                <el-select v-model="query.form.isSysAdmin" style="width:100%" placeholder="请选择">
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
                <el-select v-model="query.form.status" style="width:100%" placeholder="请选择">
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
        <div>
          <template v-if="$store.state.user.userInfo.isSysAdmin==='Y'">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addInfo">添加</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="updateInfo">修改</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="delInfo">批量删除</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="patchUserStatus">批量修改状态</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="resetPassword">批量重置密码</el-button>
          </template>
          <import-export :template-code="'user'" :params="query.form"></import-export>
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
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
        <el-table-column prop="updateUser" label="修改人"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="sizes, total, prev, pager, next"
            :current-page="query.form.pageNum"
            :page-size="query.form.pageSize"
            :total="pageTotal"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :destroy-on-close="true" :title="saveDialog.title" :visible.sync="saveDialog.visible">
      <el-form :model="saveDialog.form" ref="saveDialog.form" :rules="saveDialog.rules">
        <el-form-item label="账号" :label-width="formLabelWidth" prop="username">
          <el-input v-model="saveDialog.form.username" :disabled="saveDialog.type==='update'" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="saveDialog.form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="工种" :label-width="formLabelWidth" prop="job">
          <el-input v-model="saveDialog.form.job" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="saveDialog.form.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否管理员" :label-width="formLabelWidth" prop="isSysAdmin">
          <el-select v-model="saveDialog.form.isSysAdmin" style="width:100%" placeholder="请选择">
            <el-option v-for="item in isSysAdminList"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-select v-model="saveDialog.form.status" style="width:100%" placeholder="请选择">
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
        <el-button type="primary" @click="saveInfo">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :destroy-on-close="true" title="批量修改状态" :visible.sync="setUserStatusDialog.visible">
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
import ImportExport from "@/components/common/ImportExport";
import {listSysConfig} from "@/api/common";
import {pageUser, getUser, saveUser, setUserStatus, resetPassword, delUser} from '@/api/user';

export default {
  name: 'EmployeeInfoManage',
  components: {
    ImportExport
  },
  data() {
    return {
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
        },
        rules: {
          username: [{required: true, message: '账号不能为空', trigger: 'change'}],
          name: [{required: true, message: '姓名不能为空', trigger: 'change'}],
          job: [{required: true, message: '工种不能为空', trigger: 'change'}],
          phone: [{required: true, message: '联系方式不能为空', trigger: 'change'}],
          isSysAdmin: [{required: true, message: '是否系统管理员不能为空', trigger: 'change'}],
          status: [{required: true, message: '状态不能为空', trigger: 'change'}]
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
    listSysConfig('isSysAdmin').then(res => this.isSysAdminList = res);
    listSysConfig('userStatus').then(res => this.userStatusList = res);
    this.getData();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.query.form.pageSize = val;
      this.getData();
    },
    handlePageChange(val) {
      this.query.form.pageNum = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.loading = true;
      pageUser(this.query.form).then(res => {
        this.tableData = res.list;
        this.pageTotal = res.total;
        this.multipleSelection = [];
        this.loading = false;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.query.form.pageNum = 1;
      this.getData();
    },
    addInfo() {
      this.saveDialog.title = '新增';
      this.saveDialog.type = 'add';
      this.saveDialog.form = {isSysAdmin: 'N', status: 'incumbent'};
      this.saveDialog.visible = true;
    },
    updateInfo() {
      if (this.multipleSelection.length !== 1) {
        this.$message.error('仅请选择一条数据');
        return;
      }
      this.saveDialog.title = '修改';
      this.saveDialog.type = 'update';
      getUser(this.multipleSelection[0].username).then(res => {
        this.saveDialog.form = res;
      });
      this.saveDialog.visible = true;
    },
    saveInfo() {
      this.$refs['saveDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        saveUser(this.saveDialog.type, this.saveDialog.form).then(res => {
          if (res > 0) {
            this.saveDialog.visible = false;
            this.saveDialog.form = {};
            this.$message.success('保存成功');
            this.getData();
          } else {
            this.$message.error('保存失败');
          }
        });
      });
    },
    patchUserStatus() {
      if (this.multipleSelection.length === 0) {
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
      if (this.multipleSelection.length === 0) {
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
    delInfo() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('至少选择一条数据');
        return;
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
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
</style>
