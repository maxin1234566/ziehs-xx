
// 隐患排查管理-数据统计分析
export const hiddenPerilsDA = [
  {
    path: 'hiddenPerilsDA',
    name: '数据统计分析',
    meta: {
      title: '数据统计分析',
      routerCode:'hiddenPerilsDA',
      isPage: true,
    },
    component: resolve => require(['@/pages/hiddenPerils/dataAnalysis/index.vue'], resolve),
  },
]
const dataAnalysis = [
  ...hiddenPerilsDA,
]
export const dataAnalysisMap = dataAnalysis.reduce((prev, item) => {
  const { name, meta, component } = item
  prev[item.path] = {
    name,
    meta,
    component
  }
  return prev
}, {})
