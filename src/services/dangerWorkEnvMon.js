import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'

// 作业环境监测-实时监测-列表数据-查询
export const getDangerWorkEnvMonRealTimeListApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/select/current/check`, params);
// 作业环境监测-history-列表数据-查询
export const getDangerWorkEnvMonHistoryListApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/select/history/check`, params);

// 作业环境监测-作业环境监测数据-列表数据-查询
export const getDangerWorkEnvMonDefaultListApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/select/history/single/check`, params);

// 作业环境监测-报警趋势-图表数据-查询
export const getDangerWorkEnvMonTrendDataApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/chart/list`, params);

export const getDangerWorkEnvMonSelectApi = params => get(`ziehs-safeManage/api/ehs/safe/danger/select/Date`, params);
// // 作业环境监测-查看-撤回作业
// export const revokeDangerWorkStaticItemApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/withdrawCreateUser`, params);
// // 作业环境监测-处理-关闭作业
// export const closeDangerWorkStaticItemApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/close`, params);
// // 作业环境监测-获取人员
// export const getDangerWorkStaticPeopleApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/getSecurityUserList`, params);
// // 作业环境监测-查看、处理-获取日志
// export const getDangerWorkStaticLogApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/getLog`, params);
// // 作业环境监测-处理-驳回
// export const rejectDangerWorkStaticApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/withdraw`, params);
// // 作业环境监测-处理-通过
// export const passDangerWorkStaticApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/handerInfo`, params);
// // 作业环境监测-处理-暂存
// export const stagingDangerWorkStaticApi = params => post(`${serviceNameList.safe}/api/ehs/safe/danger/handerInfo`, params);
