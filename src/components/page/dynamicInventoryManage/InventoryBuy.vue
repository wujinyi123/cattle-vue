<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="6">
              <el-form-item label="牧场" :label-width="formLabelWidth">
                <el-input v-model="query.form.farmName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牛只耳牌号" :label-width="formLabelWidth">
                <el-input v-model="query.form.cattleCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="来源" :label-width="formLabelWidth">
                <el-input v-model="query.form.source" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入场时间" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.buyDay"
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
          <el-button type="primary" icon="el-icon-delete" @click="delInfo">批量删除</el-button>
          <import-export :template-code="'inventoryBuy'" :params="query.form" :hasImport="false"></import-export>
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
        <el-table-column label="牛只耳牌号">
          <template slot-scope="scope">
            <cattle-info :cattle-code="scope.row.cattleCode"/>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源"></el-table-column>
        <el-table-column prop="quarantineCertificate" label="检疫证明"></el-table-column>
        <el-table-column prop="buyDay" label="入场时间"></el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
        <el-table-column label="修改人">
          <template slot-scope="scope">
            <user-info :username="scope.row.updateUser"/>
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
        <el-form-item label="牧场" :label-width="formLabelWidth" prop="farmId">
          <el-select v-model="saveDialog.form.farmId" filterable placeholder="请选择" style="width:100%" @change="selectFarmZone">
            <el-option
                v-for="item in listFarm"
                :key="item.farmId"
                :label="item.farmName"
                :value="item.farmId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="圈舍编号" :label-width="formLabelWidth" prop="farmZoneCode">
          <el-select v-model="saveDialog.form.farmZoneCode" filterable placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in listFarmZone"
                :key="item.farmZoneCode"
                :label="item.farmZoneCode"
                :value="item.farmZoneCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="耳牌号" :label-width="formLabelWidth" prop="cattleCode">
          <el-input v-model="saveDialog.form.cattleCode" placeholder="请输入"></el-input>
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
            <el-option v-for="item in cattleSexList"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
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
        <el-form-item label="来源" :label-width="formLabelWidth" prop="source">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.source" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="检疫证明" :label-width="formLabelWidth" prop="quarantineCertificate">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.quarantineCertificate" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="入场时间" :label-width="formLabelWidth" prop="buyDay">
          <el-date-picker
              v-model="saveDialog.form.buyDay"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width:100%">
          </el-date-picker>
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
import {pageInventoryBuy, addInventoryBuy, delInventoryBuy} from '@/api/inventory';
import {listSysConfig} from "@/api/common";
import {listFarm, listFarmZone} from '@/api/farm';

export default {
  name: 'InventoryBuy',
  components: {
    ImportExport,
    UserInfo,
    CattleInfo
  },
  data() {
    return {
      listFarm: [],
      listFarmZone: [],
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
      saveDialog: {
        visible: false,
        form: {},
        rules: {
          farmId: [{required: true, message: '牧场不能为空', trigger: 'change'}],
          farmZoneCode: [{required: true, message: '圈舍编号不能为空', trigger: 'change'}],
          cattleCode: [{required: true, message: '耳牌号不能为空', trigger: 'change'}],
          breed: [{required: true, message: '品种不能为空', trigger: 'change'}],
          sex: [{required: true, message: '性别不能为空', trigger: 'change'}],
          birthday: [{required: true, message: '出生日期不能为空', trigger: 'change'}],
          source: [{required: true, message: '来源不能为空', trigger: 'change'}],
          quarantineCertificate: [{required: true, message: '检疫证明不能为空', trigger: 'change'}],
          buyDay: [{required: true, message: '入场时间不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    listFarm().then(res => this.listFarm = res);
    listSysConfig('cattleBreed').then(res => this.cattleBreedList = res);
    listSysConfig('cattleSex').then(res => this.cattleSexList = res);
    this.getData();
  },
  methods: {
    selectFarmZone() {
      if (!this.saveDialog.form.farmId) {
        this.listFarmZone = [];
        return;
      }
      listFarmZone(this.saveDialog.form.farmId).then(res => this.listFarmZone = res);
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
      if (params.buyDay && params.buyDay.length) {
        params.buyDayStart = params.buyDay[0];
        params.buyDayEnd = params.buyDay[1];
        params.buyDay = undefined;
      }
      pageInventoryBuy(params).then(res => {
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
        addInventoryBuy(this.saveDialog.form).then(res => {
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
        delInventoryBuy(this.multipleSelection.map(item => item.id)).then(res => {
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
