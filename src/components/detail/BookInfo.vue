<template>
    <!-- 头部图书图片,作者 -->
    <div class="cover-title-wrapper">
      <div class="cover-title-left-wrapper">
        <img :src="cover" alt>
      </div>
      <div class="cover-title-right-wrapper">
        <div class="detail-cover-title-wrapper">
          <div class="cover-title-text">{{title}}</div>
        </div>
        <div class="cover-author-wrapper">
          <div class="cover-author-text">{{author}}</div>
        </div>
        <div class="detail-cover-description-wrapper">
          <div class="detail-cover-description-text">{{desc}}</div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    bookItem: {
      type: Object,
      default: () => {}
    },
    cover: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    author: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    }
  },

};
</script>

<style lang="scss">
@import "@/assets/styles/global.scss";
.cover-title-wrapper {
  width: 100%;
  // height: 100%;
  display: flex;
  padding: px2rem(20) px2rem(15) px2rem(20) px2rem(15);
  box-sizing: border-box;
  border-bottom: px2rem(1) solid #C0BABA;
  .cover-title-left-wrapper {
    flex: 0 0 px2rem(100);
    height: px2rem(150);
    width: 100%;
    padding-right: px2rem(15);
    img {
      width: 100%;
      height: 100%;
      background-size: 100% 100%;
    }
  }
  .cover-title-right-wrapper {
    width: 100%;
    height: px2rem(150);
    flex: 1;
    display: flex;
    flex-direction: column;
    .detail-cover-title-wrapper {
      padding-bottom: px2rem(15);
      .cover-title-text {
        font-size: px2rem(22);
        font-weight: 700;
        color: #333;
      }
    }
    .cover-author-wrapper {
      padding-bottom: px2rem(10);
      .cover-author-text {
        font-size: px2rem(14);
        color: #4aabff;
      }
    }
    .detail-cover-description-wrapper {
      padding-bottom: px2rem(10);
      .detail-cover-description-text {
        color: #666;
        font-size: px2rem(14);
        overflow: hidden;
        white-space:normal;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
      }
    }
  }
}
</style>
