<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="牧场代码" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="牧场名称" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地址" :label-width="formLabelWidth">
                <el-input v-model="query.form.address" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
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
        <el-table-column prop="farmCode" label="牧场代码"></el-table-column>
        <el-table-column prop="farmName" label="牧场名称"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="area" label="面积"></el-table-column>
        <el-table-column prop="scale" label="养殖规模"></el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
        <el-table-column prop="updateUser" label="修改人"></el-table-column>
        <el-table-column label="操作" width="200" align="center" v-if="$store.state.user.userInfo.isSysAdmin==='Y'">
          <template slot-scope="scope">
            <el-button
                type="primary"
                icon="el-icon-edit"
                @click="updateInfo(scope.row.farmCode)"
            >编辑
            </el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                class="red"
                @click="delInfo(scope.row.farmCode)"
            >删除
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
        <el-form-item label="牧场代码" :label-width="formLabelWidth" prop="farmCode">
          <el-input v-model="saveDialog.form.farmCode" placeholder="请输入" :disabled="saveDialog.type === 'update'"></el-input>
        </el-form-item>
        <el-form-item label="牧场名称" :label-width="formLabelWidth" prop="farmName">
          <el-input v-model="saveDialog.form.farmName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="saveDialog.form.address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="面积" :label-width="formLabelWidth" prop="area">
          <el-input v-model="saveDialog.form.area" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="养殖规模" :label-width="formLabelWidth" prop="scale">
          <el-input v-model="saveDialog.form.scale" placeholder="请输入"></el-input>
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
import {pageFarm, getFarm, saveFarm, delFarm} from '@/api/farm';

export default {
  name: 'FarmInfoManage',
  data() {
    return {
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
      formLabelWidth: '100px',
      saveDialog: {
        title: '',
        type: 'add',
        visible: false,
        form: {},
        rules: {
          farmCode: [{required: true, message: '牧场代码不能为空', trigger: 'change'}],
          farmName: [{required: true, message: '牧场名称不能为空', trigger: 'change'}],
          address: [{required: true, message: '地址不能为空', trigger: 'change'}],
          area: [{required: true, message: '面积不能为空', trigger: 'change'}],
          scale: [{required: true, message: '养殖规模不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
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
      pageFarm(this.query.form).then(res => {
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
    updateInfo(farmCode) {
      getFarm(farmCode).then(res => {
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
        saveFarm(this.saveDialog.type, this.saveDialog.form).then(res => {
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
    delInfo(farmCode) {
      this.delInfoFunc([farmCode]);
    },
    batchDelInfo() {
      this.delInfoFunc(this.multipleSelection.map(item => item.farmCode));
    },
    delInfoFunc(farmCodeList) {
      if (farmCodeList.length === 0) {
        this.$message.error('至少选择一条数据');
        return;
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFarm(farmCodeList).then(res => {
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
