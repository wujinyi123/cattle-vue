<template>
  <div style="display: inline-block">
    <el-link type="primary" :underline="false" @click="getCattleInfo">{{ cattleCode }}</el-link>
    <el-dialog :destroy-on-close="true" :append-to-body="true" title="牛只信息" :visible.sync="cattleDialogVisible">
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">牧场：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.farmName }}</el-col>
      </el-row>
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">圈舍编号：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.farmZoneCode }}</el-col>
      </el-row>
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">耳牌号：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.cattleCode }}</el-col>
      </el-row>
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">牛只名称：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.cattleName }}</el-col>
      </el-row>
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">品种：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.breedValue }}</el-col>
      </el-row>
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">性别：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.sex }}</el-col>
      </el-row>
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">颜色：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.color }}</el-col>
      </el-row>
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">出生日期：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.birthday }}</el-col>
      </el-row>
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">年龄：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.age }}</el-col>
      </el-row>
      <el-row class="cattle-el-row">
        <el-col :span="10" class="cattle-el-col-label">备注：</el-col>
        <el-col :span="14" class="cattle-el-col-value">{{ cattleInfo.remark }}</el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cattleDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getCattle} from '@/api/cattle';

export default {
  name: 'CattleInfo',
  props: {
    cattleCode: {
      type: String,
      default: ''
    },
    cattleJson: {
      type: String,
      default: 'NA'
    }
  },
  data() {
    return {
      cattleDialogVisible: false,
      cattleInfo: {}
    };
  },
  created() {
    if (this.cattleJson) {
      try {
        this.cattleInfo = JSON.parse(this.cattleJson);
      } catch (e) {

      }
    }
  },
  methods: {
    getCattleInfo() {
      this.cattleDialogVisible = true;
      if (!this.cattleInfo.id) {
        getCattle(this.cattleCode).then(res => this.cattleInfo = res || {});
      }
    }
  }
};
</script>

<style scoped>
.cattle-el-row {
  margin: 10px 0;
  font-size: 20px;
}

.cattle-el-col-label {
  text-align: right;
  font-weight: bold;
}

.cattle-el-col-value {
  text-align: left;
}
</style>
