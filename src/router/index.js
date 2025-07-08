import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            component: () => import('@/components/common/Home.vue'),
            meta: {title: '自述文件'},
            children: [
                {
                    path: '/dashboard',
                    component: () => import('@/components/page/Dashboard.vue'),
                    meta: {title: '首页'}
                },
                {
                    path: '/home',
                    component: () => import('@/components/page/Home.vue'),
                    meta: {title: '系统首页'}
                },
                {
                    path: '/personalCenter',
                    component: () => import('@/components/page/baseInfoManage/PersonalCenter.vue'),
                    meta: {title: '个人中心'}
                },
                {
                    path: '/sysConfig',
                    component: () => import('@/components/page/baseInfoManage/SysConfig.vue'),
                    meta: {title: '系统配置'}
                },
                {
                    path: '/employeeInfoManage',
                    component: () => import('@/components/page/baseInfoManage/EmployeeInfoManage.vue'),
                    meta: {title: '员工档案管理'}
                },
                {
                    path: '/farmInfoManage',
                    component: () => import('@/components/page/baseInfoManage/cattleFarmInfoManage/FarmInfoManage.vue'),
                    meta: {title: '牧场基础信息'}
                },
                {
                    path: '/farmZoneManage',
                    component: () => import('@/components/page/baseInfoManage/cattleFarmInfoManage/FarmZoneManage.vue'),
                    meta: {title: '牛舍分区管理'}
                },
                {
                    path: '/cattleInfoManage',
                    component: () => import('@/components/page/baseInfoManage/CattleInfoManage.vue'),
                    meta: {title: '牛只档案管理'}
                },
                {
                    path: '/breedRegister',
                    component: () => import('@/components/page/breedManage/BreedRegister.vue'),
                    meta: {title: '配种登记'}
                },
                {
                    path: '/breedPregnancyCheck',
                    component: () => import('@/components/page/breedManage/BreedPregnancyCheck.vue'),
                    meta: {title: '妊检登记'}
                },
                {
                    path: '/breedPregnancyResult',
                    component: () => import('@/components/page/breedManage/BreedPregnancyResult.vue'),
                    meta: {title: '产犊登记'}
                },
                {
                    path: '/inventoryBuy',
                    component: () => import('@/components/page/dynamicInventoryManage/InventoryBuy.vue'),
                    meta: {title: '外购牛只登记'}
                },
                {
                    path: '/inventorySell',
                    component: () => import('@/components/page/dynamicInventoryManage/InventorySell.vue'),
                    meta: {title: '出售记录'}
                },
                {
                    path: '/inventoryDeath',
                    component: () => import('@/components/page/dynamicInventoryManage/InventoryDeath.vue'),
                    meta: {title: '死亡登记'}
                },
                {
                    path: '/diseaseMonitor',
                    component: () => import('@/components/page/healthDiseaseManage/diseaseMonitor.vue'),
                    meta: {title: '疾病监控'}
                },
                {
                    path: '/epidemicPreventionPlan',
                    component: () => import('@/components/page/healthDiseaseManage/epidemicPreventionPlan.vue'),
                    meta: {title: '防疫计划'}
                },
                {
                    path: '/realTimeBoard',
                    component: () => import('@/components/page/intelligentStatisticsAnalysis/realTimeBoard.vue'),
                    meta: {title: '实时看板'}
                },
                {
                    path: '/generateReport',
                    component: () => import('@/components/page/intelligentStatisticsAnalysis/generateReport.vue'),
                    meta: {title: '报表生成'}
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '@/components/page/Icon.vue'),
                    meta: {title: '自定义图标'}
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '@/components/page/BaseTable.vue'),
                    meta: {title: '基础表格'}
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '@/components/page/Tabs.vue'),
                    meta: {title: 'tab选项卡'}
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '@/components/page/BaseForm.vue'),
                    meta: {title: '基本表单'}
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '@/components/page/VueEditor.vue'),
                    meta: {title: '富文本编辑器'}
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '@/components/page/Markdown.vue'),
                    meta: {title: 'markdown编辑器'}
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '@/components/page/Upload.vue'),
                    meta: {title: '文件上传'}
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '@/components/page/BaseCharts.vue'),
                    meta: {title: 'schart图表'}
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '@/components/page/DragList.vue'),
                    meta: {title: '拖拽列表'}
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '@/components/page/DragDialog.vue'),
                    meta: {title: '拖拽弹框'}
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '@/components/page/I18n.vue'),
                    meta: {title: '国际化'}
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '@/components/page/Permission.vue'),
                    meta: {title: '权限测试', permission: true}
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '@/components/page/404.vue'),
                    meta: {title: '404'}
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/403.vue'),
                    meta: {title: '403'}
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '@/components/page/Donate.vue'),
                    meta: {title: '支持作者'}
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '@/components/page/Login.vue'),
            meta: {title: '登录'}
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
