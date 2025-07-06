<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="牧场" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="圈舍" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmZoneCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="牛只耳牌号" :label-width="formLabelWidth">
                <el-input v-model="query.form.cattleCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="登记号" :label-width="formLabelWidth">
                <el-input v-model="query.form.registerId" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检查日期" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.checkDay"
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
            <el-col :span="8">
              <el-form-item label="检查员" :label-width="formLabelWidth">
                <el-input v-model="query.form.checkUser" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="检查结果" :label-width="formLabelWidth">
                <el-input v-model="query.form.result" placeholder="请输入"></el-input>
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
          <el-button type="primary" icon="el-icon-delete" @click="delInfo">批量删除</el-button>
          <import-export :template-code="'breedPregnancyCheck'" :params="query.form" :hasImport="false"></import-export>
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
        <el-table-column prop="registerId" label="登记号"></el-table-column>
        <el-table-column prop="farmName" label="牧场"></el-table-column>
        <el-table-column prop="farmZoneCode" label="圈舍编号"></el-table-column>
        <el-table-column label="牛只耳牌号">
          <template slot-scope="scope">
            <cattle-info :cattle-code="scope.row.cattleCode"/>
          </template>
        </el-table-column>
        <el-table-column prop="checkDay" label="检查日期"></el-table-column>
        <el-table-column label="检查员">
          <template slot-scope="scope">
            <user-info :username="scope.row.checkUser"/>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="检查结果"></el-table-column>
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
    <el-dialog :destroy-on-close="true" title="新增" :visible.sync="saveDialog.visible">
      <el-form :model="saveDialog.form" ref="saveDialog.form" :rules="saveDialog.rules">
        <el-form-item label="登记号" :label-width="formLabelWidth" prop="registerId">
          <el-input v-model="saveDialog.form.registerId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="检查日期" :label-width="formLabelWidth" prop="checkDay">
          <el-date-picker
              v-model="saveDialog.form.checkDay"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查员" :label-width="formLabelWidth" prop="checkUser">
          <el-select v-model="saveDialog.form.checkUser" filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listUser"
                       :key="item.username"
                       :label="item.name"
                       :value="item.username">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查结果" :label-width="formLabelWidth" prop="result">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.result" placeholder="请输入"></el-input>
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
import UserInfo from "@/components/common/UserInfo";
import CattleInfo from "@/components/common/CattleInfo";
import {pageBreedPregnancyCheck, addBreedPregnancyCheck, delBreedPregnancyCheck} from '@/api/breed';
import {listUser} from '@/api/user';

export default {
  name: 'BreedPregnancyCheck',
  components: {
    ImportExport,
    UserInfo,
    CattleInfo
  },
  data() {
    return {
      listUser: [],
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
        visible: false,
        form: {},
        rules: {
          registerId: [{required: true, message: '登记号不能为空', trigger: 'change'}],
          checkDay: [{required: true, message: '检查日期不能为空', trigger: 'change'}],
          checkUser: [{required: true, message: '检查员不能为空', trigger: 'change'}],
          result: [{required: true, message: '检查结果不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    listUser().then(res => this.listUser = res);
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
      let params = {...this.query.form};
      if (params.checkDay && params.checkDay.length) {
        params.checkDayStart = params.checkDay[0];
        params.checkDayEnd = params.checkDay[1];
        params.checkDay = undefined;
      }
      pageBreedPregnancyCheck(params).then(res => {
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
      this.saveDialog.form = {};
      this.saveDialog.visible = true;
    },
    saveInfo() {
      this.$refs['saveDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        addBreedPregnancyCheck(this.saveDialog.form).then(res => {
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
      this.$confirm('此操作将永久删除牧场, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBreedPregnancyCheck(this.multipleSelection.map(item => item.id)).then(res => {
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
