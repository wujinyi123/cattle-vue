<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="旧圈舍编号" :label-width="formLabelWidth">
                <el-select v-model="query.form.oldFarmZoneCode" filterable style="width:100%" placeholder="请选择">
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
              <el-form-item label="新圈舍编号" :label-width="formLabelWidth">
                <el-select v-model="query.form.newFarmZoneCode" filterable style="width:100%" placeholder="请选择">
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
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="query.form.remark" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作者" :label-width="formLabelWidth">
                <el-select v-model="query.form.operateUser" filterable style="width:100%" placeholder="请选择">
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
              <el-form-item label="操作时间" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.operateTime"
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
            <el-col :span="24" style="text-align:right">
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addInfo">添加</el-button>
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
      >
        <el-table-column prop="oldFarmZoneCode" label="原圈舍编号"></el-table-column>
        <el-table-column prop="newFarmZoneCode" label="新圈舍编号"></el-table-column>
        <el-table-column prop="cattleCodes" label="牛只耳牌号"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作者">
          <template slot-scope="scope">
            <user-info :username="scope.row.operateUser"/>
          </template>
        </el-table-column>
        <el-table-column prop="operateTime" label="操作时间"></el-table-column>
        <el-table-column label="最后修改人">
          <template slot-scope="scope">
            <user-info :username="scope.row.updateUser"/>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
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
        <el-form-item label="原圈舍编号" :label-width="formLabelWidth" prop="oldFarmZoneCode">
          <el-select v-model="saveDialog.form.oldFarmZoneCode" @change="getCattleList" filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listFarmZone"
                       :key="item.farmZoneCode"
                       :label="item.farmZoneCode"
                       :value="item.farmZoneCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新圈舍编号" :label-width="formLabelWidth" prop="newFarmZoneCode">
          <el-select v-model="saveDialog.form.newFarmZoneCode" filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listFarmZone"
                       :key="item.farmZoneCode"
                       :label="item.farmZoneCode"
                       :value="item.farmZoneCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="牛只耳牌号" :label-width="formLabelWidth" prop="cattleCodes">
          <el-select v-model="saveDialog.form.cattleCodes" multiple filterable style="width:100%" placeholder="请选择">
            <el-option v-for="item in listCattle"
                       :key="item.cattleCode"
                       :label="item.cattleCode"
                       :value="item.cattleCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.remark" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="操作者" :label-width="formLabelWidth" prop="operateUser">
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
import ImportExport from "@/components/common/ImportExport";
import UserInfo from "@/components/common/UserInfo";
import CattleInfo from "@/components/common/CattleInfo";
import {listUser} from '@/api/user';
import {listFarmZone} from "@/api/farm";
import {listCattle, pageCattleChangeZone, addCattleChangeZone} from "@/api/cattle";

export default {
  name: 'CattleChangeZone',
  components: {
    ImportExport,
    UserInfo,
    CattleInfo
  },
  data() {
    return {
      listUser: [],
      listFarmZone: [],
      listCattle: [],
      query: {
        form: {
          pageNum: 1,
          pageSize: 10
        }
      },
      tableData: [],
      loading: false,
      pageTotal: 0,
      formLabelWidth: '100px',
      saveDialog: {
        visible: false,
        form: {},
        rules: {
          oldFarmZoneCode: [{required: true, message: '旧圈舍编号不能为空', trigger: 'change'}],
          newFarmZoneCode: [{required: true, message: '新圈舍编号不能为空', trigger: 'change'}],
          cattleCodes: [{required: true, message: '牛只耳牌号不能为空', trigger: 'change'}],
          operateUser: [{required: true, message: '操作者不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    listUser().then(res => this.listUser = res);
    listFarmZone({farmCode: this.$store.state.user.currentFarmCode}).then(res => this.listFarmZone = res);
    this.getData();
  },
  computed: {
    queryParams() {
      let params = {...this.query.form};
      if (params.operateTime && params.operateTime.length) {
        params.operateTimeStart = params.operateTime[0] + ' 00:00:00';
        params.operateTimeEnd = params.operateTime[1] + " 23:59:59";
        params.operateTime = undefined;
      }
      params.farmCode = this.$store.state.user.currentFarmCode;
      return params;
    }
  },
  methods: {
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
        return;
      }
      this.loading = true;
      pageCattleChangeZone(this.queryParams).then(res => {
        this.tableData = res.list;
        this.pageTotal = res.total;
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
      let farmZoneCode = this.saveDialog.form.oldFarmZoneCode;
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
        data.cattleCodes = data.cattleCodes.join(',');
        data.farmCode = this.$store.state.user.currentFarmCode;
        addCattleChangeZone(data).then(res => {
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
