<template>
  <div>
    <div class="container">
      <div style="font-size: 35px;font-family: 'lx-iconfont',serif;margin-bottom: 30px;">
        您好，{{$store.state.user.userInfo.username}}！欢迎使用牛只管理系统
      </div>
      <el-card shadow="hover">
        <schart style="height: 300px" ref="bar" class="schart" canvasId="bar" :options="farmCattleStat"></schart>
      </el-card>
    </div>
  </div>
</template>

<script>
import {homeStat} from "@/api/stat";
import Schart from "vue-schart";

export default {
  name: 'Home',
  components: {
    Schart
  },
  data() {
    return {
      farmCattleStat: {
        type: 'bar',
        title: {
          text: '前十牧场'
        },
        xRorate: 25,
        labels: [],
        datasets: []
      }
    };
  },
  created() {
    homeStat().then(res => {
      this.farmCattleStat.labels = res.farmCattleList.map(item=>item.label);
      this.farmCattleStat.datasets = [{
        label:'牛只数',
        data:res.farmCattleList.map(item=>item.intValue)
      }];
    });
  },
  methods: {}
};
</script>

<style scoped>

</style>
