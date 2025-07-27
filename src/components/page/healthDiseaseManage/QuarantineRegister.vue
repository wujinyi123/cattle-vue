<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="圈舍编号" :label-width="formLabelWidth">
                <el-select v-model="query.form.farmZoneCode" filterable style="width:100%" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in listFarmZone"
                             :key="item.farmZoneCode"
                             :label="item.farmZoneCode"
                             :value="item.farmZoneCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="牛只耳牌号" :label-width="formLabelWidth">
                <el-input v-model="query.form.cattleCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="登记日期" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.registerDay"
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
            <el-col :span="8">
              <el-form-item label="检疫类型" :label-width="formLabelWidth">
                <el-select v-model="query.form.quarantineType" filterable style="width:100%" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in listQuarantineType"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检疫方式" :label-width="formLabelWidth">
                <el-select v-model="query.form.quarantineMethod" filterable style="width:100%" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in listQuarantineMethod"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检疫结果" :label-width="formLabelWidth">
                <el-select v-model="query.form.quarantineResult" filterable style="width:100%" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="阴性" value="阴性"></el-option>
                  <el-option label="阳性" value="阳性"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="兽医" :label-width="formLabelWidth">
                <el-select v-model="query.form.veterinarian" filterable style="width:100%" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="item in listUser"
                             :key="item.username"
                             :label="item.title"
                             :value="item.username">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
          <el-button v-if="power.delete" type="primary" icon="el-icon-delete" @click="delInfo">批量删除</el-button>
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
        <el-table-column prop="farmZoneCode" label="圈舍编号"></el-table-column>
        <el-table-column label="牛只耳牌号">
          <template slot-scope="scope">
            <cattle-info :cattle-code="scope.row.cattleCode"/>
          </template>
        </el-table-column>
        <el-table-column prop="registerDay" label="登记日期"></el-table-column>
        <el-table-column prop="quarantineTypeValue" label="检疫类型"></el-table-column>
        <el-table-column prop="quarantineMethodValue" label="检疫方式"></el-table-column>
        <el-table-column prop="quarantineResult" label="检疫结果"></el-table-column>
        <el-table-column label="兽医">
          <template slot-scope="scope">
            <user-info :username="scope.row.veterinarian"/>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
        <el-form-item label="圈舍编号" :label-width="formLabelWidth" prop="farmZoneCode">
          <el-select v-model="saveDialog.form.farmZoneCode" @change="getCattleList" filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listFarmZone"
                       :key="item.farmZoneCode"
                       :label="item.farmZoneCode"
                       :value="item.farmZoneCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="牛只耳牌号" :label-width="formLabelWidth" prop="cattleCodeList">
          <el-select v-model="saveDialog.form.cattleCodeList" multiple filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listCattle"
                       :key="item.cattleCode"
                       :label="item.cattleCode"
                       :value="item.cattleCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登记日期" :label-width="formLabelWidth" prop="registerDay">
          <el-date-picker
              v-model="saveDialog.form.registerDay"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检疫类型" :label-width="formLabelWidth" prop="quarantineType">
          <el-select v-model="saveDialog.form.quarantineType" filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listQuarantineType"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检疫方式" :label-width="formLabelWidth" prop="quarantineMethod">
          <el-select v-model="saveDialog.form.quarantineMethod" filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listQuarantineMethod"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检疫结果" :label-width="formLabelWidth" prop="quarantineResult">
          <el-select v-model="saveDialog.form.quarantineResult" filterable style="width:100%" placeholder="请选择">
            <el-option label="阴性" value="阴性"></el-option>
            <el-option label="阳性" value="阳性"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兽医" :label-width="formLabelWidth" prop="veterinarian">
          <el-select v-model="saveDialog.form.veterinarian" filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listUser"
                       :key="item.username"
                       :label="item.title"
                       :value="item.username">
            </el-option>
          </el-select>
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
import UserInfo from "@/components/common/UserInfo";
import CattleInfo from "@/components/common/CattleInfo";
import {listSysConfig} from "@/api/sys";
import {pageQuarantineRegister, addQuarantineRegister, delQuarantineRegister} from '@/api/healthDisease';
import {listUser} from '@/api/user';
import {listFarmZone} from "@/api/farm";
import {listCattle} from "@/api/cattle";

export default {
  name: 'QuarantineRegister',
  components: {
    ImportExport,
    UserInfo,
    CattleInfo
  },
  data() {
    return {
      power: {
        insert: false,
        update: false,
        delete: false
      },
      listUser: [],
      listFarmZone: [],
      listCattle: [],
      listQuarantineType: [],
      listQuarantineMethod: [],
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
          farmZoneCode: [{required: true, message: '圈舍编号不能为空', trigger: 'change'}],
          cattleCodeList: [{required: true, message: '牛只耳牌号不能为空', trigger: 'change'}],
          registerDay: [{required: true, message: '登记日期不能为空', trigger: 'change'}],
          quarantineType: [{required: true, message: '检疫类型不能为空', trigger: 'change'}],
          quarantineMethod: [{required: true, message: '检疫方式不能为空', trigger: 'change'}],
          quarantineResult: [{required: true, message: '检疫结果不能为空', trigger: 'change'}],
          veterinarian: [{required: true, message: '兽医不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    this.power = getPageActionPower('quarantineRegister');
    listSysConfig('quarantineType').then(res => this.listQuarantineType = res);
    listSysConfig('quarantineMethod').then(res => this.listQuarantineMethod = res);
    listUser().then(res => this.listUser = res);
    listFarmZone({farmCode: this.$store.state.user.currentFarmCode}).then(res => this.listFarmZone = res);
    this.getData();
  },
  computed: {
    queryParams() {
      let params = {...this.query.form};
      if (params.registerDay && params.registerDay.length) {
        params.registerDayStart = params.registerDay[0];
        params.registerDayEnd = params.registerDay[1];
        params.registerDay = undefined;
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
      pageQuarantineRegister(this.queryParams).then(res => {
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
      this.listCattle = [];
      this.saveDialog.form = {};
      this.saveDialog.visible = true;
    },
    getCattleList() {
      let farmZoneCode = this.saveDialog.form.farmZoneCode;
      if (!farmZoneCode) {
        this.listCattle = [];
      } else {
        listCattle({farmZoneCode}).then(res => this.listCattle = res);
      }
    },
    saveInfo() {
      this.$refs['saveDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        let data = {...this.saveDialog.form};
        data.farmCode = this.$store.state.user.currentFarmCode;
        addQuarantineRegister(data).then(res => {
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
        delQuarantineRegister(this.multipleSelection.map(item => item.id)).then(res => {
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
