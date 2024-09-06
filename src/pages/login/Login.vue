<template>
  <common-layout>
    <div v-if="!showCompany" class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">环境安全健康系统</span>
      </div>
    </div>
    <div v-if="!showCompany" class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{ textAlign: 'center' }" style="padding: 0 2px">
          <!-- <a-tab-pane tab="账户密码登录" key="1">   请输入账户名 -->
          <a-tab-pane tab="工号密码登录" key="1">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
              style="margin-bottom: 24px" />
            <a-form-item>
              <a-input autocomplete="autocomplete" size="large" placeholder="请输入工号" v-decorator="[
      'name',
      {
        rules: [
          {
            required: true,
            message: '请输入工号',
            whitespace: true,
          },
        ],
        initialValue: windowLocal < 0 ? '' : '15046842680',
        // initialValue: '13801010103',
      },
    ]">
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <!-- type="password" -->
              <a-input-password size="large" placeholder="请输入密码" autocomplete="autocomplete" v-decorator="[
      'password',
      {
        rules: [
          {
            required: true,
            message: '请输入密码',
            whitespace: true,
          },
        ],
        initialValue: windowLocal < 0 ? '' : 'Aa123456',
        // initialValue: 'a123456',
      },
    ]">
                <a-icon slot="prefix" type="lock" />
              </a-input-password>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <a-form-item>
          <a-button :loading="logging" style="width: 100%; margin-top: 24px" size="large" htmlType="submit"
            type="primary">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { mapMutations, mapActions } from "vuex";
import JSEncrypt from "jsencrypt";
import { getPublicKey,loginIn,userGetUserInfo } from "@/services/xinxin/login.js"
import {
  getMenuAuthList,
  getloginUserDataAuth,
  apiRoleGetLoginMenu2,
} from "@/services/api.js";
export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      encrypt: new JSEncrypt(),
      showCompany: false,
      windowLocal: window.location.host.indexOf("localhost"),
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  created() {
    sessionStorage.clear();
    this.userKeyJump();
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    async userKeyJump() {
      const getQueryParams = (url) => {
        let params = {};
        let queryString = url.split("?")[1]; // 获取URL中的查询字符串
        if (queryString) {
          let urlSearchParams = new URLSearchParams(queryString);
          urlSearchParams.forEach((value, key) => {
            params[key] = value;
          });
        }
        return params;
      };
      let queryParams = getQueryParams(location.href);
      // 如果存在userKey是从门户跳转过来的
      if (queryParams.userKey) {
        this.showCompany = true;
        let params = {
          userKey: queryParams.userKey,
          clientId: process.env.VUE_APP_CLIENTID,
          grantType: "random",
        };
        let result = await loginIn(params);
        // 存储跳转系统页的相关信息
        sessionStorage.setItem("access_token", result.data.accessToken);
        sessionStorage.setItem("token_type", result.data.tokenType);
        // 获取问号前的部分，即基础URL
        var baseUrl = location.href.split("?")[0];
        baseUrl = baseUrl.slice(0, baseUrl.indexOf("login")) + queryParams.routeUrl;
        location.replace(baseUrl);
        let str = "";
        for (const key in queryParams) {
          if (key != "routeUrl" && key != "userKey") {
            if (str == "") {
              str += `${key}=${queryParams[key]}`;
            } else {
              `&&${key}=${queryParams[key]}`;
            }
          }
        }
        this.getUserMessage(queryParams.routeUrl + "?" + str);
      } else {
        this.getPublicKey();
      }
    },
    async getPublicKey() {
      // 获取公钥加密
      try {
        const result = await getPublicKey();
        if (result.code == "20000") {
          let key =
            "-----BEGIN PUBLIC KEY-----" + result.data + "-----END PUBLIC KEY-----";
          sessionStorage.setItem("PUBLICKEY_Ziid", key);
          this.encrypt.setPublicKey(key);
        }
      } catch (e) {
        const _message = e?.response?.data?.msg;
        // this.$antMessage.error(_message, 2);
      }
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          this.loginIn();
        }
      });
    },
    async loginIn() {
      var _this = this;
      let params = {
        // username: _this.form.getFieldValue("name"),
        jobNumber: _this.form.getFieldValue("name"),
        password: _this.encrypt.encrypt(this.form.getFieldValue("password")),
        clientId: process.env.VUE_APP_CLIENTID,
        // grantType: "password",
        grantType: "jobNumber",
      };
      try {
        let result = await loginIn(params);
        if (result.code == 20000) {
          // 存储跳转系统页的相关信息
          sessionStorage.setItem("access_token", result.data.accessToken);
          sessionStorage.setItem("token_type", result.data.tokenType);
          this.getUserMessage();
        }
        this.logging = false;
      } catch (e) {
        this.logging = false;
      }
    },

    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.code >= 0) {
        const { user, permissions, roles } = loginRes.data;
        this.setUser(user);
        this.setPermissions(permissions);
        this.setRoles(roles);
        // 获取路由配置
        // this.getRoutesConfig(loginRes);
      } else {
        this.error = loginRes.message;
      }
    },
    // 开发内部控制台页面，暂时保留
    async getRoutesConfig(loginRes) {
      const routesConfig = res.data.data;
      this.$router.push({ path: "/dashboard/workplace" }, () => { });
      this.$antMessage.success(loginRes.message, 3);
    },
    async getUserMessage(url) {
      let userId = sessionStorage.getItem("userId");
      let result = await userGetUserInfo({});
      if (result.code == 20000) {
        sessionStorage.setItem("zconsole_userInfo", JSON.stringify(result.data));
        sessionStorage.setItem("userName", result.data.userName);
        
        getMenuAuthList().then((res) => {
          if (res.data && res.data.length) {
            sessionStorage.setItem("menuAuthList", res.data);
            getloginUserDataAuth({
              routerList: res.data,
            }).then((res) => {
              apiRoleGetLoginMenu2({
                companyId: result.data.company.companyId,
              }).then((menu) => {
                sessionStorage.setItem("loginMenu", JSON.stringify(menu.data));
                if (url) {
                  this.$router.push(url);
                } else {
                  this.$router.push("/systemManagement/dictionary");
                }
              });
            });
          }
        });
      } else {
      }
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;

    .header {
      height: 44px;
      line-height: 44px;

      a {
        text-decoration: none;
      }

      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }

      .title {
        font-size: 33px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }

    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }

  .login {
    width: 368px;
    margin: 0 auto;

    @media screen and (max-width: 576px) {
      width: 95%;
    }

    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }

    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}

.ant-row {
  display: block !important;
}

.ant-page-header-heading {
  justify-content: flex-start !important;
}
</style>
<style></style>
