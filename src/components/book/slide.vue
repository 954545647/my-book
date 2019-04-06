<template>
  <transition name="fade">
    <div class="slide-content-wrapper" v-show="settingVisible === 3 && menuVisible">
      <transition name="slider-left-right">
        <div class="content" v-if="settingVisible===3">
          <div class="content-page-wrapper" v-if="bookAvailable">
            <div class="content-page">
              <component :is="currentTab === 1 ? content : bookmark"></component>
            </div>
            <div class="content-page-tab">
              <div
                class="content-page-tab-item"
                :class="{selected : tabItem === 0}"
                @click="ChangeNavigation(0)"
              >{{$t('book.navigation')}}</div>
              <div
                class="content-page-tab-item"
                :class="{selected : tabItem === 1}"
                @click="ChangeBookmark(1)"
              >{{$t('book.bookmark')}}</div>
            </div>
          </div>
          <div class="content-page-empty" v-else>
            <slide-loading></slide-loading>
          </div>
        </div>
      </transition>
      <div class="content-bg" @click="hideSlider()"></div>
    </div>
  </transition>
</template>

<script>
import { bookMixin } from "@/utils/mixin.js";
import SlideContent from "./slideContent.vue";
import SlideBookMark from "./slideBookMark.vue";
import SlideLoading from "../Common/Loading.vue";
export default {
  mixins: [bookMixin],
  data() {
    return {
      tabItem: 0,
      currentTab: 1,
      content: SlideContent,
      bookmark: SlideBookMark
    };
  },
  components: {
    SlideLoading
  },
  methods: {
    hideSlider() {
      this.hideMenu();
    },
    ChangeNavigation(val) {
      this.tabItem = val;
      this.currentTab = 1;
    },
    ChangeBookmark(val) {
      this.tabItem = val;
      this.currentTab = 0;
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/styles/global.scss";
.slide-content-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: 300;
  display: flex;
  .content {
    flex: 0 0 85%;
    width: 85%;
    height: 100%;
    .content-page-wrapper {
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      .content-page {
        flex: 1;
        overflow: hidden;
        width: 100%;
      }
      .content-page-tab {
        display: flex;
        flex: 0 0 px2rem(48);
        height: px2rem(48);
        .content-page-tab-item {
          flex: 1;
          font-size: px2rem(16);
          @include center;
        }
      }
    }
    .content-page-empty {
      width: 100%;
      height: 100%;
      @include center;
    }
  }
  .content-bg {
    flex: 0 0 15%;
    width: 15%;
    height: 100%;
  }
}
</style>
