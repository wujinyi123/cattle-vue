<template>
  <div>
    <div class="container">
      <div style="font-size: 35px;font-family: 'lx-iconfont',serif;margin-bottom: 30px;">
        <span>
          您好，{{ $store.state.user.userInfo.username }}！欢迎使用牛只管理系统
        </span>
        <span v-if="hasHelpFile">
          <a :href="helpFileUrl" target="_blank">
            <el-link type="primary" :underline="false" @click="getCattleInfo">下载帮助文档</el-link>
          </a>
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
import Schart from "vue-schart";

export default {
  name: 'Home',
  components: {
    Schart
  },
  data() {
    return {
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
  methods: {}
};
</script>

<style scoped>

</style>
