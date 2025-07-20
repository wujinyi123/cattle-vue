<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="6">
              <el-form-item label="牛只耳牌号" :label-width="formLabelWidth">
                <el-input v-model="query.form.cattleCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="买家信息" :label-width="formLabelWidth">
                <el-input v-model="query.form.buyerInfo" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="检疫证明" :label-width="formLabelWidth">
                <el-input v-model="query.form.delInventorySell" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="日期" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.sellDay"
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
        <el-table-column label="牛只耳牌号">
          <template slot-scope="scope">
            <cattle-info :cattle-code="scope.row.cattleCode" :cattle-json="scope.row.cattleInfo"/>
          </template>
        </el-table-column>
        <el-table-column prop="buyerInfo" label="买家信息"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="quarantineCertificate" label="检疫证明"></el-table-column>
        <el-table-column prop="sellDay" label="日期"></el-table-column>
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
        <el-form-item label="耳牌号" :label-width="formLabelWidth" prop="cattleCode">
          <el-input v-model="saveDialog.form.cattleCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="买家信息" :label-width="formLabelWidth" prop="buyerInfo">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.buyerInfo" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
          <el-input-number v-model="saveDialog.form.price" :min="1" :max="99999"></el-input-number>
        </el-form-item>
        <el-form-item label="检疫证明" :label-width="formLabelWidth" prop="quarantineCertificate">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.quarantineCertificate" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth" prop="sellDay">
          <el-date-picker
              v-model="saveDialog.form.sellDay"
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
import {pageInventorySell, addInventorySell, delInventorySell} from '@/api/inventory';
import {getPageActionPower} from "@/components/common/base";

export default {
  name: 'InventorySell',
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
          cattleCode: [{required: true, message: '耳牌号不能为空', trigger: 'change'}],
          buyerInfo: [{required: true, message: '买家信息不能为空', trigger: 'change'}],
          price: [{required: true, message: '价格不能为空', trigger: 'change'}],
          quarantineCertificate: [{required: true, message: '检疫证明不能为空', trigger: 'change'}],
          sellDay: [{required: true, message: '日期不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    this.power = getPageActionPower('inventorySell');
    this.getData();
  },
  computed:{
    queryParams(){
      let params = {...this.query.form};
      if (params.sellDay && params.sellDay.length) {
        params.sellDayStart = params.sellDay[0];
        params.sellDayEnd = params.sellDay[1];
        params.sellDay = undefined;
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
      this.loading = true;
      pageInventorySell(this.queryParams).then(res => {
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
        addInventorySell(data).then(res => {
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
        delInventorySell(this.multipleSelection.map(item => item.id)).then(res => {
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
