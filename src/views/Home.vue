<template>
  <div class="home">
    <div id="read"></div>
    <i class="icon-bookmark"></i>
    <span class="new">5655</span>
    <span>55554412</span>
  </div>
</template>

<script>
import Epub from "epubjs";
global.ePub = Epub;
const DOWNLOAD_URL = "/三国演义.epub";
export default {
  name: "home",
  methods: {
    showEpub() {
      // 生成book
      this.book = new Epub(DOWNLOAD_URL);
      // 生成 rendition 通过 Book.renderTo渲染
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight
      });
      // 通过 Rendion.display渲染电子书
      this.rendition.display();
    }
  },
  mounted() {
    this.showEpub();
  }
};
</script>

<style lang="scss" scoped>
@import './../assets/styles/global.scss';
.new{
  font-family: 'Days One';
  font-size: px2rem(12);
}
span{
  font-size: px2rem(20);
}
</style>

