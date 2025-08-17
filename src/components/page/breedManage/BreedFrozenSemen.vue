<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="冻精号" :label-width="formLabelWidth">
                <el-input v-model="query.form.frozenSemenCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="冻精品种" :label-width="formLabelWidth">
                <el-select v-model="query.form.frozenSemenBreed" style="width:100%" placeholder="请选择">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option v-for="item in listBreed"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性控类型" :label-width="formLabelWidth">
                <el-select v-model="query.form.sexControl" style="width:100%" placeholder="请选择">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option key="普通" label="普通" value="普通"></el-option>
                  <el-option key="性控" label="性控" value="性控"></el-option>
                  <el-option key="超级性控" label="超级性控" value="超级性控"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="颜色" :label-width="formLabelWidth">
                <el-input v-model="query.form.color" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="父亲耳牌号" :label-width="formLabelWidth">
                <el-input v-model="query.form.fatherCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="母亲耳牌号" :label-width="formLabelWidth">
                <el-input v-model="query.form.motherCode" placeholder="请输入"></el-input>
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
          <el-button v-if="power.insert" type="primary" icon="el-icon-circle-plus-outline" @click="addInfo">添加</el-button>
          <el-button v-if="power.delete" type="primary" icon="el-icon-delete" @click="batchDelInfo">批量删除</el-button>
          <import-export :template-code="'breedFrozenSemen'" :params="queryParams" :hasImport="power.insert"></import-export>
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
        <el-table-column prop="frozenSemenCode" label="冻精号"></el-table-column>
        <el-table-column prop="frozenSemenBreedValue" label="冻精品种"></el-table-column>
        <el-table-column prop="sexControl" label="性控类型"></el-table-column>
        <el-table-column prop="color" label="颜色"></el-table-column>
        <el-table-column prop="fatherCode" label="父亲耳牌号"></el-table-column>
        <el-table-column prop="motherCode" label="母亲耳牌号"></el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
        <el-table-column prop="updateUser" label="修改人"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
                v-if="power.update"
                type="primary"
                icon="el-icon-edit"
                @click="updateInfo(scope.row.frozenSemenCode)"
            >编辑
            </el-button>
            <el-button
                v-if="power.delete"
                type="danger"
                icon="el-icon-delete"
                class="red"
                @click="delInfo(scope.row.id)"
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
        <el-form-item label="冻精号" :label-width="formLabelWidth" prop="frozenSemenCode">
          <el-input v-model="saveDialog.form.frozenSemenCode" placeholder="请输入" :disabled="saveDialog.type === 'update'"></el-input>
        </el-form-item>
        <el-form-item label="冻精品种" :label-width="formLabelWidth" prop="frozenSemenBreed">
          <el-select v-model="saveDialog.form.frozenSemenBreed" style="width:100%" placeholder="请选择">
            <el-option v-for="item in listBreed"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性控类型" :label-width="formLabelWidth" prop="sexControl">
          <el-select v-model="saveDialog.form.sexControl" style="width:100%" placeholder="请选择">
            <el-option key="普通" label="普通" value="普通"></el-option>
            <el-option key="性控" label="性控" value="性控"></el-option>
            <el-option key="超级性控" label="超级性控" value="超级性控"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.color" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="父亲耳牌号" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.fatherCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="母亲耳牌号" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.motherCode" placeholder="请输入"></el-input>
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
import moment from 'moment';
import {getPageActionPower} from '@/components/common/base'
import ImportExport from "@/components/common/ImportExport";
import {pageBreedFrozenSemen, getBreedFrozenSemen, saveBreedFrozenSemen, delBreedFrozenSemen} from '@/api/breed';
import {listSysConfig} from "@/api/sys";

export default {
  name: 'BreedFrozenSemen',
  components: {
    ImportExport
  },
  data() {
    return {
      power: {
        insert: false,
        update: false,
        delete: false
      },
      listBreed: [],
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
          frozenSemenCode: [{required: true, message: '冻精号不能为空', trigger: 'change'}],
          frozenSemenBreed: [{required: true, message: '冻精品种不能为空', trigger: 'change'}],
          sexControl: [{required: true, message: '性控类型不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    this.power = getPageActionPower('breedFrozenSemen');
    listSysConfig('cattleBreed').then(res => this.listBreed = res);
    this.getData();
  },
  computed: {
    queryParams() {
      return {...this.query.form};
    },
    planDay() {
      if (!this.saveDialog.form.breedingDay) {
        return {};
      }
      let breedingDay = new Date(this.saveDialog.form.breedingDay);
      let firstCheckDay = moment(breedingDay).add(60, 'days').format('YYYY-MM-DD');
      let reCheckDay = moment(breedingDay).add(90, 'days').format('YYYY-MM-DD');
      let expectedDay = moment(breedingDay).add(270, 'days').format('YYYY-MM-DD');
      return {firstCheckDay, reCheckDay, expectedDay};
    }
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
      if (!this.$store.state.user.currentFarmCode) {
        this.$message.error("请在页面右上角先选择牧场权限");
        this.tableData = [];
        this.pageTotal = 0;
        this.multipleSelection = [];
        return;
      }
      this.loading = true;
      pageBreedFrozenSemen(this.queryParams).then(res => {
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
    updateInfo(frozenSemenCode) {
      getBreedFrozenSemen(frozenSemenCode).then(res => {
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
        saveBreedFrozenSemen(this.saveDialog.type, this.saveDialog.form).then(res => {
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
    delInfo(id) {
      this.delInfoFunc([id]);
    },
    batchDelInfo() {
      this.delInfoFunc(this.multipleSelection.map(item => item.id));
    },
    delInfoFunc(ids) {
      if (ids.length === 0) {
        this.$message.error('至少选择一条数据');
        return;
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBreedFrozenSemen(ids).then(res => {
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
