<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="6">
              <el-form-item label="圈舍编号" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmZoneCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="耳牌号" :label-width="formLabelWidth">
                <el-input v-model="query.form.cattleCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牛只名称" :label-width="formLabelWidth">
                <el-input v-model="query.form.cattleName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="品种" :label-width="formLabelWidth">
                <el-select v-model="query.form.breed" filterable placeholder="请选择" style="width:100%">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option
                      v-for="item in cattleBreedList"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="6">
              <el-form-item label="性别" :label-width="formLabelWidth">
                <el-select v-model="query.form.sex" filterable placeholder="请选择" style="width:100%">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="公" value="公"></el-option>
                  <el-option label="母" value="母"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="颜色" :label-width="formLabelWidth">
                <el-input v-model="query.form.color" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.birthday"
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
            <el-col :span="6">
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="query.form.remark" placeholder="请输入"></el-input>
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
          <import-export :template-code="'cattle'" :params="queryParams" :hasImport="power.insert"></import-export>
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
        <el-table-column prop="farmName" label="牧场名称"></el-table-column>
        <el-table-column prop="farmOwner" label="牧场负责人"></el-table-column>
        <el-table-column prop="farmZoneCode" label="圈舍编号"></el-table-column>
        <el-table-column prop="cattleCode" label="耳牌号"></el-table-column>
        <el-table-column prop="cattleName" label="牛只名称"></el-table-column>
        <el-table-column prop="breedValue" label="品种"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="color" label="颜色"></el-table-column>
        <el-table-column prop="birthday" label="出生日期"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
        <el-table-column prop="updateUser" label="修改人"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
                v-if="power.update"
                type="primary"
                icon="el-icon-edit"
                @click="updateInfo(scope.row.cattleCode)"
            >编辑
            </el-button>
            <el-button
                v-if="power.delete"
                type="danger"
                icon="el-icon-delete"
                class="red"
                @click="delInfo(scope.row.cattleCode)"
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
        <el-form-item label="圈舍编号" :label-width="formLabelWidth" prop="farmZoneCode">
          <el-select v-model="saveDialog.form.farmZoneCode" filterable placeholder="请选择" style="width:100%" :disabled="saveDialog.type === 'update'">
            <el-option
                v-for="item in listFarmZone"
                :key="item.farmZoneCode"
                :label="item.farmZoneCode"
                :value="item.farmZoneCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="耳牌号" :label-width="formLabelWidth" prop="cattleCode">
          <el-input v-model="saveDialog.form.cattleCode" placeholder="请输入" :disabled="saveDialog.type === 'update'"></el-input>
        </el-form-item>
        <el-form-item label="牛只名称" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.cattleName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="品种" :label-width="formLabelWidth" prop="breed">
          <el-select v-model="saveDialog.form.breed" style="width:100%" placeholder="请选择">
            <el-option v-for="item in cattleBreedList"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="saveDialog.form.sex" style="width:100%" placeholder="请选择">
            <el-option label="公" value="公"></el-option>
            <el-option label="母" value="母"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.color" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth" prop="birthday">
          <el-date-picker
              v-model="saveDialog.form.birthday"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.remark" placeholder="请输入"></el-input>
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
import {getPageActionPower} from '@/components/common/base'
import ImportExport from "@/components/common/ImportExport";
import {listSysConfig} from "@/api/sys";
import {listFarmZone} from '@/api/farm';
import {pageCattle, getCattle, saveCattle, delCattle} from '@/api/cattle';

export default {
  name: 'CattleInfoManage',
  components: {
    ImportExport
  },
  data() {
    return {
      power:{
        insert:false,
        update:false,
        delete:false
      },
      listFarmZone: [],
      cattleBreedList: [],
      query: {
        form: {
          farmName: '',
          farmZoneCode: '',
          cattleCode: '',
          cattleName: '',
          breed: '',
          sex: '',
          birthday: '',
          remark: '',
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
          farmZoneCode: [{required: true, message: '圈舍编号不能为空', trigger: 'change'}],
          cattleCode: [{required: true, message: '耳牌号不能为空', trigger: 'change'}],
          breed: [{required: true, message: '品种不能为空', trigger: 'change'}],
          sex: [{required: true, message: '性别不能为空', trigger: 'change'}],
          birthday: [{required: true, message: '出生日期不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    this.power = getPageActionPower('cattleInfoManage');
    listFarmZone(this.$store.state.user.currentFarmCode).then(res => this.listFarmZone = res);
    listSysConfig('cattleBreed').then(res => this.cattleBreedList = res);
    this.getData();
  },
  computed: {
    queryParams() {
      let params = {...this.query.form};
      if (params.birthday && params.birthday.length) {
        params.birthdayStart = params.birthday[0];
        params.birthdayEnd = params.birthday[1];
        params.birthday = undefined;
      }
      params.farmCode = this.$store.state.user.currentFarmCode;
      return params;
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
      pageCattle(this.queryParams).then(res => {
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
    updateInfo(cattleCode) {
      getCattle(cattleCode).then(res => {
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
        saveCattle(this.saveDialog.type, this.saveDialog.form).then(res => {
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
    delInfo(cattleCode) {
      this.delInfoFunc([cattleCode]);
    },
    batchDelInfo() {
      this.delInfoFunc(this.multipleSelection.map(item => item.cattleCode));
    },
    delInfoFunc(cattleCodeList) {
      if (cattleCodeList.length === 0) {
        this.$message.error('至少选择一条数据');
        return;
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCattle(cattleCodeList).then(res => {
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
