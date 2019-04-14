<template>
  <div class="book-detail">
    <detail-title ref="title"></detail-title>
    <scroll class="content-wrapper" :top="40" :bottom="52" ref="scroll" @onScroll="onScroll">
      <book-info :bookItem="bookItem" :cover="cover" :title="title" :author="author" :desc="desc"></book-info>
      <!-- 版权信息 -->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.copyright')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.publisher')}}</div>
            <div class="book-detail-content-text">{{publisher}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.category')}}</div>
            <div class="book-detail-content-text">{{categoryText}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.lang')}}</div>
            <div class="book-detail-content-text">{{lang}}</div>
          </div>
          <div class="book-detail-content-row">
            <div class="book-detail-content-label">{{$t('detail.ISBN')}}</div>
            <div class="book-detail-content-text">{{isbn}}</div>
          </div>
        </div>
      </div>
      <!-- 目录信息 -->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.navigation')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <div
              class="book-detail-content-item"
              v-for="(item, index) in flatNavigation"
              :key="index"
              @click="read(item)"
            >
              <div
                class="book-detail-content-navigation-text"
                :class="{'is-sub': item.deep> 1}"
                :style="itemStyle(item)"
                v-if="item.label"
              >{{item.label}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 试读模块信息 -->
      <div class="book-detail-content-wrapper">
        <div class="book-detail-content-title">{{$t('detail.trial')}}</div>
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.displayed">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
        </div>
        <div id="preview" v-show="this.displayed" ref="preview"></div>
      </div>
    </scroll>
    <!-- 底部按钮 -->
    <div class="bottom-wrapper">
      <div class="bottom-btn" @click.stop.prevent="readBook()">{{$t('detail.read')}}</div>
      <div class="bottom-btn" @click.stop.prevent="trialListening()">{{$t('detail.listen')}}</div>
      <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">
        <span class="icon-check" v-if="inBookShelf"></span>
        {{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}
      </div>
    </div>
    <toast :text="toastText" ref="toast"></toast>
  </div>
</template>

<script>
import { detail } from "@/api/store.js";
import DetailTitle from "@/components/detail/DetailTitle.vue";
import BookInfo from "@/components/detail/BookInfo.vue";
import Toast from "@/components/Common/toast";
import Epub from "epubjs";
import Scroll from "@/components/Common/Scroll.vue";
import { px2rem, realPx } from "@/utils/utils";
import { getLocalStorage } from "@/utils/localStorage";
import { getLocalForage } from "@/utils/localForage";

export default {
  data() {
    return {
      bookItem: {},
      bookShelf: null,
      bookItem: null,
      book: null,
      metadata: null, // 数据信息
      trialRead: null,
      cover: null,
      navigation: null,
      displayed: false,
      audio: null,
      randomLocation: null,
      description: null,
      toastText: "",
      trialText: null,
      categoryText: null,
      opf: null
    };
  },
  computed: {
    // 将电子书目录转为一维数组
    flatNavigation() {
      if (this.navigation) {
        return Array.prototype.concat.apply(
          [],
          Array.prototype.concat.apply(
            [],
            this.doFlatNavigation(this.navigation.toc)
          )
        );
      } else {
        return [];
      }
    },
    // 获取电子书语种
    lang() {
      return this.metadata ? this.metadata.language : "-";
    },
    // 获取电子书isbn
    isbn() {
      return this.metadata ? this.metadata.identifier : "-";
    },
    // 获取电子书出版社
    publisher() {
      return this.metadata ? this.metadata.publisher : "-";
    },
    // 获取电子书摘要
    desc() {
      if (this.description) {
        return this.description.substring(0, 100);
      } else {
        return "";
      }
    },
    // 获取电子书书名
    title() {
      return this.metadata ? this.metadata.title : "";
    },
    // 获取电子书作者
    author() {
      return this.metadata ? this.metadata.creator : "";
    },
    // 判断当前的电子书是否存在于书架
    inBookShelf() {
      if (this.bookItem && this.bookShelf) {
        // 定义一个自执行函数，将书架转为一维数组结构，并且只保留type为1的数据（type=1的为电子书）
        const flatShelf = (function flatten(arr) {
          return [].concat(
            ...arr.map(v => (v.itemList ? [v, ...flatten(v.itemList)] : v))
          );
        })(this.bookShelf).filter(item => item.type === 1);
        // 查找当前电子书是否存在于书架
        const book = flatShelf.filter(
          item => item.fileName === this.bookItem.fileName
        );
        return book && book.length > 0;
      } else {
        return false;
      }
    }
  },
  components: {
    DetailTitle,
    BookInfo,
    Scroll,
    Toast
  },
  methods: {
    addOrRemoveShelf() {
      // 如果电子书存在于书架，则从书架中移除电子书
      if (this.inBookShelf) {
        removeFromBookShelf(this.bookItem);
      } else {
        // 如果电子书不存在于书架，则添加电子书到书架
        addToShelf(this.bookItem);
      }
      this.bookShelf = getLocalStorage("bookShelf");
    },
    // 展示Toast弹窗
    showToast(text) {
      this.toastText = text;
      this.$refs.toast.show();
    },
    // 阅读电子书
    readBook() {
      // getLocalForage(this.bookItem.fileName, (err, value) => {
      //   if (!err && value instanceof Blob) {
      //     this.$router.push({
      //       path: `/ebook/${this.bookItem.categoryText}|${this.fileName}`
      //     });
      //   } else {
      //     // this.showToast(this.$t('shelf.downloadFirst'))
      //     this.$router.push({
      //       path: `/ebook/${this.bookItem.fileName}`,
      //       query: {
      //         opf: this.opf
      //       }
      //     });
      //   }
      // });
      this.$router.push({
        // 跳转到阅读器页面
        path: `/ebook/${this.bookItem.categoryText}|${this.fileName}`
      });
    },
    // 听书
    trialListening() {
      // 如果电子书已经缓存，从IndexedDB中读取电子书
      getLocalForage(this.bookItem.fileName, (err, value) => {
        if (!err && value instanceof Blob) {
          this.$router.push({
            path: "/book-store/book-speaking",
            query: {
              fileName: this.bookItem.fileName
            }
          });
        } else {
          // 如果没有缓存，直接跳转到听书页面
          // this.showToast(this.$t('shelf.downloadFirst'))
          this.$router.push({
            path: "/book-store/book-speaking",
            query: {
              fileName: this.bookItem.fileName,
              opf: this.opf
            }
          });
        }
      });
    },
    // 通过章节阅读电子书
    read(item) {
      // getLocalForage(this.bookItem.fileName, (err, value) => {
      //   if (!err && value instanceof Blob) {
      //     console.log("666");
      //     this.$router.push({
      //       path: `/ebook/${this.bookItem.fileName}`,
      //       query: {
      //         navigation: item.href
      //       }
      //     });
      //   } else {
      //     // this.showToast(this.$t('shelf.downloadFirst'))
      //     this.$router.push({
      //       path: `/ebook/${this.bookItem.fileName}`,
      //       query: {
      //         navigation: item.href,
      //         opf: this.opf
      //       }
      //     });
      //   }
      // });
      this.$router.push({
        path: `/ebook/${this.categoryText}|${this.fileName}`,
        query: {
          href: item.href
        }
      });
    },
    // 电子书目录缩进样式
    itemStyle(item) {
      return {
        marginLeft: (item.deep - 1) * px2rem(20) + "rem"
      };
    },
    // 将目录从多维转为一维
    doFlatNavigation(content, deep = 1) {
      const arr = [];
      content.forEach(item => {
        item.deep = deep;
        arr.push(item);
        if (item.subitems && item.subitems.length > 0) {
          arr.push(this.doFlatNavigation(item.subitems, deep + 1));
        }
      });
      return arr;
    },
    display(location) {
      if (this.$refs.preview) {
        // rendition是epubjs负责阅读器的渲染
        if (!this.rendition) {
          // 渲染到一个 id为 preview的容器里
          this.rendition = this.book.renderTo("preview", {
            width: window.innerWidth > 640 ? 640 : window.innerWidth,
            height: window.innerHeight,
            method: "default"
          });
        }
        if (!location) {
          return this.rendition.display();
        } else {
          return this.rendition.display(location);
        }
      }
    },
    // 解析电子书
    parseBook(url) {
      // 解析一本电子书除了使用下载url还可以使用 opf
      this.book = new Epub(url);
      // 获取标题和作者信息
      this.book.loaded.metadata.then(metadata => {
        this.metadata = metadata;
      });
      // 获取目录信息
      this.book.loaded.navigation.then(nav => {
        this.navigation = nav;
        // nav下有个属性 toc数组,里面存放了目录信息
        // 通过第二章的目录（第一章通常是封面，所以获取第二章）
        if (
          this.navigation.toc &&
          this.navigation.toc.length > 1 &&
          this.navigation.toc[1]
        ) {
          // this.navigation.toc[1].href是一个A332689_1_En_9_ChapterPart3.html地址
          // 调用 book实例的 display 方法可以渲染到页面上
          // 将第二章进行渲染（渲染的内容隐藏在屏幕外，用户是看不见的）
          if (this.display(this.navigation.toc[1].href)) {
            this.display(this.navigation.toc[1].href).then(section => {
              if (this.$refs.scroll) {
                this.$refs.scroll.refresh();
              }
              this.displayed = true;
              // 渲染成功后通过section获取HTML文本，将HTML标签进行替换，提取纯文本信息
              const reg = new RegExp("<.+?>", "g");
              // 获取首页文字作为简要描述
              const text = section.output.replace(reg, "").replace(/\s\s/g, "");
              // 将纯文本信息保存到description变量中，用于进行摘要信息展示
              this.description = text;
            });
          }
        }
      });
    },
    // 初始化
    init() {
      // 获取电子书书名
      this.fileName = this.$route.query.fileName;
      // 获取电子书分类
      this.categoryText = this.$route.query.category;
      if (this.fileName) {
        // 我们封装的 detail 方法去请求线上地址的数据
        detail({ fileName: this.fileName }).then(response => {
          if (response && response.status === 200) {
            let data = response.data.data;
            this.bookItem = data; // 详情书籍数据
            this.cover = this.bookItem.cover; // 封面图片
            let rootFile = data.rootFile; // opf路径
            if (rootFile.startsWith("/")) {
              rootFile = rootFile.substring(1, rootFile.length);
            }
            // 一个线上接口,把所有电子书解压成opf格式
            // 根据rootFile拼接出opf文件路径
            this.opf = `${process.env.VUE_APP_EPUB_OPF_URL}/${
              this.fileName
            }/${rootFile}`;
            // 去解析
            this.parseBook(this.opf);
          } else {
            // 请求失败时打印错误提示
            this.showToast(response.data.msg);
          }
        });
      }
    },
    onScroll(offsetY) {
      if (offsetY > realPx(42)) {
        this.$refs.title.showShadow();
      } else {
        this.$refs.title.hideShadow();
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.book-detail {
  width: 100%;
  background: white;
  .content-wrapper {
    width: 100%;
    // 版权样式
    .book-detail-content-wrapper {
      width: 100%;
      border-bottom: px2rem(1) solid #eee;
      box-sizing: border-box;
      .book-detail-content-title {
        font-size: px2rem(20);
        font-weight: bold;
        padding: px2rem(20) px2rem(15) px2rem(10) px2rem(15);
        box-sizing: border-box;
      }
      .book-detail-content-list-wrapper {
        padding: px2rem(10) px2rem(15);
        box-sizing: border-box;
        .loading-text-wrapper {
          width: 100%;
          .loading-text {
            font-size: px2rem(14);
            color: #666;
          }
        }
      }
      .book-detail-content-row {
        display: flex;
        box-sizing: border-box;
        margin-bottom: px2rem(10);
        .book-detail-content-label {
          flex: 0 0 px2rem(70);
          font-size: px2rem(14);
          color: #666;
        }
        .book-detail-content-text {
          flex: 1;
          font-size: px2rem(14);
          color: #333;
        }
      }
      .book-detail-content-item-wrapper {
        .book-detail-content-item {
          padding: px2rem(15) 0;
          font-size: px2rem(14);
          line-height: px2rem(16);
          color: #666;
          border-bottom: px2rem(1) solid #eee;
          &:last-child {
            border-bottom: none;
          }
          .book-detail-content-navigation-text {
            width: 100%;
            @include ellipsis;
            &.is-sub {
              color: #666;
            }
          }
        }
      }
    }
    .audio-wrapper {
      width: 100%;
      padding: px2rem(15);
      box-sizing: border-box;
      #audio {
        width: 100%;
      }
    }
  }
  .bottom-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(52);
    box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, 0.1);
    .bottom-btn {
      flex: 1;
      color: rgb(74, 171, 255);
      font-weight: bold;
      font-size: px2rem(14);
      @include center;
      &:active {
        color: rgba(74, 171, 255, 0.5);
      }
      .icon-check {
        margin-right: px2rem(5);
      }
    }
    &.hide-shadow {
      box-shadow: none;
    }
  }
}
</style>
