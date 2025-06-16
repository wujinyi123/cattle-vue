<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="负责人" :label-width="formLabelWidth">
                <el-input v-model="query.form.owner" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="管理员" :label-width="formLabelWidth">
                <el-input v-model="query.form.admin" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="地址" :label-width="formLabelWidth">
                <el-input v-model="query.form.address" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="面积" :label-width="formLabelWidth">
                <el-input v-model="query.form.area" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="养殖规模" :label-width="formLabelWidth">
                <el-input v-model="query.form.scale" placeholder="请输入"></el-input>
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
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addFarm">添加</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="updateFarm">修改</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="delFarm">批量删除</el-button>
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
        <el-table-column prop="farmName" label="名称"></el-table-column>
        <el-table-column prop="owner" label="负责人"></el-table-column>
        <el-table-column prop="admin" label="管理员"></el-table-column>
        <el-table-column prop="employee" label="员工"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="area" label="面积"></el-table-column>
        <el-table-column prop="scale" label="养殖规模"></el-table-column>
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
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.farmName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="负责人" :label-width="formLabelWidth">
          <el-select v-model="saveDialog.form.owner" filterable placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in listUser"
                :key="item.username"
                :label="item.title"
                :value="item.username">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员" :label-width="formLabelWidth">
          <el-select v-model="saveDialog.form.admin" filterable multiple placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in listUser"
                :key="item.username"
                :label="item.title"
                :value="item.username">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工" :label-width="formLabelWidth">
          <el-select v-model="saveDialog.form.employee" filterable multiple placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in listUser"
                :key="item.username"
                :label="item.title"
                :value="item.username">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="面积" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.area" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="养殖规模" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.scale" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveFarm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import currentUser from "@/utils/currentUser";
import {pageFarm, getFarm, saveFarm, delFarm} from '@/api/farm';
import {listUser} from '@/api/user';

export default {
  name: 'farmInfoManage',
  data() {
    return {
      isSysAdmin: 'N',
      listUser: [],
      query: {
        form: {
          farmName: '',
          owner: '',
          admin: '',
          address: '',
          area: '',
          scale: '',
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
        form: {}
      }
    };
  },
  created() {
    this.isSysAdmin = currentUser.getIsSysAdmin();
    listUser().then(res => this.listUser = res);
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
      pageFarm(this.query.form).then(res => {
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
    addFarm() {
      this.saveDialog.title = '新增';
      this.saveDialog.type = 'add';
      this.saveDialog.form = {};
      this.saveDialog.visible = true;
    },
    updateFarm() {
      if (this.multipleSelection.length != 1) {
        this.$message.error('仅请选择一条数据');
        return;
      }
      this.saveDialog.title = '修改';
      this.saveDialog.type = 'update';
      getFarm(this.multipleSelection[0].farmId).then(res => {
        res.admin = res.admin && res.admin.split(',');
        res.employee = res.employee && res.employee.split(',');
        this.saveDialog.form = res;
      });
      this.saveDialog.visible = true;
    },
    saveFarm() {
      let data = {...this.saveDialog.form};
      data.admin = data.admin && data.admin.join(',');
      data.employee = data.employee && data.employee.join(',');
      saveFarm(this.saveDialog.type, data).then(res => {
        if (res > 0) {
          this.saveDialog.visible = false;
          this.saveDialog.form = {};
          this.$message.success('保存成功');
          this.getData();
        } else {
          this.$message.error('保存失败');
        }
      });
    },
    delFarm() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('至少选择一条数据');
        return;
      }
      this.$confirm('此操作将永久删除牧场, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFarm(this.multipleSelection.map(item => item.farmId)).then(res => {
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
