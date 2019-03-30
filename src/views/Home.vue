<template>
  <div class="home">
    <div id="read"></div>
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
