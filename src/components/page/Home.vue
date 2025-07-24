<template>
  <div>
    <div class="container">
      <div style="font-size: 35px;font-family: 'lx-iconfont',serif;margin-bottom: 30px;">
        <span>
          您好，{{ currentUsername }}！欢迎使用牛只管理系统
        </span>
        <span v-if="hasHelpFile">
          <a :href="helpFileUrl" target="_blank">
            <el-link type="primary" :underline="false" @click="getCattleInfo">下载帮助文档</el-link>
          </a>
        </span>
        <span style="float:right;font-size: 20px">
          <span
              v-if="cattleTransferNum.todo+cattleTransferNum.myCreate>0"
              class="blinking-text">
            转场流程审批：
          </span>
          <span v-if="cattleTransferNum.todo>0">
            待我审批：
            <el-link type="primary" style="font-size: 23px" @click="gotoCattleTransfer('todo')">{{ cattleTransferNum.todo }}</el-link>
          </span>
          <span v-if="cattleTransferNum.myCreate>0" style="margin-left: 15px">
            我的创建的流程：
            <el-link type="primary" style="font-size: 23px" @click="gotoCattleTransfer('myCreate')">{{ cattleTransferNum.myCreate }}</el-link>
          </span>
        </span>
      </div>
      <el-card shadow="hover">
        <schart style="height: 300px" ref="bar" class="schart" canvasId="farmBar" :options="farmCattleStat"></schart>
      </el-card>
      <el-card shadow="hover">
        <schart style="height: 300px" ref="bar" class="schart" canvasId="farmZoneBar" :options="farmZoneCattleStat"></schart>
      </el-card>
    </div>
  </div>
</template>

<script>
import {homeStat} from "@/api/stat";
import {hasHelpFile} from "@/api/common"
import {getCattleTransferNum} from '@/api/cattle'
import Schart from "vue-schart";

export default {
  name: 'Home',
  components: {
    Schart
  },
  data() {
    return {
      currentUsername: this.$store.state.user.userInfo.username,
      cattleTransferNum: {myCreate: 0, todo: 0},
      hasHelpFile: false,
      helpFileUrl: '/api/common/downloadHelpFile',
      farmCattleStat: {
        type: 'bar',
        title: {
          text: '前十牧场'
        },
        xRorate: 25,
        labels: [],
        datasets: []
      },
      farmZoneCattleStat: {
        type: 'bar',
        title: {
          text: '当前牧场前十圈舍编号'
        },
        xRorate: 25,
        labels: [],
        datasets: []
      }
    };
  },
  created() {
    getCattleTransferNum().then(res => this.cattleTransferNum = res);
    hasHelpFile().then(res => this.hasHelpFile = res);
    homeStat(this.$store.state.user.currentFarmCode).then(res => {
      this.farmCattleStat.labels = res.farmCattleList.map(item => item.label);
      this.farmCattleStat.datasets = [{
        label: '牛只数',
        data: res.farmCattleList.map(item => item.intValue)
      }];
      this.farmZoneCattleStat.labels = res.farmZoneCattleList.map(item => item.label);
      this.farmZoneCattleStat.datasets = [{
        label: '牛只数',
        data: res.farmZoneCattleList.map(item => item.intValue)
      }];
    });
  },
  methods: {
    gotoCattleTransfer(type) {
      const query = {status: '进行中'};
      if (type === 'todo') {
        query.approver = this.currentUsername;
      } else {
        query.submitUser = this.currentUsername;
      }
      this.$router.push({path: '/cattleTransfer', query});
    }
  }
};
</script>

<style scoped>
.blinking-text {
  /* 定义动画名称为blink-and-change-color，动画时长为2秒，动画无限循环播放，动画速度曲线为线性 */
  animation: blink-and-change-color 2s infinite linear;
}

@keyframes blink-and-change-color {
  /* 动画开始时的状态，文字完全显示，颜色为红色 */
  0% {
    opacity: 1;
    color: red;
  }
  /* 动画结束时的状态，文字完全显示，颜色为红色 */
  100% {
    opacity: 1;
    color: yellow;
  }
}
</style>
