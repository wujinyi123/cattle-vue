<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="牧场" :label-width="formLabelWidth">
                <el-select v-model="query.form.farmId" filterable placeholder="请选择" style="width:100%">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option
                      v-for="item in listFarm"
                      :key="item.farmId"
                      :label="item.farmName"
                      :value="item.farmId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="圈舍编号" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmZoneCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="圈舍备注" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmZoneRemark" placeholder="请输入"></el-input>
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
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addInfo">添加</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="updateInfo">修改</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="delInfo">批量删除</el-button>
          <import-export :template-code="'farmZone'" :params="query.form"></import-export>
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
        <el-table-column prop="farmName" label="牧场"></el-table-column>
        <el-table-column prop="farmOwner" label="牧场负责人"></el-table-column>
        <el-table-column prop="farmAdmin" label="牧场管理员"></el-table-column>
        <el-table-column prop="farmZoneCode" label="圈舍编号"></el-table-column>
        <el-table-column prop="farmZoneRemark" label="圈舍备注"></el-table-column>
        <el-table-column prop="size" label="容量"></el-table-column>
        <el-table-column prop="currentSize" label="当前容量"></el-table-column>
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
        <el-form-item label="牧场" :label-width="formLabelWidth" prop="farmId">
          <el-select v-model="saveDialog.form.farmId" filterable placeholder="请选择" style="width:100%" :disabled="saveDialog.type === 'update'">
            <el-option
                v-for="item in listFarm"
                :key="item.farmId"
                :label="item.farmName"
                :value="item.farmId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="圈舍编号" :label-width="formLabelWidth" prop="farmZoneCode">
          <el-input v-model="saveDialog.form.farmZoneCode" placeholder="请输入" :disabled="saveDialog.type === 'update'"></el-input>
        </el-form-item>
        <el-form-item label="圈舍备注" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.farmZoneRemark" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="容量" :label-width="formLabelWidth" prop="size">
          <el-input-number v-model="saveDialog.form.size" :min="1" :max="99999"></el-input-number>
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
import {listFarm, pageFarmZone, getFarmZone, saveFarmZone, delFarmZone} from '@/api/farm';

export default {
  name: 'FarmZoneManage',
  components: {
    ImportExport
  },
  data() {
    return {
      listFarm: [],
      query: {
        form: {
          farmId: '',
          farmZoneCode: '',
          farmZoneRemark: '',
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
          farmId: [{required: true, message: '牧场不能为空', trigger: 'change'}],
          farmZoneCode: [{required: true, message: '圈舍编号不能为空', trigger: 'change'}],
          size: [{required: true, message: '容量不能为空', trigger: 'blur'}]
        }
      }
    };
  },
  created() {
    listFarm().then(res => this.listFarm = res);
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
      pageFarmZone(this.query.form).then(res => {
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
    updateInfo() {
      if (this.multipleSelection.length !== 1) {
        this.$message.error('仅请选择一条数据');
        return;
      }
      this.saveDialog.title = '修改';
      this.saveDialog.type = 'update';
      getFarmZone(this.multipleSelection[0].farmZoneCode).then(res => {
        this.saveDialog.form = res;
      });
      this.saveDialog.visible = true;
    },
    saveInfo() {
      this.$refs['saveDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        saveFarmZone(this.saveDialog.type, this.saveDialog.form).then(res => {
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
        delFarmZone(this.multipleSelection.map(item => item.farmZoneCode)).then(res => {
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
