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
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="结果" :label-width="formLabelWidth">
                <el-select v-model="query.form.result" style="width:100%" placeholder="请选择">
                  <el-option key="all" label="全部" value=""></el-option>
                  <el-option v-for="item in listPregnancyResult"
                             :key="item.key"
                             :label="item.value"
                             :value="item.key">
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
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addInfo">添加</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="delInfo">批量删除</el-button>
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
        <el-table-column prop="resultDay" label="日期"></el-table-column>
        <el-table-column label="操作员">
          <template slot-scope="scope">
            <user-info :username="scope.row.operaUser"/>
          </template>
        </el-table-column>
        <el-table-column prop="resultValue" label="结果"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
        <el-table-column prop="updateUser" label="修改人"></el-table-column>
        <el-table-column
            fixed="right"
            label="后代"
            width="200">
          <template slot-scope="scope">
            <cattle-info
                style="display: block"
                v-for="item in scope.row.children"
                :key="item.id"
                :cattle-code="item.cattleCode"/>
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
    <el-dialog :destroy-on-close="true" title="新增" :visible.sync="saveDialog.visible" :width="'1000px'">
      <el-form :model="saveDialog.form" ref="saveDialog.form" :rules="saveDialog.rules">
        <el-form-item label="登记号" :label-width="formLabelWidth" prop="registerId">
          <el-input v-model="saveDialog.form.registerId" placeholder="请输入"></el-input>
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
                       :label="item.name"
                       :value="item.username">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结果" :label-width="formLabelWidth" prop="result">
          <el-select v-model="saveDialog.form.result" style="width:100%" placeholder="请选择">
            <el-option v-for="item in listPregnancyResult"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.remark" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="后代" :label-width="formLabelWidth">
          <el-link type="primary" :underline="false" @click="addCattle">添加</el-link>
        </el-form-item>
      </el-form>
      <el-table
          :data="saveDialog.form.children"
          current-row-key="id"
          border
          class="table"
          header-cell-class-name="table-header"
      >
        <el-table-column prop="farmName" label="牧场"></el-table-column>
        <el-table-column prop="farmZoneCode" label="圈舍编号"></el-table-column>
        <el-table-column prop="cattleCode" label="耳牌号"></el-table-column>
        <el-table-column prop="cattleName" label="牛只名称"></el-table-column>
        <el-table-column prop="breedValue" label="品种"></el-table-column>
        <el-table-column prop="sexValue" label="性别"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-link type="danger" :underline="false" @click="delCattle(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveInfo">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :destroy-on-close="true" title="添加牛犊子" :visible.sync="addCattleDialog.visible">
      <el-form :model="addCattleDialog.form" ref="addCattleDialog.form" :rules="addCattleDialog.rules">
        <el-form-item label="牧场" :label-width="formLabelWidth" prop="farmId">
          <el-select v-model="addCattleDialog.form.farmId" filterable placeholder="请选择" style="width:100%" @change="selectFarmZone">
            <el-option
                v-for="item in listFarm"
                :key="item.farmId"
                :label="item.farmName"
                :value="item.farmId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="圈舍编号" :label-width="formLabelWidth" prop="farmZoneCode">
          <el-select v-model="addCattleDialog.form.farmZoneCode" filterable placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in listFarmZone"
                :key="item.farmZoneCode"
                :label="item.farmZoneCode"
                :value="item.farmZoneCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="耳牌号" :label-width="formLabelWidth" prop="cattleCode">
          <el-input v-model="addCattleDialog.form.cattleCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="牛只名称" :label-width="formLabelWidth">
          <el-input v-model="addCattleDialog.form.cattleName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="品种" :label-width="formLabelWidth" prop="breed">
          <el-select v-model="addCattleDialog.form.breed" style="width:100%" placeholder="请选择">
            <el-option v-for="item in cattleBreedList"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="addCattleDialog.form.sex" style="width:100%" placeholder="请选择">
            <el-option v-for="item in cattleSexList"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="addCattleDialog.form.remark" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCattleDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="addCattleInfo">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UserInfo from "@/components/common/UserInfo";
import CattleInfo from "@/components/common/CattleInfo";
import {listFarm, listFarmZone} from '@/api/farm';
import {pageBreedPregnancyResult, addBreedPregnancyResult, delBreedPregnancyResult} from '@/api/breed';
import {listUser} from '@/api/user';
import {listSysConfig} from "@/api/common";

export default {
  name: 'BreedPregnancyResult',
  components: {
    UserInfo,
    CattleInfo
  },
  data() {
    return {
      listUser: [],
      listFarm: [],
      listFarmZone: [],
      listPregnancyResult: [],
      cattleBreedList: [],
      cattleSexList: [],
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
      childrenSize: 0,
      saveDialog: {
        visible: false,
        form: {children: []},
        rules: {
          registerId: [{required: true, message: '登记号不能为空', trigger: 'change'}],
          resultDay: [{required: true, message: '日期不能为空', trigger: 'change'}],
          operaUser: [{required: true, message: '操作员不能为空', trigger: 'change'}],
          result: [{required: true, message: '结果不能为空', trigger: 'change'}]
        }
      },
      addCattleDialog: {
        visible: false,
        form: {},
        rules: {
          farmId: [{required: true, message: '牧场不能为空', trigger: 'change'}],
          farmZoneCode: [{required: true, message: '圈舍编号不能为空', trigger: 'change'}],
          cattleCode: [{required: true, message: '耳牌号不能为空', trigger: 'change'}],
          breed: [{required: true, message: '品种不能为空', trigger: 'change'}],
          sex: [{required: true, message: '性别不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    listSysConfig('pregnancyResult').then(res => this.listPregnancyResult = res);
    listSysConfig('cattleBreed').then(res => this.cattleBreedList = res);
    listSysConfig('cattleSex').then(res => this.cattleSexList = res);
    listUser().then(res => this.listUser = res);
    listFarm().then(res => this.listFarm = res);
    this.getData();
  },
  methods: {
    selectFarmZone() {
      if (!this.addCattleDialog.form.farmId) {
        this.listFarmZone = [];
        return;
      }
      listFarmZone(this.addCattleDialog.form.farmId).then(res => this.listFarmZone = res);
    },
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
      if (params.resultDay && params.resultDay.length) {
        params.resultDayStart = params.resultDay[0];
        params.resultDayEnd = params.resultDay[1];
        params.resultDay = undefined;
      }
      pageBreedPregnancyResult(params).then(res => {
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
      this.saveDialog.form = {children: []};
      this.saveDialog.visible = true;
    },
    addCattle() {
      this.addCattleDialog.form = {};
      this.addCattleDialog.visible = true;
    },
    addCattleInfo() {
      this.$refs['addCattleDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        let cattleObj = {id: new Date().getTime(), ...this.addCattleDialog.form};
        cattleObj.farmName = this.listFarm.filter(item => item.farmId === cattleObj.farmId)[0].farmName;
        cattleObj.breedValue = this.cattleBreedList.filter(item => item.key === cattleObj.breed)[0].value;
        cattleObj.sexValue = this.cattleSexList.filter(item => item.key === cattleObj.sex)[0].value;
        let children = this.saveDialog.form.children && [...this.saveDialog.form.children] || [];
        children.push(cattleObj);
        this.saveDialog.form.children = children;
        this.addCattleDialog.visible = false;
        this.addCattleDialog.form = {children: []};
      });
    },
    delCattle(row) {
      let children = this.saveDialog.form.children && [...this.saveDialog.form.children] || [];
      children = children.filter(item => item.id !== row.id);
      this.saveDialog.form.children = children;
    },
    saveInfo() {
      this.$refs['saveDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        let body = {...this.saveDialog.form};
        if (body.children) {
          body.children.forEach(item => {
            item.id = '';
            item.birthday = body.resultDay;
          });
        }
        addBreedPregnancyResult(body).then(res => {
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
