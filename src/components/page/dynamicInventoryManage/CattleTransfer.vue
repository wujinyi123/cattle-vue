<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :model="query.form">
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="流程号" :label-width="formLabelWidth">
                <el-input v-model="query.form.reviewId" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原耳牌号" :label-width="formLabelWidth">
                <el-input v-model="query.form.oldCattleCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="新耳牌号" :label-width="formLabelWidth">
                <el-input v-model="query.form.newCattleCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="提交人" :label-width="formLabelWidth">
                <el-input v-model="query.form.submitUser" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="提交时间" :label-width="formLabelWidth">
                <el-date-picker
                    v-model="query.form.submitTime"
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
              <el-form-item label="原因" :label-width="formLabelWidth">
                <el-input v-model="query.form.reason" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="handle-el-row">
            <el-col :span="8">
              <el-form-item label="审批人" :label-width="formLabelWidth">
                <el-input v-model="query.form.approver" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作人" :label-width="formLabelWidth">
                <el-input v-model="query.form.operator" placeholder="请输入"></el-input>
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
            <el-col :span="8">
              <el-form-item label="意见" :label-width="formLabelWidth">
                <el-input v-model="query.form.opinion" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" :label-width="formLabelWidth">
                <el-select v-model="query.form.status" filterable placeholder="请选择" style="width:100%">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="进行中" value="进行中"></el-option>
                  <el-option label="取消" value="取消"></el-option>
                  <el-option label="完成" value="完成"></el-option>
                  <el-option label="拒绝" value="拒绝"></el-option>
                </el-select>
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
          <el-button
              v-if="isSysAdmin === 'Y' || currentUsername === currentFarmOwner"
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="createInfo">
            创建转场流程
          </el-button>
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
        <el-table-column prop="reviewId" label="流程号"></el-table-column>
        <el-table-column prop="oldFarmName" label="原牧场"></el-table-column>
        <el-table-column label="原耳牌号">
          <template slot-scope="scope">
            <cattle-info :cattle-code="scope.row.oldCattleCode" :cattle-json="scope.row.oldCattleInfo"/>
          </template>
        </el-table-column>
        <el-table-column prop="newFarmName" label="新牧场"></el-table-column>
        <el-table-column label="新耳牌号">
          <template slot-scope="scope">
            <cattle-info :cattle-code="scope.row.newCattleCode" :cattle-json="scope.row.newCattleInfo"/>
          </template>
        </el-table-column>
        <el-table-column label="提交人">
          <template slot-scope="scope">
            <user-info :username="scope.row.submitUser"/>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间"></el-table-column>
        <el-table-column prop="reason" label="原因"></el-table-column>
        <el-table-column label="审批人">
          <template slot-scope="scope">
            <user-info :username="scope.row.approver"/>
          </template>
        </el-table-column>
        <el-table-column label="操作人">
          <template slot-scope="scope">
            <user-info :username="scope.row.operator"/>
          </template>
        </el-table-column>
        <el-table-column prop="operateTime" label="操作时间"></el-table-column>
        <el-table-column prop="opinion" label="意见"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope" v-if="scope.row.status==='进行中'">
            <el-button
                v-if="isSysAdmin==='Y' || currentUsername===scope.row.approver"
                type="primary"
                icon="el-icon-edit"
                @click="openApprover(scope.row.reviewId)">
              修改评审人
            </el-button>
            <el-button
                v-if="isSysAdmin==='Y' || currentUsername===scope.row.submitUser"
                type="danger"
                icon="el-icon-circle-close"
                class="red"
                @click="cannelTransfer(scope.row.reviewId)">
              取消
            </el-button>
            <el-button
                v-if="currentUsername===scope.row.approver"
                type="danger"
                icon="el-icon-close"
                class="red"
                @click="refuseTransfer(scope.row.reviewId)">
              拒绝
            </el-button>
            <el-button
                v-if="currentUsername===scope.row.approver"
                type="primary"
                icon="el-icon-check"
                @click="openAgreeTransfer(scope.row.reviewId, scope.row.newFarmCode, scope.row.oldCattleCode)">
              同意
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
    <el-dialog :destroy-on-close="true" title="创建转场流程" :visible.sync="submitDialog.visible">
      <el-form :model="submitDialog.form" ref="submitDialog.form" :rules="submitDialog.rules">
        <el-form-item label="原耳牌号" :label-width="formLabelWidth" prop="oldCattleCode">
          <el-input v-model="submitDialog.form.oldCattleCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="新牧场" :label-width="formLabelWidth" prop="newFarmCode">
          <el-select v-model="submitDialog.form.newFarmCode" style="width:100%" placeholder="请选择">
            <el-option v-for="item in listFarm"
                       :key="item.farmCode"
                       :label="item.farmName"
                       :value="item.farmCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因" :label-width="formLabelWidth" prop="reason">
          <el-input type="textarea" :rows="2" v-model="submitDialog.form.reason" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitInfo">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog :destroy-on-close="true" title="修改评审人" :visible.sync="approverDialog.visible">
      <el-form :model="approverDialog.form" ref="approverDialog.form" :rules="approverDialog.rules">
        <el-form-item label="新评审人" :label-width="formLabelWidth" prop="approver">
          <el-select v-model="approverDialog.form.approver" style="width:100%" placeholder="请选择">
            <el-option v-for="item in listUser"
                       :key="item.username"
                       :label="item.title"
                       :value="item.username">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approverDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="updateApprover">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog :destroy-on-close="true" title="同意转场" :visible.sync="agreeDialog.visible">
      <el-form :model="agreeDialog.form" ref="agreeDialog.form" :rules="agreeDialog.rules">
        <el-form-item label="新牧场圈舍编号" :label-width="formLabelWidth" prop="newFarmZoneCode">
          <el-select v-model="agreeDialog.form.newFarmZoneCode" filterable placeholder="请选择" style="width:100%">
            <el-option
                v-for="item in listFarmZone"
                :key="item.farmZoneCode"
                :label="item.farmZoneCode"
                :value="item.farmZoneCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新耳牌号" :label-width="formLabelWidth" prop="newCattleCode">
          <el-input v-model="agreeDialog.form.newCattleCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="意见" :label-width="formLabelWidth" prop="opinion">
          <el-input type="textarea" :rows="2" v-model="agreeDialog.form.opinion" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="agreeDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="agreeTransfer">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UserInfo from "@/components/common/UserInfo";
import CattleInfo from "@/components/common/CattleInfo";
import {pageCattleTransfer, addCattleTransfer, updateCattleTransferApprover, updateCattleTransferStatus} from '@/api/cattle';
import {listUser} from "@/api/user";
import {listFarm, getFarm, listFarmZone} from '@/api/farm';

export default {
  name: 'CattleTransfer',
  components: {
    UserInfo,
    CattleInfo
  },
  data() {
    return {
      isSysAdmin: this.$store.state.user.userInfo.isSysAdmin,
      currentUsername: this.$store.state.user.userInfo.username,
      currentFarmCode: this.$store.state.user.currentFarmCode,
      currentFarmOwner: '',
      listUser: [],
      listFarm: [],
      listFarmZone: [],
      query: {
        form: {
          currentFarmCode: this.$store.state.user.currentFarmCode,
          pageNum: 1,
          pageSize: 10
        }
      },
      tableData: [],
      loading: false,
      pageTotal: 0,
      formLabelWidth: '150px',
      submitDialog: {
        visible: false,
        form: {},
        rules: {
          oldCattleCode: [{required: true, message: '原耳牌号不能为空', trigger: 'change'}],
          newFarmCode: [{required: true, message: '新牧场不能为空', trigger: 'change'}],
          reason: [{required: true, message: '原因不能为空', trigger: 'change'}]
        }
      },
      approverDialog: {
        visible: false,
        form: {},
        rules: {
          approver: [{required: true, message: '新评审人不能为空', trigger: 'change'}]
        }
      },
      agreeDialog: {
        visible: false,
        form: {},
        rules: {
          newFarmZoneCode: [{required: true, message: '新牧场圈舍编号不能为空', trigger: 'change'}],
          newCattleCode: [{required: true, message: '新耳牌号不能为空', trigger: 'change'}],
          opinion: [{required: true, message: '意见不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    this.query.form.status = this.$route.query.status;
    this.query.form.submitUser = this.$route.query.submitUser;
    this.query.form.approver = this.$route.query.approver;
    getFarm(this.currentFarmCode).then(res => {
      this.currentFarmOwner = res.farmOwner;
    });
    listUser().then(res => this.listUser = res);
    listFarm({}).then(res => this.listFarm = res);
    this.getData();
  },
  computed: {
    queryParams() {
      let params = {...this.query.form};
      if (params.submitTime && params.submitTime.length) {
        params.submitTimeStart = params.submitTime[0];
        params.submitTimeEnd = params.submitTime[1];
        params.submitTime = undefined;
      }
      if (params.operateTime && params.operateTime.length) {
        params.operateTimeStart = params.operateTime[0];
        params.operateTimeEnd = params.operateTime[1];
        params.operateTime = undefined;
      }
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
      this.loading = true;
      pageCattleTransfer(this.queryParams).then(res => {
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
    createInfo() {
      this.submitDialog.form = {};
      this.submitDialog.visible = true;
    },
    submitInfo() {
      this.$refs['submitDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        let data = {...this.submitDialog.form};
        data.oldFarmCode = this.$store.state.user.currentFarmCode;
        addCattleTransfer(data).then(res => {
          if (res > 0) {
            this.submitDialog.visible = false;
            this.submitDialog.form = {};
            this.$message.success('创建成功');
            this.getData();
          } else {
            this.$message.error('创建失败');
          }
        });
      });
    },
    openApprover(reviewId) {
      this.approverDialog.form = {reviewId};
      this.approverDialog.visible = true;
    },
    updateApprover() {
      this.$refs['approverDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        updateCattleTransferApprover(this.approverDialog.form).then(res => {
          if (res > 0) {
            this.approverDialog.visible = false;
            this.approverDialog.form = {};
            this.$message.success('修改成功');
            this.getData();
          } else {
            this.$message.error('修改失败');
          }
        });
      });
    },
    cannelTransfer(reviewId) {
      this.$prompt('请输入取消原因', '取消转场', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (!value) {
          this.$message.error('取消原因不能为空');
        } else {
          updateCattleTransferStatus({reviewId, opinion: value, status: '取消'}).then(res => {
            if (res > 0) {
              this.$message.success('取消成功');
              this.getData();
            } else {
              this.$message.error('取消失败');
            }
          });
        }
      });
    },
    refuseTransfer(reviewId) {
      this.$prompt('请输入拒绝意见', '拒绝转场', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (!value) {
          this.$message.error('拒绝意见不能为空');
        } else {
          updateCattleTransferStatus({reviewId, opinion: value, status: '拒绝'}).then(res => {
            if (res > 0) {
              this.$message.success('拒绝成功');
              this.getData();
            } else {
              this.$message.error('拒绝失败');
            }
          });
        }
      });
    },
    openAgreeTransfer(reviewId, newFarmCode, oldCattleCode) {
      listFarmZone({farmCode: newFarmCode}).then(res => {
        this.listFarmZone = res;
        this.agreeDialog.form = {reviewId, newCattleCode: oldCattleCode, status: '完成'};
        this.agreeDialog.visible = true;
      });
    },
    agreeTransfer() {
      this.$refs['agreeDialog.form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        updateCattleTransferStatus(this.agreeDialog.form).then(res => {
          if (res > 0) {
            this.agreeDialog.visible = false;
            this.agreeDialog.form = {};
            this.$message.success('转场成功');
            this.getData();
          } else {
            this.$message.error('转场失败');
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
