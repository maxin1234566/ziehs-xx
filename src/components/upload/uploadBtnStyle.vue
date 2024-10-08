<template>
  <div class="upload-btn">
    <a-upload
      :name="multipartFile"
      :accept="acceptList.toString()"
      :action="action"
      :headers="headers"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :remove="removeFile"
      @change="handleChange"
      :showUploadList="showUploadList"
      :disabled="loading"
      :multiple="multiple"
      :class="[onlyShow ? 'onlyShow' : '']"
      class="upload-btn-style"
    >
      <template v-if="!useSlot">
        <a-button :type="btnType" :loading="!showUploadList && loading" v-if="!onlyShow">
          <a-icon :type="!showUploadList && loading ? 'loading' : btnIcon " v-if="btnIcon" />
          {{ btnText }}
        </a-button>
        <p style="margin-top: 6px" v-if="showAcceptText && !onlyShow">支持扩展名：{{ accept.join("，") }}</p>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </a-upload>
    <CommonModal title="导入结果" :visible="resultVisible" :cancelFn="resultCancel" class="result-visible">{{ resultText }}</CommonModal>
  </div>
</template>

<script>
import serviceNameList from "@/config/default/service.config.js";
import { cloneDeep } from "lodash";
export default {
  props: {
    //请求地址
    action: {
      type: String,
      default: `${process.env.VUE_APP_API_BASE_URL}/ziehs-sysManage/api/file/uploadFile`,
    },
    // 按钮文字
    btnText: {
      type: String,
      default: "上传文件",
    },
    // 上传file参数 // 默认multipartFile 另一种情况为file
    multipartFile: {
      type: String,
      default: "multipartFile",
    },
    // 按钮样式
    btnType: {
      type: String,
      default: "default",
    },
    // 按钮icon
    btnIcon: {
      type: [String, Boolean],
      default: "upload",
    },
    fileLists: {
      type: Array,
    },
    // 文件类型限制
    accept: {
      type: Array,
      default: () => [
        ".xlsx",
        ".xls",
        ".doc",
        ".docx",
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
      ],
    },
    // 显示文件类型文字
    showAcceptText: {
      type: Boolean,
      default: true,
    },
    // 文件大小限制
    maxSize: {
      type: Number,
      default: 20,
    },
    // 最大上传数量
    limit: {
      type: Number,
      default: 0,
    },
    // 批量上传
    multiple: {
      type: Boolean,
      default: false,
    },
    // 使用插槽
    useSlot: {
      type: Boolean,
      default: false,
    },
    // 是否显示列表
    showUploadList: {
      type: Boolean,
      default: true,
    },
    // 仅仅展示
    onlyShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 当前文件列表-可控
      fileList: [
        // {
        // uid: '-1',
        // name: 'image.png',
        // status: 'done',
        // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
      ],
      headers: { Authorization: "", routerCode: '' },
      loading: false,
      resultVisible: false,
      resultText: "",
    };
  },
  computed: {
    // 根据最大上传数量判断是否可以上传
    canUploadByLimit() {
      let canUpload = true;
      // console.log(this.limit, this.fileList, "...12");
      if (this.limit) {
        if (this.fileList.length >= this.limit) {
          canUpload = false;
        }
      }
      return canUpload;
    },
    // 文件类型限制
    acceptList() {
      let newAccept = cloneDeep(this.accept)
      // 针对ppt进行特殊处理
      if (newAccept.includes('.ppt')) {
        newAccept = [...newAccept, '.pptx']
      }
      return newAccept
    }
  },
  mounted() {
    // 设置header
    this.setAuthorization();
  },
  watch: {
    fileLists: {
      handler(newV) {
        this.fileList = cloneDeep(newV) || [];
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 上传之前
    beforeUpload(file) {
      if (!this.canUploadByLimit) {
        this.$antMessage.warn(`最多上传${this.limit}个文件`);
        return false;
      }
      if (!this.fileTypeAndSizeTest(file)) return false;
      // 存储文件
      this.file = file;
      this.loading = true;
    },
    // 检测文件类型和大小
    fileTypeAndSizeTest(file) {
      // 获取当前文件类型
      let fileType = file.name.substring(file.name.lastIndexOf("."));
      fileType = fileType.toLowerCase();
      console.log(fileType, this.acceptList, this.acceptList.includes(fileType));
      let isLegalType = this.acceptList.length ? this.acceptList.includes(fileType) : true;
      !isLegalType && this.$antMessage.warn("上传文件类型错误");
      // 检测文件大小
      let isMoreThen = file.size / 1048576 - this.maxSize < 0.05;
      !isMoreThen && this.$antMessage.warn(`文件大小不能超过${this.maxSize}M`);
      // 最终结果
      return isLegalType && isMoreThen;
    },
    // 上传状态改变
    handleChange(info) {
      // console.log('上传info', info);
      // 状态有：uploading done error removed
      let uploadState = info.file.status;
      if (uploadState) {
        this.fileList = [...info.fileList];
      }
      switch (uploadState) {
        case "uploading":
          break;
        case "done":
          if (info.file.response.code == 20000) {
            this.uploadDone(info.file.response);
          } else {
            this.uploadError(info.file.response);
          }
          break;
        case "error":
          this.uploadError(info.file.response);
          break;
        case "removed":
          break;
        default:
          console.log("文件上传状态异常。。。");
      }
    },
    // 上传成功
    uploadDone(res) {
      // console.log("上传成功", res);
      if (res.data) {
        let { id, url } = res.data;
        this.fileList.some((item) => {
          if (item.uid == this.file.uid) {
            this.$set(item, "id", id);
            this.$set(item, "url", url);
            return true;
          }
        });
      }
      this.$emit("handleSuccess", this.fileList);
      if (res.data && res.data.code == 200001) {
        this.resultText = res.data.result;
        this.resultVisible = true;
      } else {
        this.$antMessage.success(`上传成功`);
      }
      setTimeout(() => {
        this.loading = false;
      }, 600);
    },
    // 上传失败
    uploadError(res) {
      // console.log('上传失败', res);
      this.fileList = this.fileList.filter((item) => {
        return item.uid !== this.file.uid;
      });
      let errMsg = res.message || "上传失败";
      this.$antMessage.warn(errMsg);
      this.$emit("handleError", res);
      setTimeout(() => {
        this.loading = false;
      }, 600);
    },
    // 移除文件
    removeFile(file) {
      // console.log('项目移除了', file);
      this.fileList = this.fileList.filter((item) => {
        return item.uid !== file.uid;
      });
      this.$antMessage.success(`移除成功`);
      this.$emit("handleSuccess", this.fileList);
    },
    // 设置header
    setAuthorization() {
      const token_type = sessionStorage.getItem("token_type");
      const token = sessionStorage.getItem("access_token");
      this.headers.Authorization = token_type + " " + token;
      this.headers.routerCode = sessionStorage.getItem('routerCode');
    },
    // 导入结果弹框关闭
    resultCancel() {
      this.resultVisible = false;
      this.$emit("resultCancel", false);
    },
  },
};
</script>

<style lang="less" scoped>
.upload-btn {
  display: inline-block;
}
.result-visible {
  /deep/ .ant-modal-body {
    .model-content {
      min-height: 100px;
    }
  }
}
.upload-btn-style {
  display: inline-block;
  // margin-right: 10px;
}
.onlyShow {
  ::v-deep .ant-upload-list-item-card-actions {
    display: none;
  }
}
</style>
