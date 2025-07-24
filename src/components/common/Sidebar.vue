<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                >{{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
              >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '@/components/common/bus';

export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-lx-home',
          index: 'home',
          title: '系统首页'
        },
        {
          icon: 'el-icon-notebook-2',
          index: 'baseInfoManage',
          title: '基础信息管理',
          subs: [
            {
              index: 'farmInfoManage',
              title: '牧场基础信息'
            },
            {
              index: 'farmZoneManage',
              title: '牛舍分区管理'
            },
            {
              index: 'sysJob',
              title: '岗位信息配置'
            },
            {
              index: 'employeeInfoManage',
              title: '员工档案管理',
            },
            {
              index: 'sysConfig',
              title: '系统配置管理',
            },
            {
              index: 'cattleInfoManage',
              title: '牛只档案管理',
            }
          ]
        },
        {
          icon: 'el-icon-female',
          index: 'breedManage',
          title: '繁殖管理',
          subs: [
            {
              index: 'breedRegister',
              title: '配种登记',
            },
            {
              index: 'breedPregnancyCheck',
              title: '妊检登记',
            },
            {
              index: 'breedPregnancyResult',
              title: '产犊登记',
            }
          ]
        },
        {
          icon: 'el-icon-s-data',
          index: 'dynamicInventoryManage',
          title: '动态库存管理',
          subs: [
            {
              index: 'cattleTransfer',
              title: '转场管理',
            },
            {
              index: 'inventoryBuy',
              title: '外购牛只登记',
            },
            {
              index: 'inventorySell',
              title: '出售记录',
            },
            {
              index: 'inventoryDeath',
              title: '死亡登记',
            }
          ]
        },
        {
          icon: 'el-icon-s-cooperation',
          index: 'healthDiseaseManage',
          title: '健康与疾病管理',
          subs: [
            {
              index: 'diseaseMonitor',
              title: '疾病监控',
            },
            {
              index: 'epidemicPreventionPlan',
              title: '防疫计划',
            }
          ]
        },
        {
          icon: 'el-icon-data-analysis',
          index: 'intelligentStatisticsAnalysis',
          title: '智能统计与分析',
          subs: [
            {
              index: 'realTimeBoard',
              title: '实时看板',
            },
            {
              index: 'generateReport',
              title: '报表生成',
            }
          ]
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
