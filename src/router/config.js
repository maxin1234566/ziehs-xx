// 有面包屑、有padding、有背景 的父级盒子
import PageView from '@/layouts/PageView'
// 无面包屑、无padding、有背景 的父级盒子 
import NoBreadcrumb from '@/layouts/NoBreadcrumb'
// 无面包屑、无padding、无背景 的父级盒子 
import NoBreadcrumbNoBg from '@/layouts/NoBreadcrumbNoBg'
import {
  dangerSource
} from './children/dangerSource'
import {
  hiddenPerils
} from './children/hiddenPerils'
// import { getDictTree } from '@/services/api'
import {
  hiddenPerilsDA,
} from './children/dataAnalysis/dataAnalysis.js'
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}
console.log(process.env.NODE_ENV)

// 路由配置
const options = {
  routes: [{
      path: '/login',
      name: '登录页',
      component: resolve => require(['@/pages/login'], resolve)
    },
    {
      path: '*',
      name: 'blankPage',
      component: resolve => require(['@/pages/exception/blankPage'], resolve)
    },
    {
      path: '/404',
      name: '404',
      component: resolve => require(['@/pages/exception/404'], resolve)
    },
    {
      path: '/403',
      name: '403',
      component: resolve => require(['@/pages/exception/403'], resolve)
    },
    {
      path: '/',
      name: '登录',
      component: view.tabs,
      meta: {
        // title: '首页管理',
        isPage: true,
      },
      redirect: process.env.NODE_ENV == "development" ? '/login' : '/overview/preview',
      children: [{
          path: 'overview',
          name: '总览',
          meta: {
            title: '总览',
            isPage: false,
            icon: 'icon-zonglanhuise',
          },
          component: NoBreadcrumbNoBg,
          children: [{
            path: 'preview',
            name: '首页',
            meta: {
              title: '首页',
              isPage: true,
            },
            component: resolve => require(['@/pages/preview'], resolve),
          }, ]
        },
        {
          path: 'safeManage',
          name: '安全管理',
          meta: {
            title: '安全管理',
            icon: 'svg-icon-secutiry',
          },
          component: PageView,
          children: [{
            path: 'dualControlManage',
            name: '双控管理',
            meta: {
              title: '双控管理',
              icon: 'none',
            },
            isPage: false,
            component: NoBreadcrumb,
            children: [{
                path: 'riskManage',
                name: '风险管理',
                meta: {
                  title: '风险管理',
                  icon: 'none',
                },
                isPage: false,
                component: NoBreadcrumb,
                children: [
                  ...dangerSource,
                ]
              },
              {
                path: 'hiddenPerils',
                name: '隐患排查管理',
                meta: {
                  title: '隐患排查管理',
                  icon: 'none',
                  isPage: false,
                },
                component: NoBreadcrumb,
                children: [
                  ...hiddenPerils,
                  ...hiddenPerilsDA,
                ]
              },
            ]
          }, ]
        },
        {
          path: 'ehsGerneralManage',
          name: 'EHS综合管理',
          meta: {
            title: 'EHS综合管理',
            icon: 'ehs-total-manage-icon',
          },
          component: PageView,
          children: [{
            path: 'educationmanagement',
            name: '教育培训管理',
            meta: {
              title: '教育培训管理',
              icon: 'none',
            },
            component: NoBreadcrumb,
            children: [{
                path: 'subjectmanagement',
                name: '科目管理',
                meta: {
                  title: '科目管理',
                  routerCode: 'subjectmanagement',
                  isKeepalive: true,
                  isPage: true,
                },
                component: resolve => require(['@/pages/resourcepool/subjectmanagement/index.vue'], resolve),
                children: []
              },
              {
                path: 'instructormanagement',
                name: '讲师管理',
                meta: {
                  title: '讲师管理',
                  routerCode: 'instructormanagement',
                  isPage: true,
                },
                component: resolve => require(['@/pages/resourcepool/instructormanagement/index.vue'], resolve),
              },
              {
                path: 'coursewaremanagement',
                name: '课件管理',
                meta: {
                  title: '课件管理',
                  routerCode: 'coursewaremanagement',
                  isPage: true,
                },
                component: resolve => require(['@/pages/resourcepool/coursewaremanagement/index.vue'], resolve),
              },
              {
                path: 'questionbankmanagement',
                name: '题库管理',
                meta: {
                  title: '题库管理',
                  routerCode: 'questionbankmanagement',
                  isKeepalive: true,
                  isPage: true,
                },
                component: resolve => require(['@/pages/resourcepool/questionbankmanagement/index.vue'], resolve),
              },
              {
                path: 'questionbankManagementAOC',
                name: '题库新增编辑',
                meta: {
                  title: '新建编辑',
                  routerCode: 'questionbankmanagement',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/resourcepool/questionbankmanagement/questionbankManagementAOC'], resolve)
              },
              {
                path: 'examinationPaper',
                name: '试卷管理',
                meta: {
                  title: '试卷管理',
                  routerCode: 'examinationPaper',
                  isKeepalive: true,
                  isPage: false,
                },
                component: resolve => require(['@/pages/resourcepool/examinationPaper'], resolve),
              },
              {
                path: 'examinationLook',
                name: '查看试卷',
                meta: {
                  title: '查看试卷',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/resourcepool/examinationPaper/examinationPaperLook'], resolve),
              },
              {
                path: 'examinationAOCOne',
                name: '试卷新增编辑',
                meta: {
                  title: '新增编辑',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/resourcepool/examinationPaper/examinationAOCOne'], resolve),
              },
              {
                path: 'examinationAOCTwo',
                name: '新增编辑',
                meta: {
                  title: '新增编辑',
                  invisible: true,
                },
                component: resolve => require(['@/pages/resourcepool/examinationPaper/examinationAOCTwo'], resolve),
              },
              {
                path: 'subjectContent',
                name: '内容管理',
                meta: {
                  title: '内容管理',
                  routerCode: 'subjectmanagement',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/resourcepool/subjectmanagement/subjectContent/index.vue'], resolve),
              },
              {
                path: 'coursemanagement',
                name: '课程管理',
                meta: {
                  title: '课程管理',
                  routerCode: 'coursemanagement',
                  isKeepalive: true,
                  isPage: true,
                },
                component: resolve => require(['@/pages/courseManagement/index.vue'], resolve),
              },
              {
                path: 'candidateFile',
                name: '考生档案',
                meta: {
                  title: '考生档案',
                  routerCode: 'candidateFile',
                  isKeepalive: true,
                  isPage: true,
                },
                component: resolve => require(['@/pages/educationmanagement/candidateFile/index.vue'], resolve),
              },
              {
                path: 'fileDetail',
                name: '考生档案详情',
                meta: {
                  title: '考生档案详情',
                  routerCode: 'candidateFile',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/educationmanagement/candidateFile/fileDetail/index.vue'], resolve),
              },
              {
                path: 'filePreview',
                name: '考生档案预览试卷',
                meta: {
                  title: '预览试卷',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/educationmanagement/candidateFile/filePreview/index.vue'], resolve),
              },
              {
                path: 'myCourseTest',
                name: '我的课程考试',
                meta: {
                  title: '我的课程考试',
                  routerCode: 'myCourseTest',
                  isKeepalive: true,
                  isPage: true,
                },
                component: resolve => require(['@/pages/educationmanagement/myCourseTest/index.vue'], resolve),
              },
              {
                path: 'myCourseDetail',
                name: '我的课程考试详情',
                meta: {
                  title: '课程详情',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/educationmanagement/myCourseTest/myCourseDetail/index.vue'], resolve),
              },
              {
                path: 'myCourseStudy',
                name: '我的课程课程学习',
                meta: {
                  title: '课程学习',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/educationmanagement/myCourseTest/myCourseStudy/index.vue'], resolve),
              },
              {
                path: 'myExamIng',
                name: '我的课程考试中',
                meta: {
                  title: '考试中',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/educationmanagement/myCourseTest/myExamIng/index.vue'], resolve),
              },
              {
                path: 'myExamResult',
                name: '我的课程考试结果',
                meta: {
                  title: '考试结果',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/educationmanagement/myCourseTest/myExamResult/index.vue'], resolve),
              },
              {
                path: 'myExamDetail',
                name: '我的课程考试答题详情',
                meta: {
                  title: '答题详情',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/educationmanagement/myCourseTest/myExamDetail/index.vue'], resolve),
              },
              {
                path: 'testManagement',
                name: '考试管理',
                meta: {
                  title: '考试管理',
                  routerCode: 'testManagement',
                  isKeepalive: true,
                  isPage: true,
                },
                component: resolve => require(['@/pages/testManagement/index.vue'], resolve),
              },
              {
                path: 'testManagementOne',
                name: '新增考试',
                meta: {
                  title: '新增考试',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/testManagement/testManagementOne/index.vue'], resolve),
              },
              {
                path: 'detailTestManagement',
                name: '查看考试',
                meta: {
                  title: '查看考试',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/testManagement/detailTestManagement.vue'], resolve),
              },
              {
                path: 'addcourse',
                name: '新建课程',
                meta: {
                  title: '新建课程',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/courseManagement/addCourse.vue'], resolve),
              },
              {
                path: 'editscourse',
                name: '编辑课程',
                meta: {
                  title: '编辑课程',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/courseManagement/addCourse.vue'], resolve),
              },
              {
                path: 'detailcourse',
                name: '查看课程',
                meta: {
                  title: '查看课程',
                  isPage: true,
                  invisible: true,
                },
                component: resolve => require(['@/pages/courseManagement/detailCourse.vue'], resolve),
              },
            ]
          }, ]
        },
        {
          path: 'systemManagement',
          name: '系统管理',
          meta: {
            title: '系统管理',
            icon: 'system-icon',
          },
          component: PageView,
          children: [{
              path: 'dictionary',
              name: '字典管理',
              meta: {
                title: '字典管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/authority/dictionary'], resolve),
            },
            {
              path: 'labelManagement',
              name: '标签组管理',
              meta: {
                title: '标签组管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/labelManagement/index.vue'], resolve),
            },
            {
              path: 'business',
              name: '业务组织管理',
              meta: {
                title: '业务组织管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/business/index.vue'], resolve),
            },
            {
              path: 'department',
              name: '部门管理',
              meta: {
                title: '部门管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/department/department.vue'], resolve),
            },
            {
              path: 'role',
              name: '角色管理',
              meta: {
                title: '角色管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/appAuthRole/appAuthRole.vue'], resolve),
            },
            {
              path: 'user',
              name: '用户管理',
              meta: {
                title: '用户管理',
                isPage: true,
              },
              component: resolve => require(['@/pages/system/user/user.vue'], resolve),
            },
            {
              path: 'holiday',
              name: '节假日配置',
              meta: {
                title: '节假日配置',
                isPage: true,
              },
              component: resolve => require(['@/pages/holiday'], resolve),
            },
            {
              path: 'menuDataPermission',
              name: '菜单数据权限',
              meta: {
                title: '菜单数据权限',
                isPage: true,
              },
              component: resolve => require(['@/pages/menuDataPermission/index.vue'], resolve)
            },
          ]
        },
      ]
    }
  ]
}

export default options