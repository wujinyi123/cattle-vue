<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="圈舍编号" :label-width="formLabelWidth">
                <el-select v-model="query.form.farmZoneCode" style="width:100%" placeholder="请选择">
                  <el-option key="all" label="全部" value=""></el-option>
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
          </el-row>
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
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="配种日期" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.breedingDay"
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
              <el-form-item label="配种方式" :label-width="formLabelWidth">
                <el-select v-model="query.form.breedingMethod" style="width:100%" placeholder="请选择">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option v-for="item in listMethod"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="输配员" :label-width="formLabelWidth">
                <el-input v-model="query.form.operateUser" placeholder="请输入"></el-input>
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
          <el-button type="primary" icon="el-icon-download" @click="downloadRegisterCattle(60)">导出配种超过60天的牛只</el-button>
          <el-button type="primary" icon="el-icon-download" @click="downloadRegisterCattle(90)">导出配种超过90天的牛只</el-button>
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
        <el-table-column prop="farmZoneCode" label="圈舍编号"></el-table-column>
        <el-table-column label="牛只耳牌号">
          <template slot-scope="scope">
            <cattle-info :cattle-code="scope.row.cattleCode"/>
          </template>
        </el-table-column>
        <el-table-column prop="frozenSemenCode" label="冻精号"></el-table-column>
        <el-table-column prop="frozenSemenBreedValue" label="冻精品种"></el-table-column>
        <el-table-column prop="breedingDay" label="配种日期"></el-table-column>
        <el-table-column prop="firstCheckDay" label="计划初检日期"></el-table-column>
        <el-table-column prop="reCheckDay" label="计划复检日期"></el-table-column>
        <el-table-column prop="expectedDay" label="预产日期"></el-table-column>
        <el-table-column prop="breedingMethodValue" label="配种方式"></el-table-column>
        <el-table-column label="输配员">
          <template slot-scope="scope">
            <user-info :username="scope.row.operateUser"/>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
        <el-table-column prop="updateUser" label="修改人"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-link
                type="primary"
                :underline="false"
                @click="$router.push({ path: '/breedPregnancyCheck', query: {cattleCode:scope.row.cattleCode,breedingDay:scope.row.breedingDay,expectedDay:scope.row.expectedDay }})">
              妊检登记
            </el-link>
            <el-link
                type="primary"
                :underline="false"
                style="margin-left: 20px"
                @click="$router.push({ path: '/breedPregnancyResult', query: {cattleCode:scope.row.cattleCode,breedingDay:scope.row.breedingDay,expectedDay:scope.row.expectedDay }})">
              产犊登记
            </el-link>
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
    <el-dialog :destroy-on-close="true" title="新增" :visible.sync="saveDialog.visible">
      <el-form :model="saveDialog.form" ref="saveDialog.form" :rules="saveDialog.rules">
        <el-form-item label="耳牌号" :label-width="formLabelWidth" prop="cattleCodeList">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.cattleCodeList" placeholder="多个请用英文逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="冻精号" :label-width="formLabelWidth" prop="frozenSemenCode">
          <el-input v-model="saveDialog.form.frozenSemenCode" placeholder="请输入"></el-input>
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
        <el-form-item label="配种日期" :label-width="formLabelWidth" prop="breedingDay">
          <el-date-picker
              v-model="saveDialog.form.breedingDay"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划初检日期" :label-width="formLabelWidth">
          {{ planDay.firstCheckDay }}
        </el-form-item>
        <el-form-item label="计划复检日期" :label-width="formLabelWidth">
          {{ planDay.reCheckDay }}
        </el-form-item>
        <el-form-item label="预产日期" :label-width="formLabelWidth">
          {{ planDay.expectedDay }}
        </el-form-item>
        <el-form-item label="配种方式" :label-width="formLabelWidth" prop="breedingMethod">
          <el-select v-model="saveDialog.form.breedingMethod" style="width:100%" placeholder="请选择">
            <el-option v-for="item in listMethod"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输配员" :label-width="formLabelWidth" prop="operateUser">
          <el-select v-model="saveDialog.form.operateUser" filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listUser"
                       :key="item.username"
                       :label="item.title"
                       :value="item.username">
            </el-option>
          </el-select>
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
import UserInfo from "@/components/common/UserInfo";
import CattleInfo from "@/components/common/CattleInfo";
import {pageBreedRegister, addBreedRegister, delBreedRegister} from '@/api/breed';
import {listUser} from '@/api/user';
import {listSysConfig} from "@/api/sys";
import {listFarmZone} from "@/api/farm";

export default {
  name: 'BreedRegister',
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
      listFarmZone: [],
      listBreed: [],
      listMethod: [],
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
          cattleCodeList: [{required: true, message: '牛只耳牌号不能为空', trigger: 'change'}],
          frozenSemenCode: [{required: true, message: '冻精号不能为空', trigger: 'change'}],
          frozenSemenBreed: [{required: true, message: '冻精品种不能为空', trigger: 'change'}],
          breedingDay: [{required: true, message: '配种日期不能为空', trigger: 'change'}],
          breedingMethod: [{required: true, message: '配种日期不能为空', trigger: 'change'}],
          operateUser: [{required: true, message: '输配员不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    this.power = getPageActionPower('breedRegister');
    listFarmZone(this.$store.state.user.currentFarmCode).then(res => this.listFarmZone = res);
    listUser().then(res => this.listUser = res);
    listSysConfig('cattleBreed').then(res => this.listBreed = res);
    listSysConfig('breedingMethod').then(res => this.listMethod = res);
    this.getData();
  },
  computed: {
    queryParams() {
      let params = {...this.query.form};
      if (params.breedingDay && params.breedingDay.length) {
        params.breedingDayStart = params.breedingDay[0];
        params.breedingDayEnd = params.breedingDay[1];
        params.breedingDay = undefined;
      }
      params.farmCode = this.$store.state.user.currentFarmCode;
      return params;
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
      pageBreedRegister(this.queryParams).then(res => {
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
        let data = {...this.saveDialog.form};
        data.farmCode = this.$store.state.user.currentFarmCode;
        data.cattleCodeList = data.cattleCodeList.split(',').filter(item => item).map(item => item.trim());
        addBreedRegister(data).then(res => {
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
        delBreedRegister(this.multipleSelection.map(item => item.id)).then(res => {
          if (res > 0) {
            this.$message.success('删除成功');
            this.getData();
          } else {
            this.$message.error('删除失败');
          }
        });
      });
    },
    downloadRegisterCattle(overDays) {
      let paramsList = ['templateCode=downloadRegisterCattle'];
      paramsList.push(`fileName=配种超过${overDays}天的牛只.xlsx`);
      paramsList.push(`farmCode=${this.$store.state.user.currentFarmCode}`);
      paramsList.push(`overDays=${overDays}`);
      window.open(`/api/common/export?${paramsList.join('&')}`);
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
