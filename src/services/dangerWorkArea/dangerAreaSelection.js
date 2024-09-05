import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'
import { serviceNameList1 } from '@/config/default/service.config'
// let danger = serviceNameList1['danger']

//推送危险作业区域数据
export const postSelectAreaApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/select/area`, params);

//获取场景树
export const postSenceCategoryTreeApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/sence/categoryTree`, params);

//危险作业区域查询
export const postSelectAreaQueryApi = params => get(`ziehs-safeManage/api/ehs/safe/danger/select/area/query`, params);

//危险作业区域更新
export const postSelectAreaUpdateApi = params => post(`ziehs-safeManage/api/ehs/safe/danger/select/area/update`, params);






