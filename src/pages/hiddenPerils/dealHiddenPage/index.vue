<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="loadingSpin">
      <div class="box-father">
        <!-- 详情展示 -->
        <InfoDetailList class="left" :hideDangerForm="hideDangerForm" />
        <div class="right">
          <Log :logList="logList" :logItem="logItem" />
        </div>
      </div>
    </a-spin>
    <div slot="fixedBottom">
      <FixedBottom>
        <a-button class="m-r-10" @click="submit('cancel')" v-if="hideDangerForm.processStatus == 'close'">返回</a-button>
        <a-button class="m-r-10" @click="submit('cancel')" v-if="hideDangerForm.processStatus != 'close' && hideDangerForm.handerId.indexOf(currentUserId) == -1">返回</a-button>
        <div v-if="hideDangerForm.processStatus == 'confirmation' && hideDangerForm.handerId.indexOf(currentUserId) > -1">
          <!-- confirmation：待确认展示 -->
          <a-button class="m-r-10" type="primary" @click="submit('pass')">通过</a-button>
          <a-button class="m-r-10" @click="submit('boBack')">驳回</a-button>
        </div>
        <div v-else-if="(hideDangerForm.processStatus != 'close' && hideDangerForm.processStatus != 'confirmation') && hideDangerForm.handerId.indexOf(currentUserId) > -1">
          <StaffOrDept :treeType="'user'" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }"  :useBtn="'分配担当'" :searchTerm="true" @getTreeData="getTreeData" class="m-r-10" :checkAbel="false" />
          <a-button class="m-r-10" @click="submit('rectification')">直接整改</a-button>
          <a-button class="m-r-10" @click="submit('delay')" v-show="!delayShow">延期申请</a-button>
          <a-button class="m-r-10" @click="submit('back')">退回起草人</a-button>
          <!-- close：已关闭 -->
        </div>
      </FixedBottom>
    </div>

    <!-- 退回起草人 -->
    <BackModel :backFlag="backFlag" @cancleBackFlag="cancleBackFlag" :title="'退回原因'" />

    <!-- 延期申请、驳回弹窗 -->
    <CommonModal title="延期申请" :visible="delayFlag" :cancelFn="cancleDelayFlag">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          :label-col="{ style: { width: '130px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="延期时间" prop="delayTime">
            <a-date-picker v-model="addForm.delayTime" :disabledDate="disabledPicker" />
          </a-form-model-item>
          <a-form-model-item v-if="typeModel" class="flex" label="延期原因" prop="delayReason">
            <a-textarea placeholder="最多可输入100字" v-model="addForm.delayReason" allowClear :maxLength="100" />
          </a-form-model-item>
          <a-form-model-item v-if="typeModel" class="flex" label="临时措施" prop="provisionalMeasures">
            <a-textarea placeholder="最多可输入100字" v-model="addForm.provisionalMeasures" allowClear :maxLength="100" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="cancleDelayFlag">取消</a-button>
        <a-button class="m-l-15" type="primary" :loading="loading" @click="submitDict">确定</a-button>
      </template>
    </CommonModal>
  </HasFixedBottomWrapper>
</template>

<script>
import InfoDetailList from "@/pages/hiddenPerils/components/showHiddenDetail/index.vue";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { formValidator } from "@/utils/clx-form-validator.js";
import BackModel from "@/pages/hiddenPerils/components/backRason/index.vue";
import dayJs from "dayjs";
import {
  DetailhiddenPerilsList,
  DelayhiddenPerilsList,
  BackhiddenPerilsList,
  PassOrBackhiddenPerils,
  GetParentResponsibilityDept,
  GetHiddenNextPeople,
  HiddenLogList,
} from "@/services/hiddenPerils.js";
import StaffOrDept from "@/components/staffOrDept";
import moment from "moment";
import { getQueryVariable } from "@/utils/util.js";
import { PushTask } from "@/services/api";
import Log from "@/components/logList/index.vue";

export default {
  components: { InfoDetailList, FixedBottom, Log, BackModel, StaffOrDept },
  data() {
    return {
      loadingSpin: true,
      loading: false,
      delayShow: false, //是否显示延期内容
      routeObj: {
        hideDangerId: "",
      }, //接受参数
      backFlag: false, //退回起草人
      boBackFlag: false, //驳回
      delayFlag: false, //延期申请
      addForm: {},
      logList: [], //操作日志
      logItem: {
        status: "handerType", //状态
        person: "hander", //操作人
        time: "handerTime", //操作时间
        note: "handerExplain", //备注
      },
      addFormRules: {
        delayTime: [
          { required: true, message: "延期时间不能为空", trigger: "change" },
        ],
        delayReason: [
          { required: true, message: "延期原因不能为空", trigger: "change" },
        ],
        provisionalMeasures: [
          { required: true, message: "延期措施不能为空", trigger: "change" },
        ],
      },
      hideDangerForm: {
        handerId: ''
      },
      typeModel: false, //驳回false 退回起草人true
      currentUserId: sessionStorage.getItem('zconsole_userInfo') ? JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId : ''
    };
  },
  created() {
    let routeObj = this.$route.query;
    this.routeObj = routeObj;
    this.routeObj.hideDangerId =
      this.routeObj.hideDangerId || getQueryVariable("hideDangerId");
    this.getDetail(); //获取详情
    this.getLogList();
  },
  methods: {
    // 消息推送
    async infoPush(urlJump, userIdOld) {
      // 获取下级审批人
      let nextPeopleData = await GetHiddenNextPeople({ hideDangerId: this.routeObj.hideDangerId })
      let nextUserId = nextPeopleData?.data?.handleId
      const url =
        process.env.VUE_APP_LOGIN_URL +
        "client_id=" +
        process.env.VUE_APP_CLIENTID +
        "&response_type=" +
        process.env.VUE_APP_RESPONSE_TYPE +
        "&redirect_uri=" +
        process.env.VUE_APP_REDIRECT_URI +
        "&routeUrl=" +
        `${urlJump}&hideDangerId=${this.routeObj.hideDangerId}`;

      PushTask({
        title: "隐患排查处理",
        approval: "hiddenPerils_verify",
        userId: nextUserId,
        url: url,
        docNumber: this.hideDangerForm?.dangerCode,   //业务id
        docId: this.routeObj.hideDangerId,  //主键id
      })
        .then((res) => {
          console.log(res, "推送成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //获取操作日志
    getLogList() {
      HiddenLogList({ hideDangerId: this.routeObj.hideDangerId })
        .then((res) => {
          this.logList = res.data;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },

    //按钮点击事件
    submit(type) {
      //type：distribution:分配担当  rectification:直接整改  delay:延期申请  back:退回起草人
      if (type == "rectification") {
        this.loading = true;
        DelayhiddenPerilsList({ hideDangerId: this.routeObj.hideDangerId })
          .then((res) => {
            this.loading = false;
            this.$antMessage.success(`直接整改成功`);
            if (this.hideDangerForm.fourPass) {
              //四不放过
              this.infoPush("/safeManage/dualControlManage/hiddenPerils/dealIsFour");
              this.$router.push({
                path: "/safeManage/dualControlManage/hiddenPerils/dealIsFour",
                query: { hideDangerId: this.routeObj.hideDangerId },
              });
              this.setKeepalive(true)
            } else {
              //非四不放过
              this.infoPush("/safeManage/dualControlManage/hiddenPerils/dealNoFour");
              this.$router.push({
                path: "/safeManage/dualControlManage/hiddenPerils/dealNoFour",
                query: { hideDangerId: this.routeObj.hideDangerId },
              });
              this.setKeepalive(true)
            }
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      } else if (type == "delay") {
        //打开延期申请弹窗
        this.delayFlag = true;
        this.typeModel = true;
      } else if (type == "pass") {
        //通过
        let obj = {
          hideDangerId: this.routeObj.hideDangerId,
          pass: true,
        };
        this.loading = true;
        PassOrBackhiddenPerils(obj)
          .then((res) => {
            if (this.hideDangerForm.fourPass) {
              //四不放过
              this.infoPush("/safeManage/dualControlManage/hiddenPerils/dealIsFour");
              this.setKeepalive(true)
            } else {
              //非四不放过
              this.infoPush("/safeManage/dualControlManage/hiddenPerils/dealNoFour");
              this.setKeepalive(true)
            }
            this.loading = false;
            this.$antMessage.success(`通过成功`);
            this.$router.push("/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList");
          })
          .catch((err) => {
            this.loading = false;
            console.log(err, "DelayhiddenPerilsList出错");
          });
      } else if (type == "boBack") {
        //打开驳回
        this.delayFlag = true;
        this.typeModel = false;
      } else if (type == "cancel") {
        // this.setKeepalive(true)
        this.$router.push("/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList");
      } else {
        //打开退回起草人弹窗
        this.backFlag = true;
      }
      this.setKeepalive(true)
    },

    //禁用延期时间
    disabledPicker(current) {
      return (
        this.hideDangerForm.rectificationTime &&
        current &&
        current < moment(this.hideDangerForm.rectificationTime).add(1, "days")
      );
    },

    //获取详情
    getDetail() {
      DetailhiddenPerilsList({ hideDangerId: this.routeObj.hideDangerId })
        .then((res) => {
          this.loadingSpin = false;
          this.hideDangerForm = res.data;
          if (this.hideDangerForm.delayStatus) {
            //为延期过
            this.delayShow = true;
          } else {
            this.delayShow = false;
          }
          //查看情况
          if (this.routeObj.type && this.routeObj.type == "look") {
            this.hideDangerForm.processStatus = "close";
          }
        })
        .catch((err) => {
          this.loadingSpin = false;
          console.log(err);
        });
    },

    //延期弹窗关闭
    cancleDelayFlag() {
      this.delayFlag = false;
      this.addForm = {};
    },

    //延期、驳回弹窗确认
    submitDict() {
      if (!formValidator.formAll(this, "addForm")) {
        return;
      }
      let delayTime = this.addForm.delayTime
        ? dayJs(this.addForm.delayTime).format("YYYY-MM-DD")
        : undefined;

      let obj = {
        ...this.addForm,
        hideDangerId: this.routeObj.hideDangerId,
        delayTime: delayTime,
        pass: !this.typeModel ? false : undefined,
      };

      this.loading = true;

      //true为延期申请 false驳回
      let PromiseThing = this.typeModel
        ? DelayhiddenPerilsList
        : PassOrBackhiddenPerils;

      PromiseThing(obj)
        .then((res) => {
          if (this.typeModel) {
            this.infoPush("/safeManage/dualControlManage/hiddenPerils/dealHiddenPage");
            this.setKeepalive(true)
          }
          this.loading = false;
          this.$antMessage.success(
            `${this.typeModel ? "延期成功" : "驳回成功"}`
          );
          this.$router.push("/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList");
          this.setKeepalive(true)
        })
        .catch((err) => {
          this.loading = false;
          console.log(err, "DelayhiddenPerilsList出错");
        });
    },

    //退回起草人弹窗关闭
    cancleBackFlag(obj) {
      // console.log(obj,'...obj');
      let obj1 = { ...obj, hideDangerId: this.routeObj.hideDangerId };
      if (obj) {
        BackhiddenPerilsList(obj1)
          .then((res) => {
            this.loading = false;
            this.$antMessage.success(`退回起草人成功`);
            this.$router.push("/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList");
          })
          .catch((err) => {
            this.loading = false;
            console.log(err, "addStandingBookList出错");
          });
      }
      this.backFlag = false;
    },

    // 树组件回调
    getTreeData(data) {
      console.log('树组件回调', data);
      let obj = {
        hideDangerId: this.routeObj.hideDangerId,
        rectificationBearPersonId: data.treeNameAndCodeList.length ? data.treeNameAndCodeList[0].id : "",
        rectificationBearPersonName: data.treeNameAndCodeList.length ? data.treeNameAndCodeList[0].treeName : "",
        rectificationBeardeptId: data.treeNameAndCodeList.length ? data.treeNameAndCodeList[0].treeParentId : "",
        rectificationBeardeptName: data.treeNameAndCodeList.length ? data.treeNameAndCodeList[0].treeParentName : "",
      };

      if (data && data.treeNameAndCodeList.length) {
        let apiData = {
          userId: data.treeNameAndCodeList[0].id,
        }
        GetParentResponsibilityDept(apiData)
          .then((res) => {
            if (res.data) {
              obj.rectificationBeardeptId = res.data.deptId;
              obj.rectificationBeardeptName = res.data.deptName;
              return Promise.resolve()
            }
            return Promise.reject()
          })
          .then(res => {
            return DelayhiddenPerilsList(obj)
              .then((res) => {
                if (this.hideDangerForm.fourPass) {
                  //四不放过
                  this.infoPush("/safeManage/dualControlManage/hiddenPerils/dealIsFour", data.treeNameAndCodeList[0].id);
                  this.setKeepalive(true)
                } else {
                  //非四不放过
                  this.infoPush("/safeManage/dualControlManage/hiddenPerils/dealNoFour", data.treeNameAndCodeList[0].id);
                  this.setKeepalive(true)
                }
                this.loading = false;
                this.$antMessage.success(`分配担当成功`);
                this.$router.push({
                  path: "/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList",
                });
                this.setKeepalive(true)
              })
          })
          .catch(err => {
            this.loading = false;
          })
      }



    },
  },
};
</script>

<style lang="less" scoped>
.box-father {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    margin-right: 20px;
    flex: 1;
  }
  .right {
    width: 426px;
  }
}
</style>
