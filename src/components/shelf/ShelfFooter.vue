<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div
      class="shelf-footer-tab-wrapper"
      v-for="item in tabs"
      :key="item.index"
      @click="onTabClick(item)"
    >
      <div class="shelf-footer-tab" :class="{'is-selected': isSelected}">
        <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index === 2 && !isDownLoad"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index === 2 && isDownLoad"></div>
        <div class="icon-move tab-icon" v-if="item.index === 3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'remove-text': item.index===4}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>


<script>
import { storeShelfMixin } from "../../utils/mixin";
import {saveBookShelf} from '@/utils/localStorage.js';
export default {
  mixins: [storeShelfMixin],
  computed: {
    isSelected() {
      return this.shelfSelected && this.shelfSelected.length > 0;
    },
    // 底部按钮
    tabs() {
      return [
        {
          label: this.$t("shelf.private"),
          label2: this.$t("shelf.noPrivate"),
          index: 1
        },
        {
          label: this.$t("shelf.download"),
          label2: this.$t("shelf.delete"),
          index: 2
        },
        {
          label: this.$t("shelf.move"),
          index: 3
        },
        {
          label: this.$t("shelf.remove"),
          index: 4
        }
      ];
    },
    // 判断是不是私密阅读
    isPrivate() {
      if (!this.isSelected) {
        return false;
      } else {
        // 只有选中书籍列表中的所有书都是私密的,按钮才会显示关闭私密阅读
        // every 是所有都满足才会返回true
        return this.shelfSelected.every(item => item.private);
      }
    },
    // 判断是否已经下载过
    isDownLoad() {
      if (!this.isSelected) {
        return false;
      } else {
        return this.shelfSelected.every(item => item.cache);
      }
    }
  },
  data() {
    return {
      popupMenu: null,
    };
  },
  methods: {
    Oncomplete(){
      this.hidePopup();
      this.setIsEditMode(false);
      saveBookShelf(this.setShelfList); //将数据保存到 localStorage中
    },
    // 隐藏私密弹出窗口
    hidePopup() {
      this.popupMenu.hide();
    },
    // 设置私密阅读
    setPrivate() {
      let isPrivate;
      if (this.isPrivate) {
        // 如果选中图书的列表都是私密阅读的
        isPrivate = false;
      } else {
        isPrivate = true;
      }
      // 让选中的图书列表中的 private 属性改变
      this.shelfSelected.forEach(book => {
        book.private = isPrivate;
      });
      if (isPrivate) {
        this.simpleToast(this.$t("shelf.setPrivateSuccess")).show(); // 调用通用消息组件
      } else {
        this.simpleToast(this.$t("shelf.closePrivateSuccess")).show();
      }
      this.Oncomplete();
    },
    // 开始下载
    setDownLoad() {
      let isDownLoad;
      if (this.isDownLoad) {
        isDownLoad = false;
      } else {
        isDownLoad = true;
      }
      // 设置书籍的缓存属性
      this.shelfSelected.forEach(book => {
        book.cache = isDownLoad;
      });
      this.downLoadBook();
      if (isDownLoad) {
        this.simpleToast(this.$t("shelf.setDownloadSuccess")).show();
      } else {
        this.simpleToast(this.$t("shelf.removeDownloadSuccess")).show();
      }
      this.Oncomplete();
    },
    // 下载图书
    downLoadBook() {},
    // 移除图书
    removeSelected() {
      // 设置并过滤到我们选中的数据
      this.shelfSelected.forEach(selected => {
        this.setShelfList(
          this.shelfList.filter(book => {
            return book != selected;
          })
        );
      });
      this.setShelfSelected([]);  // 设置选中图书暑假为空
      this.Oncomplete();
    },
    // 显示私密弹出窗口
    showPrivate() {
      this.popupMenu = this.$createPopup({
        $props: {
          text: this.isPrivate
            ? this.$t("shelf.closePrivateTitle")
            : this.$t("shelf.setPrivateTitle"),
          btn: [
            {
              text: this.isPrivate
                ? this.$t("shelf.close")
                : this.$t("shelf.open"),
              click: () => {
                this.setPrivate();
              }
            },
            {
              text: this.$t("shelf.cancel"),
              click: () => {
                this.hidePopup();
              }
            }
          ]
        }
      }).show();
    },

    // 显示下载弹出窗口
    showDownload() {
      this.popupMenu = this.$createPopup({
        $props: {
          text: this.isDownLoad
            ? this.$t("shelf.removeDownloadTitle")
            : this.$t("shelf.setDownloadTitle"),
          btn: [
            {
              text: this.isDownLoad
                ? this.$t("shelf.delete")
                : this.$t("shelf.open"),
              click: () => {
                this.setDownLoad();
              }
            },
            {
              text: this.$t("shelf.close"),
              click: () => {
                this.hidePopup();
              }
            }
          ]
        }
      }).show();
    },

    // 显示移除弹出窗口
    showRemove() {
      this.popupMenu = this.$createPopup({
        $props: {
          text:
            this.shelfSelected.length === 1
              ? this.$t("shelf.removeBookTitle").replace(
                  "$1",
                  this.shelfSelected[0].title
                )
              : this.$t("shelf.removeBookTitle").replace(
                  "$1",
                  this.$t("shelf.selectedBooks")
                ),
          btn: [
            {
              text: this.$t("shelf.removeBook"),
              click: () => {
                this.removeSelected();
              }
            },
            {
              text: this.$t("shelf.cancel"),
              click: () => {
                this.hidePopup();
              }
            }
          ]
        }
      }).show();
    },
    onTabClick(item) {
      if (!this.isSelected) {
        return;
      }
      switch (item.index) {
        case 1:
          this.showPrivate();
          break;
        case 2:
          this.showDownload();
          break;
        case 3:
          // this.dialog().show();
          break;
        case 4:
          this.showRemove();
          break;
        default:
          break;
      }
    },
    label(item) {
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label;
        case 2:
          return this.isDownLoad ? item.label2 : item.label;
        default:
          return item.label;
      }
    }
  }
};
</script>



<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.shelf-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, 0.1);
  .shelf-footer-tab-wrapper {
    flex: 1;
    width: 25%;
    height: 100%;
    .shelf-footer-tab {
      width: 100%;
      height: 100%;
      opacity: 0.5;
      flex-direction: column;
      @include center;
      &.is-selected {
        opacity: 1;
      }
      .tab-icon {
        font-size: px2rem(20);
        color: #666;
      }
      .tab-text {
        margin-top: px2rem(5);
        font-size: px2rem(12);
        color: #666;
        &.remove-text {
          color: rgb(255, 102, 159);
        }
      }
      .icon-shelf {
        color: rgb(255, 102, 159);
      }
    }
  }
}
</style>
