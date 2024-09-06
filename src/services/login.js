import { get, post, postExcel } from '@/utils/request.js';
import serviceNameList from '@/config/default/service.config.js'
// export const loginIn = params => post('/login', params);
// export const getRoutesConfig = params => get('/routes', params);

// 登录登出相关
export const getPublicKey = (params, headers) => get(serviceNameList.auth + '/api/auth/rsa/publicKey', params, headers);
export const loginIn = (params) => post(serviceNameList.auth + '/api/login', params);
export const getDevMessageBOE = (params, headers) => post(serviceNameList.systemManagement + '/api/user/getUserInfo', params, headers);