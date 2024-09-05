// 全局后台API服务映射表
const serviceNameList = {
  auth: process.env.VUE_APP_AUTH,
  btp: process.env.VUE_APP_BTP,
  btp_corrse: process.env.VUE_APP_BTP_COURSE,
  message: process.env.VUE_APP_MESSAGE,
  btpFile: process.env.VUE_APP_BTNFILE,

  auth: process.env.VUE_APP_AUTH,
  camunda: process.env.VUE_APP_CAMUNDA,
  connector: process.env.VUE_APP_CONNECTOR,
  ehsIntegratedManagement: process.env.VUE_APP_EHSINTEGRATEDMANAGEMENT,
  environmentalManagement: process.env.VUE_APP_ENVIRONMENTALMANAGEMENT,
  gateway: process.env.VUE_APP_GATEWAY,
  message: process.env.VUE_APP_MESSAGE,
  occupationalHealthManagement: process.env.VUE_APP_OCCUPATIONALHEALTHMANAGEMENT,
  safeManagement: process.env.VUE_APP_SAFEMANAGEMENT,
  sync: process.env.VUE_APP_SYNC,
  systemManagement: process.env.VUE_APP_SYSTEMMANAGEMENT,
  task: process.env.VUE_APP_TASK
}

window.serviceName = serviceNameList;

export default serviceNameList;