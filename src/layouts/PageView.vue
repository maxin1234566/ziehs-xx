<template>
  <PageLayout>
    <PageToggleTransition :disabled="animate.disabled" class="page-view clx-box-padding clx-box-bg"
      :animate="animate.name" :direction="animate.direction">
      <div class="breadcrumb" v-show="!hideBreadcrumb">
        <Breadcrumb />
      </div>
      <div class="page-view-main">
        <keep-alive>
          <router-view v-if="iskeepalive" ></router-view>
        </keep-alive>
        <router-view v-if="!iskeepalive" ></router-view>
        <!-- <keep-alive>
          <router-view v-if="$route.meta.iskeepalive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.iskeepalive"></router-view> -->
      </div>
    </PageToggleTransition>
  </PageLayout>
</template>

<script>
import PageLayout from "./PageLayout";
import PageToggleTransition from "../components/transition/PageToggleTransition";
import { mapState, mapMutations } from "vuex";
import Breadcrumb from '@/components/breadcrumb/breadcrumb.vue'
export default {
  name: "PageView",
  components: { PageToggleTransition, PageLayout, Breadcrumb },
  data() {
    return {
      hideBreadcrumb: false,
    };
  },
  computed: {
    ...mapState("setting", ["isMobile", "multiPage", "animate"]),
    ...mapState("system", ['isBOMPopstate']),
    iskeepalive() {
      return this.$route.meta && this.$route.meta.isKeepalive
    },
  },
  mounted() {
    this.hideBreadcrumb = this.$route.path == '/safeManage/dangerWorkStatic/dangerWorkSpatialPattern'
  },
  methods: {
    ...mapMutations('system', ['setKeepalive', 'setIsBOMPopstate']),
  },
  //监听路由
  watch: {
    '$route'(to, from) {
      // console.log('跳转了', to, from, this.isBOMPopstate);
      this.hideBreadcrumb = to.path == '/safeManage/dangerWorkStatic/dangerWorkSpatialPattern'
      if (to.meta && to.meta.isKeepalive) {
        if (this.isBOMPopstate) {
          this.setKeepalive(true)
        }
        setTimeout(() => {
          this.setIsBOMPopstate(false)
        }, 300);
      } else {
        this.setKeepalive(false)
      }
    },
  },
};
</script>

<style lang="less" scoped>
.extraImg {
  margin-top: -60px;
  text-align: center;
  width: 195px;

  img {
    width: 100%;
  }
}

.page-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .breadcrumb {
    margin-bottom: 10px;
    flex: none;
  }

  .page-view-main {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
}
</style>
