import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'

// 平台-组织架构
export const getConsoleOrganizeList = params => post(`ziehs-sysManage/api/enterprise/dept/tree`, params);
// 平台-组织架构-一级一级的查
export const getConsoleOrganizeLazyLoadListApi = params => post(`ziehs-sysManage/api/lowpower/dept/step`, params);
// 平台-组织架构-根据id获取节点
export const getEmersionTreeDataApi = params => post(`${serviceNameList.customer}/api/lowpower/dept/upList`, params);

// 化学品安全提示卡-列表数据-查询
export const getChemicalIdentSafetyTipsListApi = params => post(`ziehs-safeManage/api/ehs/safe/remind/page/list`, params);
// 化学品安全提示卡-新增
export const addChemicalIdentSafetyTipsApi = params => post(`ziehs-safeManage/api/ehs/safe/remind/add`, params);
// 化学品安全提示卡-详情
export const getChemicalIdentSafetyTipsAddDetailApi = params => get(`ziehs-safeManage/api/ehs/safe/remind/detail`, params);
// 化学品安全提示卡-编辑
export const changeChemicalIdentSafetyTipsApi = params => post(`ziehs-safeManage/api/ehs/safe/remind/update`, params);
// 化学品安全提示卡-列表数据-删除
export const rmChemicalIdentSafetyTipsItemApi = params => get(`ziehs-safeManage/api/ehs/safe/remind/delete`, params);

// 化学品安全标识-列表数据-查询
export const getChemicalIdentSafetySignsListApi = params => post(`ziehs-safeManage/api/ehs/chemical/safe/label/page/list`, params);
// 化学品安全标识-新增
export const addChemicalIdentSafetySignsApi = params => post(`ziehs-safeManage/api/ehs/chemical/safe/label/save`, params);
// 化学品安全标识-详情
export const getChemicalIdentSafetySignsAddDetailApi = params => post(`ziehs-safeManage/api/ehs/chemical/safe/label/detail`, params);
// 化学品安全标识-编辑
export const changeChemicalIdentSafetySignsApi = params => post(`ziehs-safeManage/api/ehs/chemical/safe/label/update`, params);
// 化学品安全标识-列表数据-删除
export const rmChemicalIdentSafetySignsItemApi = params => post(`ziehs-safeManage/api/ehs/chemical/safe/label/delete`, params);

// 临时化学品入厂-列表数据-查询
export const getTransientChemicalsListApi = params => post(`ziehs-safeManage/api/ehs/temporary/factory/page/list`, params);
// 临时化学品入厂-新增
export const addTransientChemicalsApi = params => post(`ziehs-safeManage/api/ehs/temporary/factory/add`, params);
// 临时化学品入厂-详情
export const getTransientChemicalsAddDetailApi = params => get(`ziehs-safeManage/api/ehs/temporary/factory/detail`, params);
// 临时化学品入厂-编辑
export const changeTransientChemicalsApi = params => post(`ziehs-safeManage/api/ehs/temporary/factory/update`, params);
// 临时化学品入厂-列表数据-删除
export const rmTransientChemicalsItemApi = params => get(`ziehs-safeManage/api/ehs/temporary/factory/delete`, params);
// 临时化学品入厂-标签列表
export const getTransientChemicalsTagApi = params => get(`ziehs-safeManage/api/ehs/temporary/factory/getLabel`, params);
// 临时化学品入厂-进出厂记录
export const getTransientChemicalsNoteApi = params => get(`ziehs-safeManage/api/ehs/temporary/factory/factory/list`, params);
// 临时化学品入厂-处理-驳回
export const transientChemicalsHandleRejectApi = params => post(`ziehs-safeManage/api/ehs/temporary/factory/rejection`, params);
// 临时化学品入厂-处理-通过
export const transientChemicalsHandlePassApi = params => post(`ziehs-safeManage/api/ehs/temporary/factory/approval`, params);
// 临时化学品入厂-处理-最后一个节点-归档
export const transientChemicalsHandleSaveFilingApi = params => post(`ziehs-safeManage/api/ehs/temporary/factory/saveFiling`, params);


// PPE库存管理-列表数据-查询
export const getPpeDepositoryListApi = params => post(`ziehs-workHealth/api/ehs/ppe/inventory/page/list`, params);
// PPE库存管理-列表数据-查询-无分页
export const getPpeDepositoryListNoPageApi = params => post(`ziehs-workHealth/api/ehs/ppe/inventory/list`, params);
// PPE库存管理-新增
export const addPpeDepositoryApi = params => post(`ziehs-workHealth/api/ehs/ppe/inventory/add`, params);
// PPE库存管理-详情
export const getPpeDepositoryDetailApi = params => post(`ziehs-workHealth/api/ehs/chemical/safe/label/detail`, params);
// PPE库存管理-编辑
export const changePpeDepositoryApi = params => post(`ziehs-workHealth/api/ehs/ppe/inventory/edit`, params);
// PPE库存管理-列表数据-删除
export const rmPpeDepositoryItemApi = params => post(`ziehs-workHealth/api/ehs/ppe/inventory/delete`, params);
// PPE库存管理-列表数据-导出
export const exportPpeDepositoryApi = params => postExcel(`ziehs-workHealth/api/ehs/ppe/inventory/download`, params);

// PPE职业健康流程审批获取人员
export const ppeSelectNodeUser = params => post(`ziehs-workHealth/api/chemical/user/selectNodeUser`, params);
// PPE-获取审批日志
export const getFlowLogApi = params => post(`ziehs-workHealth/api/ehs/flow/getTaskComments`, params);

// PPE领用管理-列表数据-查询
export const getPpeClaimListApi = params => post(`ziehs-workHealth/api/ehs/ppe/receive/page/list`, params);
// PPE领用管理-列表数据-查询-无分页
export const getPpeClaimLisNoPagetApi = params => post(`ziehs-workHealth/api/ehs/ppe/receive/list`, params);
// PPE领用管理-新增
export const addPpeClaimApi = params => post(`ziehs-workHealth/api/ehs/ppe/receive/add`, params);
// PPE领用管理-详情
export const getPpeClaimDetailApi = params => post(`ziehs-workHealth/api/ehs/ppe/receive/detail`, params);
// PPE领用管理-编辑
export const changePpeClaimApi = params => post(`ziehs-workHealth/api/ehs/ppe/receive/edit`, params);
// PPE领用管理-列表数据-删除
export const rmPpeClaimItemApi = params => post(`ziehs-workHealth/api/ehs/ppe/receive/delete`, params);
// PPE领用管理-列表数据-导出
export const exportPpeClaimApi = params => postExcel(`ziehs-workHealth/api/ehs/ppe/receive/download`, params);
// PPE领用管理-处理-驳回
export const ppeClaimHandleRejectApi = params => post(`ziehs-workHealth/api/ehs/ppe/receive/rejected`, params);
// PPE领用管理-处理-通过
export const ppeClaimHandlePassApi = params => post(`ziehs-workHealth/api/ehs/ppe/receive/approval`, params);
// PPE领用管理-处理-最后一个节点-归档
export const ppeClaimHandleSaveFilingApi = params => post(`ziehs-workHealth/api/ehs/ppe/receive/archive`, params);



// PPE报废管理-列表数据-查询
export const getPpeStockListApi = params => post(`ziehs-workHealth/api/ehs/ppe/scrap/page/list`, params);
// PPE报废管理-新增
export const addPpeStockApi = params => post(`ziehs-workHealth/api/ehs/ppe/scrap/add`, params);
// PPE报废管理-详情
export const getPpeStockDetailApi = params => post(`ziehs-workHealth/api/ehs/ppe/scrap/detail`, params);
// PPE报废管理-编辑
export const changePpeStockApi = params => post(`ziehs-workHealth/api/ehs/ppe/scrap/edit`, params);
// PPE报废管理-列表数据-删除
export const rmPpeStockItemApi = params => post(`ziehs-workHealth/api/ehs/ppe/scrap/delete`, params);
// PPE报废管理-列表数据-导出
export const exportPpeStockApi = params => postExcel(`ziehs-workHealth/api/ehs/ppe/scrap/download`, params);
// PPE报废管理-处理-驳回
export const ppeStockHandleRejectApi = params => post(`ziehs-workHealth/api/ehs/ppe/scrap/rejected`, params);
// PPE报废管理-处理-通过
export const ppeStockHandlePassApi = params => post(`ziehs-workHealth/api/ehs/ppe/scrap/approval`, params);
// PPE报废管理-处理-最后一个节点-归档
export const ppeStockHandleSaveFilingApi = params => post(`ziehs-workHealth/api/ehs/ppe/scrap/archive`, params);