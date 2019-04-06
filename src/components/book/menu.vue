<template>
  <div class="wrapper">
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        v-show="menuVisible"
        :class="{'hide-boxshadow': !menuVisible || settingVisible>=0 }"
      >
        <div class="menu-item">
          <i class="icon-menu"  @click="setting(3)"></i>
        </div>
        <div class="menu-item">
          <i class="icon-progress" @click="setting(2)"></i>
        </div>
        <div class="menu-item">
          <i class="icon-bright" @click="setting(1)"></i>
        </div>
        <div class="menu-item">
          <i class="icon-A" @click="setting(0)"></i>
        </div>
      </div>
    </transition>

    <setting-font></setting-font>
    <font-family-list></font-family-list>
    <setting-theme></setting-theme>
    <setting-progress></setting-progress>
    <setting-slider></setting-slider>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import { bookMixin } from "@/utils/mixin.js";
import SettingFont from "./settingFont.vue";
import SettingTheme from "./settingTheme.vue";
import FontFamilyList from "./FontFamilyList.vue";
import SettingProgress from './settingProgress.vue';
import SettingSlider from './slide.vue';
export default {
  mixins: [bookMixin],
  components: {
    SettingFont,
    FontFamilyList,
    SettingTheme,
    SettingProgress,
    SettingSlider
  },
  computed: {
    ...mapGetters(["menuVisible"])
  },
  methods: {
    setting(val) {
      this.setSettingVisible(val);
    }
  }
};
</script>


<style lang="scss">
@import "./../../assets/styles/global.scss";
.wrapper {
  position: relative;
  left: 0;
  bottom: 0;
  z-index: 200;
  .menu-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    height: px2rem(50);
    width: 100%;
    display: flex;
    background: #fff;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.1);
    z-index: 101;
    .menu-item {
      font-size: px2rem(22);
      @include center;
      flex: 1;
    }
  }
  .hide-boxshadow{
    box-shadow: none;
  }
}
</style>