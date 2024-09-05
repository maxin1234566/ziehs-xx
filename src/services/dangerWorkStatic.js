import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'

// 危险作业台账-列表数据-查询
export const getDangerWorkStaticListApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/select`, params);
// 危险作业台账-新增
export const addDangerWorkStaticApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/save`, params);
// 危险作业台账-详情
export const getDangerWorkStaticDetailApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/selectDetail`, params);
// 危险作业台账-编辑
export const editDangerWorkStaticApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/update`, params);
// 危险作业台账-列表数据-删除
export const rmDangerWorkStaticItemApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/delete`, params);
// 危险作业台账-列表数据-导出
export const exportDangerWorkStaticApi = params => postExcel(`ziehs-safeManage/api/ehs/safe/danger/export`, params);

// 危险作业台账-查看-撤回作业
export const revokeDangerWorkStaticItemApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/withdrawCreateUser`, params);
// 危险作业台账-处理-关闭作业
export const closeDangerWorkStaticItemApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/close`, params);
// 危险作业台账-获取人员
export const getDangerWorkStaticPeopleApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/getSecurityUserList`, params);
// 危险作业台账-查看、处理-获取日志
export const getDangerWorkStaticLogApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/getLog`, params);
// 危险作业台账-处理-驳回
export const rejectDangerWorkStaticApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/withdraw`, params);
// 危险作业台账-处理-通过
export const passDangerWorkStaticApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/handerInfo`, params);
// 危险作业台账-处理-暂存
export const stagingDangerWorkStaticApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/handerInfo`, params);

// 危险作业台账-处理-获取关联设备list-分页
export const getDangerWorkStaticDeviceListApi = params => post(`ziehs-safeManage/api/device/dict/page/list`, params);
// 危险作业台账-处理-获取关联设备list-无分页
export const getDangerWorkStaticDeviceListNoPageApi = params => get(`ziehs-safeManage/api/device/dict/list`, params);

export const getMonitorSelectBind = params => post(`ziehs-safeManage/api/ehs/safe/monitor/device/selectBind`, params);

export const getMonitorSelect = params => post(`ziehs-safeManage/api/ehs/safe/monitor/device/select`, params);

export const getMonitorBindTime = params => post(`ziehs-safeManage/api/ehs/safe/monitor/device/bindTime`, params);

export const getMonitorUpdate = params => post(`ziehs-safeManage/api/ehs/safe/monitor/device/update`, params);

export const getMonitorUnbind = params => post(`ziehs-safeManage/api/ehs/safe/monitor/device/unbind`, params);

export const getMonitorDelete = params => post(`ziehs-safeManage/api/ehs/safe/monitor/device/delete`, params);