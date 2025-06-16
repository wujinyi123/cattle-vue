<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="负责人" :label-width="formLabelWidth">
                <el-input v-model="query.form.owner" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="管理员" :label-width="formLabelWidth">
                <el-input v-model="query.form.admin" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="地址" :label-width="formLabelWidth">
                <el-input v-model="query.form.address" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="面积" :label-width="formLabelWidth">
                <el-input v-model="query.form.area" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="养殖规模" :label-width="formLabelWidth">
                <el-input v-model="query.form.scale" autocomplete="off"></el-input>
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
          <el-input v-model="saveDialog.form.farmName" :disabled="saveDialog.type=='update'" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="负责人" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.owner" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.admin" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.employee" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="面积" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.area" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="养殖规模" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.scale" autocomplete="off"></el-input>
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

export default {
  name: 'farmInfoManage',
  data() {
    return {
      isSysAdmin: 'N',
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
        form: {
          farmId: '',
          farmName: '',
          owner: '',
          admin: '',
          employee: '',
          address: '',
          area: '',
          scale: ''
        }
      }
    };
  },
  created() {
    this.isSysAdmin = currentUser.getIsSysAdmin();
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
      this.saveDialog.form.farmId = '';
      this.saveDialog.form.farmName = '';
      this.saveDialog.form.owner = '';
      this.saveDialog.form.admin = '';
      this.saveDialog.form.employee = '';
      this.saveDialog.form.address = '';
      this.saveDialog.form.area = '';
      this.saveDialog.form.scale = '';
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
        this.saveDialog.form.farmId = res.farmId;
        this.saveDialog.form.farmName = res.farmName;
        this.saveDialog.form.owner = res.owner;
        this.saveDialog.form.admin = res.admin;
        this.saveDialog.form.employee = res.employee;
        this.saveDialog.form.address = res.address;
        this.saveDialog.form.area = res.area;
        this.saveDialog.form.scale = res.scale;
      });
      this.saveDialog.visible = true;
    },
    saveFarm() {
      saveFarm(this.saveDialog.type, this.saveDialog.form).then(res => {
        if (res > 0) {
          this.saveDialog.visible = false;
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
