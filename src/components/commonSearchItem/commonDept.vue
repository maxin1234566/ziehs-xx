<template>
  <div
    style="margin-bottom: 0"
    :class="{ 'm-r-15': !notTablePage, 'width-100': notTablePage }"
  >
    <template v-if="!notTablePage">
      <a-form-model-item class="flex" label="所属中心" :colon="false">
        <a-select
          :disabled="disabled"
          v-model="CommonFormInline.centerId"
          placeholder="请选择所属中心"
          @change="centerIdChange"
          allowClear
        >
          <a-select-option
            v-for="item in commonCenterAreaList"
            :key="item.orgId"
            :value="item.orgId"
            >{{ item.orgName }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item class="flex" label="所属组织" :colon="false">
        <a-select
          :disabled="disabled"
          v-model="CommonFormInline.corporationId"
          placeholder="请选择所属组织"
          @change="corporationChange"
          allowClear
        >
          <a-select-option
            v-for="item in commonOrgnizeList"
            :key="item.orgId"
            :value="item.orgId"
            >{{ item.orgName }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
    </template>
    <template class="width-100" v-else>
      <a-form-model-item
        v-show="!justNeedDepartment"
        class="flex"
        label="所属组织"
        :colon="isColon"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        prop="corporationId"
        :label-align="labelAlign"
      >
        <a-select
          v-model="CommonFormInline.corporationId"
          placeholder="请选择所属组织"
          @change="corporationChange"
          :disabled="disabled"
          allowClear
        >
          <a-select-option
            v-for="item in addAllOrgList"
            :key="item.orgId"
            :value="item.orgId"
            >{{ item.orgName }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
    </template>
  </div>
</template>

<script>
import {
  enterpriseDeptCorporationTree,
  orgGetLoginCorporationList,
} from "@/services/api";

export default {
  props: {
    // 绑定表单对象
    CommonFormInline: {
      type: Object,
      default: () => {},
    },
    rules: {
      type: Object,
      default: () => {},
    },
    // 不是列表页 true：新增编辑查看页面
    notTablePage: {
      type: Boolean,
      default: false,
    },
    labelCol: {
      type: Array | Object,
      default: () => {},
    },
    wrapperCol: {
      type: Array | Object,
      default: () => {},
    },
    labelAlign: {
      type: String,
      default: "right",
    },
    // 是否有部门
    hasDepartment: {
      type: Boolean,
      default: false,
    },
    departmentMultiple: {
      type: Boolean,
      default: false,
    },
    // disabled
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否需要deptName参数
    needDeptName: {
      type: Boolean,
      default: true,
    },
    // 是否需要corporationName参数
    needCorporationName: {
      type: Boolean,
      default: true,
    },
    // 是否需要centerName参数
    needCenterName: {
      type: Boolean,
      default: true,
    },
    justNeedDepartment: {
      type: Boolean,
      default: false,
    },
    needDefaultValue: {
      type: Boolean,
      default: true,
    },
    //是否展示label的冒号
    isColon: {
      type: Boolean,
      default: false,
    },
    // 固定展示全部的中心
    isAllCorporation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      commonOrgnizeList: [],
      commonCenterAreaList: [],
      addAllOrgList: [],
    };
  },
  created() {
    if (this.rules) {
      this.$set(this.rules, "corporationId", [
        { required: true, message: "所属组织不能为空", trigger: "change" },
      ]);
      if (this.hasDepartment) {
        // 有部门
        if (this.departmentMultiple) {
          this.$set(this.rules, "deptIds", [
            { required: true, message: "部门不能为空", trigger: "change" },
          ]);
        } else {
          this.$set(this.rules, "deptId", [
            { required: true, message: "部门不能为空", trigger: "change" },
          ]);
        }
      }
    }
    if (this.isAllCorporation) {
      // 全部中心
      let allCenterList = JSON.parse(sessionStorage.getItem("allCenterList"));
      this.commonCenterAreaList = allCenterList || [];
    } else {
      let allCenterList = JSON.parse(sessionStorage.getItem("centerList"));
      this.commonCenterAreaList = allCenterList || [];
      this.isNeedDefaultValue(allCenterList);
    }
    if (!this.justNeedDepartment) {
      let orgList = JSON.parse(sessionStorage.getItem("orgList")) || [];
      this.addAllOrgList = orgList;
    }
    if (this.disabled) {
      let orgList = JSON.parse(sessionStorage.getItem("allOrgList")) || [];
      this.addAllOrgList = orgList;
    }
  },
  methods: {
    isNeedDefaultValue(arr) {
      if (!this.needDefaultValue) {
        return;
      }
      // console.log(arr, "arrararar");
      if (
        arr &&
        arr.length == 1 &&
        Array.isArray(arr[0].corporationList) &&
        arr[0].corporationList.length == 1
      ) {
        // 列表页只有一个组织的时候查询条件默认填充上所属中心所属组织
        this.commonOrgnizeList = arr[0].corporationList;
        this.$set(this.CommonFormInline, "centerId", arr[0].corporationList[0].centerId);
        this.$set(
          this.CommonFormInline,
          "centerName",
          arr[0].corporationList[0].centerName
        );
        this.$set(this.CommonFormInline, "corporationId", arr[0].corporationList[0].id);
        this.$set(
          this.CommonFormInline,
          "corporationName",
          arr[0].corporationList[0].orgAbbrName
        );
        let deptId = this.getMappingValue(
          arr[0].corporationList,
          "id",
          arr[0].corporationList[0].id
        ).deptId;
        this.$emit("corporationChange", this.CommonFormInline.corporationId, deptId);
        if (this.hasDepartment) {
          // 有部门
          // this.getDeptTree(deptId);
        }
      }
    },
    // 所属中心改变-获取所属组织
    centerIdChange(val) {
      // this.commonOrgnizeList = JSON.parse(sessionStorage.getItem("allOrgList"));
      orgGetLoginCorporationList({ centerId: val }).then((res) => {
        this.commonOrgnizeList = res.data;
        this.$set(this.CommonFormInline, "corporationId", undefined);
        if (this.departmentMultiple) {
          this.$set(this.CommonFormInline, "deptIds", undefined);
        } else {
          this.$set(this.CommonFormInline, "deptId", undefined);
        }
        this.$emit("centerChange", val);
      });
    },
    // 所属组织改变-获取所属组织下的所有部门
    corporationChange(val, rebackDept) {
      if (this.notTablePage) {
        if (this.needCorporationName) {
          this.$set(
            this.CommonFormInline,
            "corporationName",
            this.getMappingValue(this.addAllOrgList, "orgId", val).orgName
          );
        }
      }
      let list = this.notTablePage ? this.addAllOrgList : this.commonOrgnizeList;
      if (
        !(
          (rebackDept && typeof rebackDept == "string") ||
          (this.departmentMultiple && rebackDept instanceof Array)
        )
      ) {
        // 回显的时候不需要触发
        this.$emit("corporationChange", val);
        if (this.departmentMultiple) {
          this.$set(this.CommonFormInline, "deptIds", []);
        } else {
          this.$set(this.CommonFormInline, "deptId", undefined);
        }
        this.$set(this.CommonFormInline, "deptName", undefined);
      }
      if (this.hasDepartment) {
        // 有部门
        // 请求该组织下全量部门接口
        this.getDeptTree(val);
      }
    },
    // 数据回显
    echoCommonDept(corporationId) {
      let list = this.notTablePage ? this.addAllOrgList : this.commonOrgnizeList;
      let corporationDeptId = this.getMappingValue(list, "orgId", corporationId).orgId;
      // this.$emit("echoCommonDept", { corporationId:corporationDeptId });
      if (this.hasDepartment) {
        // 有部门
        // 请求该组织下全量部门接口
        this.getDeptTree(corporationDeptId);
      }
    },
    getDeptTree(corporationId) {
      let treeData = [];
      enterpriseDeptCorporationTree({
        corporationId,
      })
        .then((res) => {
          treeData = res.data ? res.data : [];
          let list = this.clTree(treeData);
          this.$emit("corporationDeptChange", list);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 所属部门改变
    departmentChange(value, label, extra) {
      this.$emit("departmentChange", value, label, extra);
      if (this.needDeptName && this.notTablePage) {
        this.$set(this.CommonFormInline, "deptName", label && label.join(","));
      }
    },
    // 重置按钮点击时清空所属组织和部门下拉数据
    reset() {
      this.commonOrgnizeList = [];
    },
    clTree(arr) {
      arr.forEach((element) => {
        if (element.childList && element.childList.length) {
          element.children = this.clTree(element.childList);
        }
      });
      return arr;
    },
  },
};
</script>
<style lang="less" scoped>
div.m-r-15 {
  display: inline-block;
}
.ngform-commonItem {
  display: flex;
  /deep/ label::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  /deep/ .ant-form-item-label {
    text-align: left;
  }
}
.error-item {
  color: red;
  line-height: 20px;
}
</style>
