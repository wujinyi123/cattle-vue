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
              <el-form-item label="日期" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.resultDay"
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
              <el-form-item label="操作员" :label-width="formLabelWidth">
                <el-input v-model="query.form.operaUser" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结果" :label-width="formLabelWidth">
                <el-select v-model="query.form.result" style="width:100%" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="正常" value="正常"></el-option>
                  <el-option label="弱犊" value="弱犊"></el-option>
                  <el-option label="死胎" value="死胎"></el-option>
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
        <el-table-column prop="farmZoneCode" label="圈舍编号"></el-table-column>
        <el-table-column label="牛只耳牌号">
          <template slot-scope="scope">
            <cattle-info :cattle-code="scope.row.cattleCode"/>
          </template>
        </el-table-column>
        <el-table-column prop="resultDay" label="日期"></el-table-column>
        <el-table-column label="操作员">
          <template slot-scope="scope">
            <user-info :username="scope.row.operaUser"/>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="结果"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="childFarmZoneCode" label="牛犊子圈舍编号"></el-table-column>
        <el-table-column prop="childCattleCode" label="牛犊子耳牌号"></el-table-column>
        <el-table-column prop="breedValue" label="牛犊子品种"></el-table-column>
        <el-table-column prop="sex" label="牛犊子性别"></el-table-column>
        <el-table-column prop="color" label="牛犊子颜色"></el-table-column>
        <el-table-column prop="weight" label="牛犊子体重"></el-table-column>
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
    <el-dialog :destroy-on-close="true" title="新增" :visible.sync="saveDialog.visible" :width="'1000px'">
      <el-form :model="saveDialog.form" ref="saveDialog.form" :rules="saveDialog.rules">
        <el-form-item label="牛只耳牌号" :label-width="formLabelWidth" prop="cattleCode">
          <el-input v-model="saveDialog.form.cattleCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth" prop="resultDay">
          <el-date-picker
              v-model="saveDialog.form.resultDay"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作员" :label-width="formLabelWidth" prop="operaUser">
          <el-select v-model="saveDialog.form.operaUser" filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listUser"
                       :key="item.username"
                       :label="item.title"
                       :value="item.username">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结果" :label-width="formLabelWidth" prop="result">
          <el-select v-model="saveDialog.form.result" style="width:100%" placeholder="请选择">
            <el-option label="正常" value="正常"></el-option>
            <el-option label="弱犊" value="弱犊"></el-option>
            <el-option label="死胎" value="死胎"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.remark" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="牛犊子圈舍编号" :label-width="formLabelWidth">
          <el-select v-model="saveDialog.form.childFarmZoneCode" style="width:100%" placeholder="请选择">
            <el-option v-for="item in listFarmZone"
                       :key="item.farmZoneCode"
                       :label="item.farmZoneCode"
                       :value="item.farmZoneCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="牛犊子耳牌号" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.childCattleCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="牛犊子品种" :label-width="formLabelWidth">
          <el-select v-model="saveDialog.form.breed" style="width:100%" placeholder="请选择">
            <el-option v-for="item in cattleBreedList"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="牛犊子性别" :label-width="formLabelWidth">
          <el-select v-model="saveDialog.form.sex" style="width:100%" placeholder="请选择">
            <el-option label="公" value="公"></el-option>
            <el-option label="母" value="母"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="颜色" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.color" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="体重" :label-width="formLabelWidth">
          <el-input v-model="saveDialog.form.weight" placeholder="请输入"></el-input>
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
import {listFarmZone} from '@/api/farm';
import {pageBreedPregnancyResult, addBreedPregnancyResult, delBreedPregnancyResult} from '@/api/breed';
import {listUser} from '@/api/user';
import {listSysConfig} from "@/api/sys";

export default {
  name: 'BreedPregnancyResult',
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
      cattleBreedList: [],
      query: {
        form: {
          cattleCode:'',
          resultDay:[],
          pageNum: 1,
          pageSize: 10
        }
      },
      tableData: [],
      loading: false,
      multipleSelection: [],
      pageTotal: 0,
      formLabelWidth: '100px',
      childrenSize: 0,
      saveDialog: {
        visible: false,
        form: {},
        rules: {
          cattleCode: [{required: true, message: '牛只耳牌号', trigger: 'change'}],
          resultDay: [{required: true, message: '日期不能为空', trigger: 'change'}],
          operaUser: [{required: true, message: '操作员不能为空', trigger: 'change'}],
          result: [{required: true, message: '结果不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    let query = {...this.$route.query};
    if (query.cattleCode) {
      this.query.form.cattleCode = query.cattleCode;
    }
    if (query.breedingDay && query.expectedDay) {
      this.query.form.resultDay = [query.breedingDay, query.expectedDay];
    }
    this.power = getPageActionPower('breedPregnancyResult');
    listFarmZone(this.$store.state.user.currentFarmCode).then(res => this.listFarmZone = res);
    listSysConfig('cattleBreed').then(res => this.cattleBreedList = res);
    listUser().then(res => this.listUser = res);
    this.getData();
  },
  computed: {
    queryParams() {
      let params = {...this.query.form};
      if (params.resultDay && params.resultDay.length) {
        params.resultDayStart = params.resultDay[0];
        params.resultDayEnd = params.resultDay[1];
        params.resultDay = undefined;
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
      pageBreedPregnancyResult(this.queryParams).then(res => {
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
        if (data.result !== '死胎' && (!data.childFarmZoneCode || !data.childCattleCode || !data.breed || !data.sex)) {
          this.$message.error('结果不是死胎时，牛犊子圈舍编号/耳牌号/品种/性别必填');
          return false;
        }
        addBreedPregnancyResult(data).then(res => {
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
        delBreedPregnancyResult(this.multipleSelection.map(item => item.id)).then(res => {
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
