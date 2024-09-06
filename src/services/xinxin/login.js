import { get, post, postExcel } from '@/utils/request_1.js';
import serviceNameList from '@/config/default/service.config.js'
// export const loginIn = params => post('/login', params);
// export const getRoutesConfig = params => get('/routes', params);

// 登录登出相关
export const getPublicKey = (params, headers) => get('/api/rsa/publicKey', params, headers);
export const loginIn = (params) => post('/api/login', params);
export const userGetUserInfo = (params, headers) => post('/api/user/getUserInfo', params, headers);