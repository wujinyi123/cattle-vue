<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="6">
              <el-form-item label="账号" :label-width="formLabelWidth">
                <el-input v-model="query.form.username" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                <el-input v-model="query.form.name" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否系统管理员" :label-width="formLabelWidth">
                <el-select v-model="query.form.isSysAdmin" style="width:100%" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="Y" value="Y"></el-option>
                  <el-option label="N" value="N"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别" :label-width="formLabelWidth">
                <el-select v-model="query.form.sex" style="width:100%" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="6">
              <el-form-item label="岗位" :label-width="formLabelWidth">
                <el-select v-model="query.form.jobCode" style="width:100%" placeholder="请选择">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option v-for="item in listSysJob"
                             :key="item.jobCode"
                             :label="item.jobName"
                             :value="item.jobCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所在牧场" :label-width="formLabelWidth">
                <el-select v-model="query.form.farmCode" style="width:100%" placeholder="请选择">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option v-for="item in listFarm"
                             :key="item.farmCode"
                             :label="item.farmName"
                             :value="item.farmCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系方式" :label-width="formLabelWidth">
                <el-input v-model="query.form.phone" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="过期时间" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.expireDate"
                    type="daterange"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width:100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="24" style="text-align:right">
              <el-button icon="el-icon-refresh" @click="query.form={}">重置</el-button>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <template v-if="$store.state.user.userInfo.isSysAdmin==='Y'">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addInfo">添加</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="batchDelInfo">批量删除</el-button>
          </template>
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
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="isSysAdmin" label="是否系统管理员"></el-table-column>
        <el-table-column prop="jobName" label="岗位"></el-table-column>
        <el-table-column prop="farmName" label="所在牧场"></el-table-column>
        <el-table-column prop="farmPowerName" label="数据权限"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column prop="expireDate" label="过期时间"></el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
        <el-table-column prop="updateUser" label="修改人"></el-table-column>
        <el-table-column label="操作" width="200" align="center" v-if="$store.state.user.userInfo.isSysAdmin==='Y'">
          <template slot-scope="scope">
            <el-button
                type="primary"
                icon="el-icon-edit"
                @click="updateInfo(scope.row.username)"
            >编辑
            </el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                class="red"
                @click="delInfo(scope.row.username)"
            >删除
            </el-button>
            <el-button
                icon="el-icon-refresh"
                @click="reloadPassword(scope.row.username)"
            >重置密码
            </el-button>
          </template>
        </el-table-column>
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
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password" v-if="this.saveDialog.type === 'add'">
          <el-input type="password" v-model="saveDialog.form.password" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" :label-width="formLabelWidth" prop="rePassword" v-if="this.saveDialog.type === 'add'">
          <el-input type="password" v-model="saveDialog.form.rePassword" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="saveDialog.form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="saveDialog.form.sex" style="width:100%" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否系统管理员" :label-width="formLabelWidth" prop="isSysAdmin">
          <el-select v-model="saveDialog.form.isSysAdmin" style="width:100%" placeholder="请选择">
            <el-option label="Y" value="Y"></el-option>
            <el-option label="N" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" :label-width="formLabelWidth" prop="jobCode">
          <el-select v-model="saveDialog.form.jobCode" style="width:100%" placeholder="请选择">
            <el-option v-for="item in listSysJob"
                       :key="item.jobCode"
                       :label="item.jobName"
                       :value="item.jobCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在牧场" :label-width="formLabelWidth">
          <el-select v-model="saveDialog.form.farmCode" style="width:100%" placeholder="请选择">
            <el-option v-for="item in listFarm"
                       :key="item.farmCode"
                       :label="item.farmName"
                       :value="item.farmCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" :label-width="formLabelWidth">
          <el-select multiple v-model="saveDialog.form.farmPower" style="width:100%" placeholder="请选择">
            <el-option v-for="item in listFarm"
                       :key="item.farmCode"
                       :label="item.farmName"
                       :value="item.farmCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="saveDialog.form.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="过期时间" :label-width="formLabelWidth" prop="expireDate">
          <el-date-picker
              v-model="saveDialog.form.expireDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width:100%">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImportExport from "@/components/common/ImportExport";
import {listSysJob} from "@/api/sys";
import {listFarm} from '@/api/farm'
import {pageUser, getUser, saveUser, delUser, reloadPassword} from '@/api/user';

export default {
  name: 'EmployeeInfoManage',
  components: {
    ImportExport
  },
  data() {
    return {
      listSysJob:[],
      listFarm: [],
      query: {
        form: {
          pageNum: 1,
          pageSize: 10
        }
      },
      tableData: [],
      loading: false,
      multipleSelection: [],
      pageTotal: 0,
      formLabelWidth: '150px',
      saveDialog: {
        title: '',
        type: 'add',
        visible: false,
        form: {},
        rules: {
          username: [{required: true, message: '账号不能为空', trigger: 'change'}],
          password: [{required: true, message: '密码不能为空', trigger: 'change'}],
          rePassword: [{required: true, message: '再次输入密码不能为空', trigger: 'change'}],
          name: [{required: true, message: '姓名不能为空', trigger: 'change'}],
          sex: [{required: true, message: '性别不能为空', trigger: 'change'}],
          isSysAdmin: [{required: true, message: '是否系统管理员不能为空', trigger: 'change'}],
          jobCode: [{required: true, message: '岗位不能为空', trigger: 'change'}],
          phone: [{required: true, message: '联系方式不能为空', trigger: 'change'}],
          expireDate: [{required: true, message: '过期时间不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    listSysJob().then(res => this.listSysJob = res);
    listFarm({}).then(res => this.listFarm = res);
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
      this.saveDialog.form = {};
      this.saveDialog.visible = true;
    },
    updateInfo(username) {
      getUser(username).then(res => {
        this.saveDialog.form = res;
      });
      this.saveDialog.title = '修改';
      this.saveDialog.type = 'update';
      this.saveDialog.visible = true;
    },
    saveInfo() {
      this.$refs['saveDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        let data = {...this.saveDialog.form};
        if (this.saveDialog.type === 'add') {
          if (data.password !== data.rePassword) {
            this.$message.error('两次密码不一致');
            return false;
          }
          delete data['rePassword'];
        }
        data.farmPower = data.farmPower && data.farmPower.join(',');
        saveUser(this.saveDialog.type, data).then(res => {
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
    delInfo(username) {
      this.delInfoFunc([username]);
    },
    batchDelInfo() {
      this.delInfoFunc(this.multipleSelection.map(item => item.username));
    },
    delInfoFunc(usernameList) {
      if (usernameList.length === 0) {
        this.$message.error('至少选择一条数据');
        return;
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser(usernameList).then(res => {
          if (res > 0) {
            this.$message.success('删除成功');
            this.getData();
          } else {
            this.$message.error('删除失败');
          }
        });
      });
    },
    reloadPassword(username) {
      this.$confirm('此操作将重置密码为：123456, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reloadPassword(username).then(res => {
          if (res > 0) {
            this.$message.success('重置成功，请联系用户尽快到个人中心修改密码');
            this.getData();
          } else {
            this.$message.error('重置失败');
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
