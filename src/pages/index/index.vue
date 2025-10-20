<template>
  <view class="index_main">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>
    <view class="container">
      <view class="search_main" @click="toSearch">
        <view class="search_icon">
          <!-- <img src="static/index/search.png" alt="" /> -->
          <u-icon name="search" color="#ddd" size="48rpx"></u-icon>
        </view>
        <view class="search_text">Search by keywords</view>
      </view>
      <view class="banner_main">
        <u-swiper :list="bannerList" radius="8" imgMode="cover" height="233rpx"></u-swiper>
      </view>
      <view class="practice_main_top">
        <view class="left_item" @click="modeSelect('MockTest', 7)">
          <view class="item_title">Mock Test</view>
          <view class="item_content">Practice Like the Real Exam</view>
        </view>
        <view class="right_item">
          <view class="right_item_top" @click="modeSelect('TheoryTest', 2)">
            <view class="item_title" style="color: #4379bb">Theory Test</view>
            <view class="item_score" style="color: #4379bb">Score：{{getScore('Theory Test')}}</view>
          </view>
          <view class="right_item_bottom" @click="modeSelect('HazardTest', 3)">
            <view class="item_title" style="color: #b77a2a">Hazard Test</view>
            <view class="item_score" style="color: #b77a2a">Score：{{getScore('Hazard Test')}}</view>
          </view>
        </view>
      </view>
      <view class="practice_main_bottom">
        <view class="left_item" @click="modeSelect('HighwayCode', 5)">
          <view class="item_title" style="color: #4fa62a">Highway Code</view>
          <view class="item_score" style="color: #4fa62a">Score：{{getScore('Highway Code')}}</view>
        </view>
        <view class="right_item">
          <view class="right_item_top" @click="modeSelect('RodeSign', 4)">
            <view class="item_title" style="color: #336cb5">Rode Sign</view>
            <view class="item_score" style="color: #336cb5">Score：{{getScore('Rode Sign')}}</view>
          </view>
        </view>
      </view>
      <view class="prctice_main_end" @click="wrongQuestionBook">
        <view class="end_title">Wrongs Bookmarks</view>
        <view class="end_content">Identify Learning Gaps & Boost Skills Fast</view>
      </view>
    </view>
    
  </view>
</template>

<script>
  import {
    getTypeFind,
    queryAllQuestion
  } from '@/http/api/index.js'
  import {formatScore} from '@/utils/number'
  export default {
    data() {
      return {
        bannerList: [
          require("static/index/banner.png"),
          require("static/index/banner1.png"),
        ],
        drivingTest: [] // 测试模块
      };
    },
    onLoad () {
      const subjects = uni.getStorageSync('subjects')
      if (!subjects) {
        this.queryAllQuestion()
      }
    },
    onShow() {
      this.doGetTypeFind()
    },
    methods: {
      toSearch() {
        uni.navigateTo({
          url: "/pages/index/search",
        });
      },
      wrongQuestionBook() {
        uni.navigateTo({
          url: "/pages/my/mySaved",
        });
      },
      modeSelect(title, id) {
        /*
         * author：Gengbaodada
         * create by date：2025/07/27
         * content：mock : 模拟考试  theory:理论考试  Hazard Test: 危险测试  Highway Code:公用通道法规   Rode Sign: 道路标识
         */
        // const id = this.drivingTest.find(item => item.name === title) ? this.drivingTest.find(item => item.name === title).id : null
        switch (title) {
          case 'MockTest':
            uni.navigateTo({
              url: "/pages/mockTest/mockTest"
            });
            break;
            // case 'RodeSign':
            //   uni.navigateTo({
            //     url: "/pages/roadSign/roadSign?id=" + id
            //   });
            //   break;
          default:
            uni.navigateTo({
              url: "/pages/modeSelect/index?id=" + id + "&title=" + title
            });
            break;
        }
      },
      doGetTypeFind() {
        getTypeFind().then((res) => {
          this.drivingTest = res.data[0].children
        });
      },
      getScore(name) {
        const scoreInfo = this.drivingTest.find(item => item.name === name)
        return formatScore(scoreInfo ? scoreInfo.score : 0)
      },
      // 第一次进入，获取题库
      queryAllQuestion () {
        queryAllQuestion().then(res => {
          console.log(res)
          if (res.code == 1) {
            // 缓存题目
            uni.setStorageSync('subjects', res.data.subjects)
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  /* 渐变背景 */
  .gradient-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }

  .gradient-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 45%;
    background: linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 100%);
  }

  .gradient-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 55%;
    background: linear-gradient(180deg, #FFFFFF 0%, #FFF4F4 100%);
  }
  .container {
    z-index: 10;
    flex: 1;
    padding-top: 60rpx;
  }
  .index_main {
    // min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 140rpx; /* 为底部导航预留空间 */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    color: #333;
    background: #F8F9FA;

    .item_score {
      padding: 10rpx 0 0 30rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #4379bb;
    }

    .item_title {
      padding: 44rpx 0 0 30rpx;
      font-weight: bold;
      font-size: 32rpx;
      color: #4379bb;
    }

    .prctice_main_end {
      width: calc(100% - 60rpx);
      margin: 28rpx 30rpx;
      height: 165rpx;
      background-image: url(static/index/wrongs.png);
      background-size: 100% 100%;

      .end_title {
        padding: 44rpx 32rpx 0 32rpx;
        font-weight: bold;
        font-size: 32rpx;
        color: #4e5c9b;
      }

      .end_content {
        padding: 0 32rpx 0 32rpx;
        font-weight: 400;
        font-size: 24rpx;
        color: #4e5c9b;
      }
    }

    .practice_main_bottom {
      width: calc(100% - 60rpx);
      margin: 28rpx 30rpx;
      display: flex;

      .left_item {
        width: calc(50% - 15rpx);
        height: 164rpx;
        background-image: url(static/index/highway.png);
        background-size: 100% 100%;

        .item_content {
          margin-top: 15rpx;
          width: 184rpx;
          padding: 0 0 0 28rpx;
          font-weight: 400;
          font-size: 24rpx;
          color: #0073e9;
        }

        .item_title {
          padding: 46rpx 27rpx 0 27rpx;
          font-weight: bold;
          font-size: 32rpx;
          color: #0073e9;
        }
      }

      .right_item {
        margin-left: 30rpx;
        width: calc(50% - 15rpx);

        .right_item_top {
          width: 100%;
          height: 164rpx;
          background-image: url(static/index/theory.png);
          background-size: 100% 100%;
        }
      }
    }

    .practice_main_top {
      width: calc(100% - 60rpx);
      margin: 28rpx 30rpx;
      display: flex;

      .left_item {
        width: calc(50% - 15rpx);
        height: 359rpx;
        background-image: url(static/index/mock.png);
        background-size: 100% 100%;

        .item_content {
          margin-top: 15rpx;
          width: 184rpx;
          padding: 0 0 0 28rpx;
          font-weight: 400;
          font-size: 24rpx;
          color: #0073e9;
        }

        .item_title {
          padding: 46rpx 27rpx 0 27rpx;
          font-weight: bold;
          font-size: 32rpx;
          color: #0073e9;
        }
      }

      .right_item {
        margin-left: 30rpx;
        width: calc(50% - 15rpx);

        .right_item_top {
          width: 100%;
          height: 164rpx;
          background-image: url(static/index/theory.png);
          background-size: 100% 100%;
        }

        .right_item_bottom {
          margin-top: 31rpx;
          width: 100%;
          height: 164rpx;
          background-image: url(static/index/hazard.png);
          background-size: 100% 100%;
        }
      }
    }

    .banner_main {
      width: calc(100% - 60rpx);
      margin: 0 30rpx;
      height: 233rpx;
      background: #d7d7d7;
      border-radius: 16rpx;
    }

    .search_main {
      width: calc(100% - 60rpx);
      margin: 0 30rpx 29rpx 30rpx;
      height: 83rpx;
      background: #ffffff;
      border-radius: 42rpx;
      display: flex;

      .search_text {
        line-height: 83rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
      }

      .search_icon {
        padding: 23rpx 15rpx 0 33rpx;

        img {
          width: 29rpx;
          height: 32rpx;
        }
      }
    }
  }
</style>