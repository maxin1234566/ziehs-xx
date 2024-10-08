import config from '@/config'
import {
  ADMIN
} from '@/config/default'
import {
  formatFullPath
} from '@/utils/i18n'
import {
  filterMenu
} from '@/utils/authority-utils'
import {
  getLocalSetting
} from '@/utils/themeUtil'
import deepClone from 'lodash.clonedeep'
import {
  getToken,
  getUserInfo,
  getDevToken,
  getTokenApi,
  getDevCompany,
  getDevMessage,
  checkToken,
  checkTokenEHS,
  getPortraitUrlt
} from '@/services/api'
import {
  getQueryVariable,
  recursionObject,
  recursionMenuButton,
  recursionMenuBtn
} from '@/utils/util'
import Vue from 'vue'
import {
  initRouter
} from '@/router'
import {
  getDictionary,
  getMenuTree,
  getCorporationListAll,
  getDictTree,
  getCorporationTree,
  getLoginCorporation,
  getMenuAuthList,
  getDeptCache,
  orgGetLoginCorporationList,
  apiOrgList,
  orgGetCenterList,
  orgGetLoginCenterList
} from '@/services/api'
import {
  loadRoutes
} from '@/utils/routerUtil'
import {
  clxTools
} from "@/utils/clx-tools";
import {
  GetDictConfigList
} from "@/services/networkControl.js";
// 引入默认路由
import {
  defaultRoutes,
  defaultSeedMenuRoutes
} from '@/router/async/default.route'

import {
  monitorPollutantList
} from "@/services/envWatch/markManage"
var currentRouter = initRouter();
const localSetting = getLocalSetting(true)
const customTitlesStr = sessionStorage.getItem(process.env.VUE_APP_TBAS_TITLES_KEY)
const customTitles = (customTitlesStr && JSON.parse(customTitlesStr)) || []
let setMenuAuthListGlobal;
let menuListMixin = {};
let routerList = [];

function getMenuList(arr, fatherName) {
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].children && arr[i].children.length > 0 && arr[i].path != "chemicals") {
        getMenuList(arr[i].children, arr[i].name);
      } else {
        if (!arr[i].meta.invisible) {
          let authType = getMappingValue(setMenuAuthListGlobal, "resourceCode", arr[i].path).authType;
          menuListMixin[arr[i].path] = {
            path: arr[i].path,
            fullPath: arr[i].fullPath,
            name: arr[i].name,
            fatherName: fatherName,
            checkedValues: authType != undefined ? authType : 1
          }
          routerList.push({
            resourceCode: arr[i].path,
            authType: authType != undefined ? authType : 1
          })
        }
      }
    }
  }
}
// 获取映射值
function getMappingValue(arr, key, val) { // key：字段值， val：过滤值
  if (val == 0) val = 0 + "";
  if (!(arr && key && val)) {
    return {};
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] == val) {
      return arr[i]
    }
  }
  return {}
}
export default {
  namespaced: true,
  state: {
    isMobile: false,
    // 具有正确的token
    hasRightToken: false,
    animates: ADMIN.animates,
    palettes: ADMIN.palettes,
    pageMinHeight: 0,
    menuData: [],
    activatedFirst: undefined,
    customTitles,
    ...config,
    ...localSetting,
    // 字典对象
    dictionaryData: {},
    //配置管理字典对象
    dictConfigData: {},
    dictTypeData: [],
    // 法人机构
    corporationList: [],
    // 数据权限
    setCorporationTree: [],
    setLoginCorporation: [],
    setMenuAuthList: [],
    // 当前登陆人的组织
    setLoginOrgList: [],
    // 全部部门key:value
    deptCache: {},
    //省市区数组
    provincesList: [],
    promoteInfoId: null, //推广id
    loadingOutsied: false, //全局loading开关
    noticeMsg: null,
    policyMsg: null,
    flowPermission: [],
    approverConfig: {},
    copyerConfig: {},
    conditionsConfig: {
      branchNodes: [],
    },
    tempId: "",
    dictGroup: undefined,
    processNodeData: [],
    tabStatus: 2,
    delNodeProcessId: null,
    customComponents: [],
    addNodeType: null,
    examFormData: null,
    // 是否跳转地址栏routeUrl
    isGoLocationRouteUrl: true,
    // 是否开始检验路由权限
    isBeginGuardBtnRoute: false,
    userTreeDict: { //部分人员id对应名字
    },
    tableData: [],
    formName: '',
    buObj: {},
    buOptions: [],
    treeData: [],
    deptData: [],
    userTreeData: [],
    roleObj: {},
    setRoleOptions: [],
    pollutantOptions: []
  },
  getters: {
    menuData(state, getters, rootState) {
      if (state.filterMenu) {
        const {
          permissions,
          roles
        } = rootState.account
        return filterMenu(deepClone(state.menuData), permissions, roles)
      }
      return state.menuData
    },
    firstMenu(state, getters) {
      const {
        menuData
      } = getters
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData)
      }
      return menuData.map(item => {
        const menuItem = {
          ...item
        }
        delete menuItem.children
        return menuItem
      })
    },
    //用户字典过滤，获取code对应名称
    getUserCodeName: (state) => (code, orgCode) => {
      let options = (state.dictTypeData.find(item => {
        return item.dictType === orgCode
      }) || {}).dictItem || []
      return (options.find(item => {
        return item.dictValue === code
      }) || {}).dictLabel
    },
    //系统字典过滤，获取code对应名称
    getSystemCodeName: (state) => (code, orgCode) => {
      let typeObj = state.dictionaryData[orgCode] || {}
      let options = (Object.keys(typeObj) || {}).map(item => typeObj[item][0]) || []
      return (options.find(item => {
        return item.key === code
      }) || {}).value
    },
    subMenu(state) {
      const {
        menuData,
        activatedFirst
      } = state
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData)
      }
      const current = menuData.find(menu => menu.fullPath === activatedFirst)
      return current && current.children || []
    },
    getCommonAddOrgnizeList(state) {
      return JSON.parse(sessionStorage.getItem('orgList'))
    },
    getCommonAddOrgnizeListAll(state) {
      return JSON.parse(sessionStorage.getItem('allOrgList'))
    },
    getRouterList(state) {
      const {
        menuData,
        setMenuAuthList
      } = state;
      if (menuData.length && setMenuAuthList.length) {
        routerList = [];
        getMenuList(menuData);
        sessionStorage.setItem("currentCorporationObj", JSON.stringify(menuListMixin));
        return routerList;
      }
      return [];
    },
    currentCorporationObj(state) {
      const {
        menuData,
        setMenuAuthList
      } = state;
      if (sessionStorage.getItem("currentCorporationObj")) {
        return JSON.parse(sessionStorage.getItem("currentCorporationObj"));
      } else if (menuData.length && setMenuAuthList.length) {
        getMenuList(menuData);
        sessionStorage.setItem("currentCorporationObj", JSON.stringify(menuListMixin));
        return menuListMixin
      } else {
        return {}
      }
    },
    pollutantOptionsGetter(state) {
      return state.pollutantOptions || []
    }
  },
  mutations: {
    // 数据权限
    setCorporationTree(state, setCorporationTree) {
      state.setCorporationTree = setCorporationTree;
    },
    setLoginCorporation(state, setLoginCorporation) {
      state.setLoginCorporation = setLoginCorporation;
    },
    setMenuAuthList(state, setMenuAuthList) {
      setMenuAuthListGlobal = setMenuAuthList;
      state.setMenuAuthList = setMenuAuthList;
      sessionStorage.setItem("calledSetMenuAuthList", JSON.stringify(setMenuAuthList));
    },
    setPollutantOptions(state, setPollutantOptions) {
      console.log(setPollutantOptions, 'setPollutantOptions')
      state.pollutantOptions = setPollutantOptions
      sessionStorage.setItem("pollutantOptions", JSON.stringify(setPollutantOptions));
    },
    setCurrentCorporationObj(state) {
      setMenuAuthListGlobal = state.setMenuAuthList;
    },
    setUserTreeDict(state, userTreeDict) {
      state.userTreeDict = userTreeDict
    },
    setTableData(state, tableData) {
      state.tableData = tableData
    },
    setFormName(state, formName) {
      state.formName = formName
    },
    setBuObj(state, buObj) {
      state.buObj = buObj
    },
    setBuOptions(state, buOptions) {
      state.buOptions = buOptions
    },
    setTreeData(state, treeData) {
      state.treeData = treeData
    },
    setDeptData(state, deptData) {
      state.deptData = deptData
    },
    setUserTreeData(state, userTreeData) {
      state.userTreeData = userTreeData
    },
    setRoleObj(state, roleObj) {
      state.roleObj = roleObj
    },
    setRoleOptions(state, roleOptions) {
      state.roleOptions = roleOptions
    },
    // 开始检验路由权限
    setIsBeginGuardBtnRoute(state, isBeginGuardBtnRoute) {
      // console.log('设置了setIsBeginGuardBtnRoute', isBeginGuardBtnRoute);
      state.isBeginGuardBtnRoute = isBeginGuardBtnRoute
    },
    // 设置是否跳转地址栏routeUrl
    setIsGoLocationRouteUrl(state, isGoLocationRouteUrl) {
      if (sessionStorage.getItem('isGoLocationRouteUrl')) {
        sessionStorage.removeItem('isGoLocationRouteUrl')
      }
      state.isGoLocationRouteUrl = isGoLocationRouteUrl
    },
    setExamFormData(state, examFormData) {
      state.examFormData = examFormData
    },
    setNodeType(state, addNodeType) {
      state.addNodeType = addNodeType
    },
    updateDictGroup(state, dictGroup) {
      state.dictGroup = dictGroup
    },
    updateProcessNodeData(state, processNodeData) {
      state.processNodeData = processNodeData
    },
    delNodeProcessId(state, delNodeProcessId) {
      state.delNodeProcessId = delNodeProcessId
    },
    updateTabStatus(state, tabStatus) {
      state.tabStatus = tabStatus
    },
    updateFlowPermission(status, flowPermission) {
      status.flowPermission = flowPermission
    },
    updateApproverConfig(status, approverConfig) {
      status.approverConfig = approverConfig
    },
    updateCopyerConfig(status, copyerConfig) {
      status.copyerConfig = copyerConfig
    },
    updateConditionsConfig(status, conditionsConfig) {
      status.conditionsConfig = conditionsConfig
    },
    noticeMsg(state, value) {
      state.noticeMsg = value;
    },
    policyMsg(state, value) {
      state.policyMsg = value;
    },
    setLoadingOutsied(state, isMobile) {
      state.loadingOutsied = isMobile
    },
    setDevice(state, isMobile) {
      state.isMobile = isMobile
    },
    setTheme(state, theme) {
      state.theme = theme
    },
    setLayout(state, layout) {
      state.layout = layout
    },
    setMultiPage(state, multiPage) {
      state.multiPage = multiPage
    },
    setAnimate(state, animate) {
      state.animate = animate
    },
    setWeekMode(state, weekMode) {
      state.weekMode = weekMode
    },
    setFixedHeader(state, fixedHeader) {
      state.fixedHeader = fixedHeader
    },
    setFixedSideBar(state, fixedSideBar) {
      state.fixedSideBar = fixedSideBar
    },
    setLang(state, lang) {
      state.lang = lang
    },
    setHideSetting(state, hideSetting) {
      state.hideSetting = hideSetting
    },
    correctPageMinHeight(state, minHeight) {
      state.pageMinHeight += minHeight
    },
    setMenuData(state, menuData) {
      sessionStorage.removeItem("currentCorporationObj");
      state.menuData = menuData
    },
    setAsyncRoutes(state, asyncRoutes) {
      state.asyncRoutes = asyncRoutes
    },
    setPageWidth(state, pageWidth) {
      state.pageWidth = pageWidth
    },
    setActivatedFirst(state, activatedFirst) {
      state.activatedFirst = activatedFirst
    },
    setFixedTabs(state, fixedTabs) {
      state.fixedTabs = fixedTabs
    },
    setCustomTitle(state, {
      path,
      title
    }) {
      if (title) {
        const obj = state.customTitles.find(item => item.path === path)
        if (obj) {
          obj.title = title
        } else {
          state.customTitles.push({
            path,
            title
          })
        }
        sessionStorage.setItem(process.env.VUE_APP_TBAS_TITLES_KEY, JSON.stringify(state.customTitles))
      }
    },
    setCheckToken(state, hasRightToken) {
      state.hasRightToken = hasRightToken
    },
    setDictionaryData(state, dictionaryData) {
      state.dictionaryData = dictionaryData
    },
    setDictConfigList(state, dictConfigData) {
      state.dictConfigData = dictConfigData
    },
    setDictTypeData(state, dictTypeData) {
      state.dictTypeData = dictTypeData;
    },
    setCorporationList(state, corporationList) {
      corporationList = corporationList.sort((a, b) => a.orderNum - b.orderNum)
      state.corporationList = corporationList;
    },
    //省市区
    setProvincesList(state, provincesList) {
      state.provincesList = provincesList
    },
    setPromoteInfoId(state, id) {
      state.promoteInfoId = id
    },
    // 存储自定义表单tempid
    saveTempId(state, id) {
      state.tempId = id;
    },
    saveCustomComponents(state, customComponents) {
      state.customComponents = customComponents;
    },
    setDeptCache(state, deptCache) {
      state.deptCache = deptCache;
    }
  },
  actions: {
    getCurrentCorporationObj({
      dispatch,
      commit
    }, ) {
      getMenuList(state.menuData);
      commit('setIsBeginGuardBtnRoute', true)
    },
    // 获取token
    async getDevTokenData({
      dispatch,
      commit
    }, responseData) {
      let code = getQueryVariable('code');
      let companyId = getQueryVariable('companyId');
      if (!code) {
        if (sessionStorage.getItem('access_token')) {
          let params = {
            userId: sessionStorage.getItem('userId'),
            companyId: sessionStorage.getItem('companyId'),
            clientId: process.env.VUE_APP_CLIENTID,
            token: sessionStorage.getItem('access_token')
          }
          if (!params.companyId) {
            delete params.companyId
          }
          let resCheckToken = await checkTokenEHS(params);
          if (resCheckToken.code == 20000) {
            commit('setCheckToken', false)
            return
          } else {
            sessionStorage.clear();
            window.location.href = process.env.VUE_APP_LOGIN_URL + 'client_id=' + process.env.VUE_APP_CLIENTID + '&response_type=' + process.env.VUE_APP_RESPONSE_TYPE + '&redirect_uri=' + process.env.VUE_APP_REDIRECT_URI + '&isLogout=true';
          }
        } else {
          sessionStorage.clear();
          window.location.href = process.env.VUE_APP_LOGIN_URL + 'client_id=' + process.env.VUE_APP_CLIENTID + '&response_type=' + process.env.VUE_APP_RESPONSE_TYPE + '&redirect_uri=' + process.env.VUE_APP_REDIRECT_URI;
        }
      }
      let apiData = {
        code,
        redirectUri: process.env.VUE_APP_REDIRECT_URI,
      }
      if (companyId) {
        apiData.companyId = companyId
      }
      return new Promise((resolve, reject) => {
        getTokenApi(apiData)
          .then(res => {
            if (res.code == 20000) {
              let tokenData = res.data;
              console.log('tokenData', tokenData);
              sessionStorage.setItem('token_type', tokenData.token_type);
              sessionStorage.setItem('access_token', tokenData.access_token);
              sessionStorage.setItem('refresh_token', tokenData.refresh_token);
              if (tokenData.companyId) {
                sessionStorage.setItem('companyId', tokenData.companyId);
              }
              sessionStorage.setItem('expires_in', tokenData.expires_in);
              sessionStorage.setItem('userId', tokenData.userId);
              sessionStorage.setItem('userName', tokenData.userName);
              resolve(tokenData)
            } else {
              // 添加提示语
              Vue.prototype.$antMessage.warn('系统异常，获取token失败！3秒后自动跳转登录页')
              setTimeout(() => {
                sessionStorage.clear();
                if (process.env.NODE_ENV === "production") {
                  window.location.href = process.env.VUE_APP_LOGIN_URL +
                    "client_id=" +
                    process.env.VUE_APP_CLIENTID +
                    "&response_type=" +
                    process.env.VUE_APP_RESPONSE_TYPE +
                    "&redirect_uri=" +
                    process.env.VUE_APP_REDIRECT_URI +
                    "&isLogout=true";
                } else {
                  currentRouter.push("/login");
                }
              }, 3000);
            }
          }).catch(err => {
            // 添加提示语
            Vue.prototype.$antMessage.warn('系统异常，获取token失败！3秒后自动跳转登录页')
            setTimeout(() => {
              sessionStorage.clear();
              if (process.env.NODE_ENV === "production") {
                window.location.href = process.env.VUE_APP_LOGIN_URL +
                  "client_id=" +
                  process.env.VUE_APP_CLIENTID +
                  "&response_type=" +
                  process.env.VUE_APP_RESPONSE_TYPE +
                  "&redirect_uri=" +
                  process.env.VUE_APP_REDIRECT_URI +
                  "&isLogout=true";
              } else {
                currentRouter.push("/login");
              }
            }, 3000);
            reject(err)
          })
      })
    },
    // 获取用户信息
    getUserInfoData({
      dispatch,
      commit
    }, responseData = {}) {
      let params = {
        userId: responseData.userId || sessionStorage.getItem('userId'),
        companyId: responseData.companyId == undefined ? (sessionStorage.getItem('companyId') ? sessionStorage.getItem('companyId') : '') : responseData.companyId,
        clientId: process.env.VUE_APP_CLIENTID,
        isFindAdminInfo: false,
        token: responseData.access_token || sessionStorage.getItem('access_token')
      }
      console.log(params, 'params')
      if (!params.companyId) {
        delete params.companyId
      }
      return new Promise((resolve, reject) => {
        // resolve()
        getUserInfo(params)
          .then(res => {
            sessionStorage.setItem('zconsole_userInfo', JSON.stringify(res.data))
            // 刷新页面重新获取用户信息
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 开发模式下获取dev公司信息
    getDevCompanyData({
      dispatch,
      commit
    }, responseData) {
      let params = {
        userId: responseData.userId,
        companyId: responseData.companyId,
        clientId: process.env.VUE_APP_CLIENTID,
        isFindAdminInfo: false,
      }
      return new Promise((resolve, reject) => {
        getDevCompany(params).then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 开发模式下获取dev user信息
    getDevMessageData({
      dispatch,
      commit
    }, responseData) {
      let params = {
        userId: responseData.userId,
        companyId: responseData.companyId,
        clientId: process.env.VUE_APP_CLIENTID,
        isFindAdminInfo: false,
      }
      return new Promise((resolve, reject) => {
        getDevMessage(params).then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 验证token
    checkToken({
      dispatch,
      commit
    }) {
      let params = {
        userId: sessionStorage.getItem('userId'),
        companyId: JSON.parse(sessionStorage.getItem('zconsole_userInfo')).company ? JSON.parse(sessionStorage.getItem('zconsole_userInfo')).company.companyId : '',
        clientId: process.env.VUE_APP_CLIENTID,
        token: sessionStorage.getItem('access_token')
      }
      if (!params.companyId) {
        delete params.companyId
      }
      return new Promise((resolve, reject) => {
        // checkToken(formData).then(res => {
        checkTokenEHS(params).then(res => {
          console.log("res---", res);
          resolve(res)
        }).catch(err => {
          console.log("rror--", err);
          reject(err)
        })
      })
    },
    // 获取字典对象(系统字典)
    getDictionaryData({
      commit
    }) {
      return getDictionary({})
        .then(res => {
          let dictionaryData = res.data;
          let params = {
            companyId: JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company ? JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId : ''
          };
          commit('setDictionaryData', dictionaryData);
          return res.data
        })
        .catch(err => {})
    },
    // 获取配置管理字典对象
    getDictConfigList({
      commit
    }) {
      return GetDictConfigList({})
        .then(res => {
          let dictionaryData = res.data;
          commit('setDictConfigList', dictionaryData);
          return res.data
        })
        .catch(err => {})
    },
    // 获取ehs字典列表(用户字典)
    getDictTree({
      commit
    }) {
      return getDictTree().then(res => {
        commit('setDictTypeData', res.data);
      }).catch(err => {
        console.log(err);
      })
    },
    // 数据权限
    // 获取当前租户的法人机构树
    getCorporationTree({
      commit
    }) {
      return getCorporationTree().then(res => {
        commit('setCorporationTree', res.data);
      }).catch(err => {
        console.log(err);
      })
    },
    // 获取当前登录用户所属的法人机构树
    getLoginCorporation({
      commit
    }) {
      return getLoginCorporation().then(res => {
        // console.log(res.data, 'res data')
        commit('setLoginCorporation', res.data);
      }).catch(err => {
        console.log(err);
      })
    },
    // 菜单数据权限
    getMenuAuthList({
      commit
    }) {
      if (sessionStorage.getItem("calledSetMenuAuthList")) { // 已经调用过就不用调了
        let str = sessionStorage.getItem("calledSetMenuAuthList") || '[]';
        commit('setMenuAuthList', JSON.parse(str));
        return Promise.resolve();
      } else {
        return getMenuAuthList().then(res => {
          commit('setMenuAuthList', res.data);
        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 获取当前登录人的组织机构
    getOrgList({
      commit
    }) {
      // // 获取所有中心
      orgGetLoginCenterList({}).then((res) => {
        sessionStorage.setItem('centerList', JSON.stringify(res.data))
      })
      // 获取所有组织
      apiOrgList({}).then((res) => {
        sessionStorage.setItem('allOrgList', JSON.stringify(res.data))
      })
      // 获取当前登陆人中心
      orgGetCenterList({}).then((res) => {
        // console.og(res.data,'当前登陆人中心中心')
        sessionStorage.setItem('allCenterList', JSON.stringify(res.data))
      })
      // 获取当前登陆人组织
      return orgGetLoginCorporationList({}).then((res) => {
        sessionStorage.setItem('orgList', JSON.stringify(res.data))
        commit('setLoginOrgList', res.data);
      }).catch((err) => {
        console.log(err)
      })
    },
    //获取菜单
    getMenuTree({
      commit
    }) {
      let params = {
        companyId: JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company ? JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId : ''
      };
      return getMenuTree(params).then(result => {
        // 开始检验路由权限
        commit('setIsBeginGuardBtnRoute', true)
        let menuArr = [];
        if (!result.data) {
          sessionStorage.clear();
        }
        if (result && result.data && result.data.resourceId == 'root') {
          console.log(result.data, 'result.data')
          // 权限全部放开权限全部放开权限全部放开权限全部放开权限全部放开权限全部放开权限全部放开权限全部放开权限全部放开
          menuArr.push(result.data);
          recursionMenuBtn(menuArr[0].children)
          console.log(menuArr, 'menuArr')
          result.data.children = defaultRoutes.concat(menuArr[0].children);
          result.data.children = recursionObject(defaultSeedMenuRoutes, menuArr[0].children)
        }
        let allRouter = clxTools.recursionArr(
          result.data,
          "router",
          "children",
          true
        );
        let work = allRouter.includes('work') //工单
        let orderManage = allRouter.includes('orderManage') //订单
        let couponManage = allRouter.includes('couponManage') //优惠券
        let permissions = allRouter.includes('permissions') //权限-用户
        let obj = {
          work,
          orderManage,
          couponManage,
          permissions
        }
        sessionStorage.setItem('header_permissions_look', JSON.stringify(obj))
        loadRoutes(menuArr)
      })
    },
    // 获取部门树缓存数据
    getDeptCache({
      commit
    }) {
      return getDeptCache().then(res => {
        sessionStorage.setItem('deptCache', JSON.stringify(res.data))
        commit('setDeptCache', res.data || {});
      }).catch(err => {})
    },
    //获取全量污染物数据选项
    getPollutantOptions({
      commit
    }) {
      return monitorPollutantList().then(res => {
        commit('setPollutantOptions', res.data);
      }).catch(err => {
        console.log(err);
      })
      // }
    }
  }
}