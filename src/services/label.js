//自定义字段接口文件
import {get,post} from '@/utils/request.js'; 
import serviceNameList from '@/config/default/service.config'

//获取标签组列表
export const GetLabelPageList = params => post(`ziehs-sysManage/api/label/page/list`, params);

//新增标签组ziehs-systemManagement
export const AddOLabel = params => post(`ziehs-sysManage/api/label/add`, params);

//修改标签组
export const UpdateOLabel = params => post(`ziehs-sysManage/api/label/update`, params);

//删除标签组
export const DelOLabel = params => get(`ziehs-sysManage/api/label/delete`, params);

// 标签新增｜修改 -> 提交
export const LabelItemAdd = params => post(`ziehs-sysManage/api/label/item/commit`, params);

// 删除标签
export const DelOItemLabel = params => get(`ziehs-sysManage/api/label/item/delete`, params);

// 获取标签
export const GetItemLabel = params => post(`ziehs-sysManage/api/label/item/list`, params);
