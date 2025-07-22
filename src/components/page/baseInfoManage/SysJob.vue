<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <div>
          <template v-if="$store.state.user.userInfo.isSysAdmin==='Y'">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addInfo">添加</el-button>
          </template>
        </div>
      </div>
      <el-table
          :data="tableData"
          current-row-key="id"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
      >
        <el-table-column prop="jobCode" label="岗位代码"></el-table-column>
        <el-table-column prop="jobName" label="岗位名称"></el-table-column>
        <el-table-column prop="jobDesc" label="岗位描述"></el-table-column>
        <el-table-column label="岗位权限" width="300">
          <template slot-scope="scope">
            <div v-for="item in scope.row.jobPowerList">{{ item.title }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间"></el-table-column>
        <el-table-column prop="updateUser" label="修改人"></el-table-column>
        <el-table-column label="操作" width="200" align="center" v-if="$store.state.user.userInfo.isSysAdmin==='Y'">
          <template slot-scope="scope">
            <el-button
                type="primary"
                icon="el-icon-edit"
                @click="updateInfo(scope.row.jobCode)"
            >编辑
            </el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                class="red"
                @click="delInfo(scope.row.jobCode)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :destroy-on-close="true" :title="saveDialog.title" :visible.sync="saveDialog.visible">
      <el-form :model="saveDialog.form" ref="saveDialog.form" :rules="saveDialog.rules">
        <el-form-item label="岗位代码" :label-width="formLabelWidth" prop="jobCode">
          <el-input v-model="saveDialog.form.jobCode" placeholder="请输入" :disabled="saveDialog.type === 'update'"></el-input>
        </el-form-item>
        <el-form-item label="岗位名称" :label-width="formLabelWidth" prop="jobName">
          <el-input v-model="saveDialog.form.jobName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="岗位描述" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="saveDialog.form.jobDesc" placeholder="请输入"></el-input>
        </el-form-item>
        <div style="text-align: center;margin: 15px 0;font-size: 20px;font-weight: bold;">
          岗位权限
        </div>
        <el-form-item :label-width="formLabelWidth" v-for="item in pageCodeList" :key="item.code" :label="item.name">
          <el-checkbox-group v-model="saveDialog.form.jobPower[item.code]">
            <el-checkbox v-for="item in curdList" :key="item.code" :label="item.code">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
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
import pageCode from "@/components/common/pageCode";
import {listSysJob, getSysJob, saveSysJob, delSysJob} from '@/api/sys';

export default {
  name: 'SysJob',
  data() {
    return {
      curdList: [
        {code: 'select', name: '查看'},
        {code: 'insert', name: '新增'},
        {code: 'update', name: '修改'},
        {code: 'delete', name: '删除'}
      ],
      curdMap: {},
      pageCodeList: [],
      tableData: [],
      formLabelWidth: '100px',
      saveDialog: {
        title: '',
        type: 'add',
        visible: false,
        form: {jobPower: {}},
        rules: {
          jobCode: [{required: true, message: '岗位代码不能为空', trigger: 'change'}],
          jobName: [{required: true, message: '牧场名称不能为空', trigger: 'change'}]
        }
      }
    };
  },
  created() {
    this.pageCodeList = pageCode;
    this.curdList.forEach(item => this.curdMap[item.code] = item.name);
    this.getData();
  },
  methods: {
    getData() {
      listSysJob().then(res => {
        res.forEach(item => {
          let jobPower = {};
          try {
            jobPower = item.jobPower && JSON.parse(item.jobPower) || {};
          } catch (e) {

          }
          let jobPowerList = [];
          this.pageCodeList.forEach(pc => {
            if (jobPower[pc.code] && jobPower[pc.code].length > 0) {
              let name = pc.name;
              let powerList = jobPower[pc.code] || [];
              let valueList = [];
              Object.keys(this.curdMap).forEach(key => {
                if (powerList.includes(key)) {
                  valueList.push(this.curdMap[key]);
                }
              });
              let value = valueList.join(',')
              jobPowerList.push({
                name,
                value,
                title: `${name}：${value}`
              });
            }
          });
          item.jobPowerList = jobPowerList;
        });
        console.log(res);
        this.tableData = res;
      });
    },
    addInfo() {
      this.saveDialog.title = '新增';
      this.saveDialog.type = 'add';
      let jobPower = {};
      pageCode.forEach(item => jobPower[item.code] = []);
      this.saveDialog.form = {jobPower};
      this.saveDialog.visible = true;
    },
    updateInfo(jobCode) {
      getSysJob(jobCode).then(res => {
        let jobPower = {};
        pageCode.forEach(item => jobPower[item.code] = []);
        let jobPowerForRes = {};
        try {
          jobPowerForRes = res.jobPower && JSON.parse(res.jobPower) || {};
        } catch (e) {

        }
        res.jobPower = {...jobPower, ...jobPowerForRes};
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
        let data = {...this.saveDialog.form};
        data.jobPower = JSON.stringify(data.jobPower);
        saveSysJob(this.saveDialog.type, data).then(res => {
          if (res > 0) {
            this.saveDialog.visible = false;
            this.saveDialog.form = {jobPower: {}};
            this.$message.success('保存成功');
            this.getData();
          } else {
            this.$message.error('保存失败');
          }
        });
      });
    },
    delInfo(jobCode) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSysJob(jobCode).then(res => {
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

.table {
  width: 100%;
  font-size: 14px;
}
</style>
