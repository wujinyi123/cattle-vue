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
import bus from '../common/bus';

export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-lx-home',
          index: 'dashboard',
          title: '系统首页'
        },
        {
          icon: 'el-icon-lx-home',
          index: 'baseInfoManage',
          title: '基础信息管理',
          subs: [
            {
              icon: 'el-icon-lx-home',
              index: 'employeeInfoManage',
              title: '员工档案管理',
            },
            {
              icon: 'el-icon-lx-home',
              index: 'cattleFarmInfoManage',
              title: '牛场信息管理',
              subs: [
                {
                  icon: 'el-icon-lx-home',
                  index: 'farmInfoManage',
                  title: '牧场基础信息'
                },
                {
                  icon: 'el-icon-lx-home',
                  index: 'farmZoneManage',
                  title: '牛舍分区管理'
                }
              ]
            },
            {
              icon: 'el-icon-lx-home',
              index: 'cattleInfoManage',
              title: '牛只档案管理',
            }
          ]
        },
        {
          icon: 'el-icon-lx-home',
          index: 'breedManage',
          title: '繁殖管理',
          subs: [
            {
              icon: 'el-icon-lx-home',
              index: 'breedRegister',
              title: '配种登记',
            },
            {
              icon: 'el-icon-lx-home',
              index: 'breedPregnancyCheck',
              title: '妊检登记',
            },
            {
              icon: 'el-icon-lx-home',
              index: 'breedPregnancyResult',
              title: '妊娠结果',
            }
          ]
        },
        {
          icon: 'el-icon-lx-home',
          index: 'dynamicInventoryManage',
          title: '动态库存管理',
          subs: [
            {
              icon: 'el-icon-lx-home',
              index: 'inInventoryManage',
              title: '入库管理',
            },
            {
              icon: 'el-icon-lx-home',
              index: 'outInventoryManage',
              title: '出库管理',
            }
          ]
        },
        {
          icon: 'el-icon-lx-home',
          index: 'healthDiseaseManage',
          title: '健康与疾病管理',
          subs: [
            {
              icon: 'el-icon-lx-home',
              index: 'diseaseMonitor',
              title: '疾病监控',
            },
            {
              icon: 'el-icon-lx-home',
              index: 'epidemicPreventionPlan',
              title: '防疫计划',
            }
          ]
        },
        {
          icon: 'el-icon-lx-home',
          index: 'intelligentStatisticsAnalysis',
          title: '智能统计与分析',
          subs: [
            {
              icon: 'el-icon-lx-home',
              index: 'realTimeBoard',
              title: '实时看板',
            },
            {
              icon: 'el-icon-lx-home',
              index: 'generateReport',
              title: '报表生成',
            }
          ]
        },
        // {
        //     icon: 'el-icon-lx-cascades',
        //     index: 'table',
        //     title: '基础表格'
        // },
        // {
        //     icon: 'el-icon-lx-copy',
        //     index: 'tabs',
        //     title: 'tab选项卡'
        // },
        // {
        //     icon: 'el-icon-lx-calendar',
        //     index: '3',
        //     title: '表单相关',
        //     subs: [
        //         {
        //             index: 'form',
        //             title: '基本表单'
        //         },
        //         {
        //             index: '3-2',
        //             title: '三级菜单',
        //             subs: [
        //                 {
        //                     index: 'editor',
        //                     title: '富文本编辑器'
        //                 },
        //                 {
        //                     index: 'markdown',
        //                     title: 'markdown编辑器'
        //                 }
        //             ]
        //         },
        //         {
        //             index: 'upload',
        //             title: '文件上传'
        //         }
        //     ]
        // },
        // {
        //     icon: 'el-icon-lx-emoji',
        //     index: 'icon',
        //     title: '自定义图标'
        // },
        // {
        //     icon: 'el-icon-pie-chart',
        //     index: 'charts',
        //     title: 'schart图表'
        // },
        // {
        //     icon: 'el-icon-rank',
        //     index: '6',
        //     title: '拖拽组件',
        //     subs: [
        //         {
        //             index: 'drag',
        //             title: '拖拽列表'
        //         },
        //         {
        //             index: 'dialog',
        //             title: '拖拽弹框'
        //         }
        //     ]
        // },
        // {
        //     icon: 'el-icon-lx-global',
        //     index: 'i18n',
        //     title: '国际化功能'
        // },
        // {
        //     icon: 'el-icon-lx-warn',
        //     index: '7',
        //     title: '错误处理',
        //     subs: [
        //         {
        //             index: 'permission',
        //             title: '权限测试'
        //         },
        //         {
        //             index: '404',
        //             title: '404页面'
        //         }
        //     ]
        // },
        // {
        //     icon: 'el-icon-lx-redpacket_fill',
        //     index: '/donate',
        //     title: '支持作者'
        // }
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
