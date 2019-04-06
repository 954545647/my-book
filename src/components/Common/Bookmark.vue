<template>
  <div class="bookmark" :style="style" ref="bookmark"></div>
</template>

<script>
import {px2rem} from '@/utils/utils.js';
export default {
  props: {
    width: {
      type: Number,
      default:20
    },
    height: {
      type: Number,
      default: 30
    },
    color: {
      type: String,
      default: "white"
    }
  },
  computed: {
    style() {
      return {
        borderColor: `${this.color} ${this.color} transparent ${this.color}`
      };
    }
  },
  methods: {
    refresh() {
      this.$refs.bookmark.style.borderWidth = `
      ${px2rem(this.height - 10)}rem 
      ${px2rem(this.width / 2)}rem
      ${px2rem(10)}rem ${px2rem(this.width / 2)}rem
      `;
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style lang="scss">
@import "./../../assets/styles/global.scss";

.bookmark {
  width: 0;
  height: 0;
  border-width: px2rem(30) px2rem(10) px2rem(10) px2rem(10);
  border-style: solid;
  color: white;
  border-color: white white transparent white;
}
</style>