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
import { saveBookShelf, removeLocalStorage } from "@/utils/localStorage.js";
import { download } from "@/utils/store.js";
import { removeLocalForage } from "@/utils/localForage.js";
import { Promise } from "q";
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
      popupMenu: null
    };
  },
  methods: {
    Oncomplete() {
      this.hidePopup();
      this.setIsEditMode(false);
      saveBookShelf(this.shelfList); //将数据保存到 localStorage中
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
        this.simpleToast(this.$t("shelf.setPrivateSuccess")); // 调用通用消息组件
      } else {
        this.simpleToast(this.$t("shelf.closePrivateSuccess"));
      }
      this.Oncomplete();
    },

    // 下载图书
    async downLoadSelectedBook() {
      // 遍历我们的选择图书
      for (var i = 0; i < this.shelfSelected.length; i++) {
        // 这里的then后面的回调函数是等下面的 downloadBook方法调用resolve才执行!
        await this.downloadBook(this.shelfSelected[i]).then(book => {
          // 让选中的图书的cache属性为true表示已经下载
          book.cache = true;
        });
      }
    },

    // 下载具体书籍
    downloadBook(book) {
      let text = "";
      let toast = this.simpleToast(text);
      toast.continueShow(); //持续显示
      // 这里return Promise是为了给上面的调用downloadBook时方便
      return new Promise((resolve, reject) => {
        download(
          book,
          book => {
            // 这里要使用vue-create-api提供的方法 remove()
            // 不然的话我们上面传递的text一直保留着,不能传递第二个text进去
            toast.remove();
            // 开始执行 .then()的第一个回调,并且把book作为参数传递进去
            resolve(book);
          },
          reject,
          // 这是 download 方法的第四个参数,传递给 axios 的 onDownloadProgress持续监听
          progressEvent => {
            let progress = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            // text是进度计算 下载百分比
            text = this.$t("shelf.progressDownload").replace(
              "$1",
              `${book.fileName}.epub(${progress}%)`
            );
            toast.changeText(text); //组件内部的方法
          }
        );
      });
    },

    // 删除缓存图书
    removeSelectedBook() {
      Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(
        books => {
          // Promise.all()可以将多个Promise实例包装成一个新的Promise实例
          // 成功的时候返回的是一个结果数组，把每个Promise实例的结果放到一个数组中
          books.map(book => {
            book.cache = false;
          });
          saveBookShelf(this.shelfList);  // 把当前选中的书籍报存到 localStorage中去
          this.simpleToast(this.$t("shelf.removeDownloadSuccess"));
        }
      );
    },
    // 调用 localForage 删除本地缓存
    removeBook(book) {
      return new Promise((resolve, reject) => {
        // 顺便也把本地 localStorage 数据也删除
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`);
        removeLocalForage(`${book.fileName}`);
        resolve(book);
      });
    },
    // 设置下载
    async setDownLoad() {
      this.Oncomplete();
      if (this.isDownLoad) {
        this.removeSelectedBook(); // 删除缓存图书
      } else {
        // 这里要使用 await 同步化,不然的话上面的还在下载,下面的就把上面的信息给覆盖了
        await this.downLoadSelectedBook();
        saveBookShelf(this.shelfList);
        this.simpleToast(this.$t("shelf.setDownloadSuccess"));
      }
    },

    // 移除图书
    removeSelected() {
      // 设置并过滤到我们选中的数据 
      // 将我们选中的数组的每一项和我们的所有数据进行比对,如果相同则删除
      this.shelfSelected.forEach(selected => {
        // 保存到vuex中
        this.setShelfList(
          this.shelfList.filter(book => {
            return book != selected;
          })
        );
        console.log(this.shelfList,'6666')
      });
      this.setShelfSelected([]); // 设置选中图书暑假为空
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

// Promise 中的 resolve 是指成功后的回调函数!!
// 是把 resolve中的参数传递给 then()中的第一个函数的参数!!!
/*
      functionA() {
        this.functionB().then(() => {
          console.log(111);
        });
      },
      functionB() {
        let b = 1;
        return new Promise((resolve, reject) => {
          this.functionC(b, b => {
            resolve();
          });
        });
      },
      functionC(par, onSuccess, onErr) {
        if (onSuccess) {
          // onSuccess();
          console.log(111111);
        }
      },
  */
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

