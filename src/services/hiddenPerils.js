import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config'
let front = serviceNameList['safe']
let customer = serviceNameList['customer']

//隐患排查台账模块：
//隐患分页列表
export const GethiddenPerilsList = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/page/list', params);
//隐患删除
export const DelhiddenPerilsList = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/delete', params);
//隐患新增
export const AddhiddenPerilsList = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/add', params);
//隐患编辑
export const UpdatehiddenPerilsList = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/update', params);
//隐患详情
export const DetailhiddenPerilsList = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/detail', params);
//延期申请，处理等多个接口
export const DelayhiddenPerilsList = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/handerInfo', params);
//获取下级审批人
export const GetHiddenNextPeople = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/find/now/handle', params);
//撤回、驳回
export const BackhiddenPerilsList = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/withdraw', params);
//延期通过驳回
export const PassOrBackhiddenPerils = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/delay', params);
//批量导出
export const ExportHiddenList = params => postExcel('ziehs-safeManage' + '/api/ehs/safe/hide/danger/download', params);
//操作日志
export const HiddenLogList = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/getLog', params);
//导入
export const ImportHidden = params => post('ziehs-safeManage' + '/api/ehs/safe/hide/danger/upload', params);
//获取主部门id和name
export const GetParentResponsibilityDept = params => post('ziehs-sysManage/api/enterprise/dept/getAdminDeptId', params);
